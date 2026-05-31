#!/usr/bin/env python3
"""Backlog Browser launcher.

Single entry point for all platforms (macOS, Linux, Windows).
The only requirement is Python 3.12+.

Usage:
    python browser.py              # auto-detect repo root, open browser
    python browser.py --root /path/to/repo
    python browser.py --port 9000 --no-open

On first run, a local .venv is created inside this directory and Flask is
installed into it automatically via pip.  No Poetry, no manual pip commands.

If app/dist/ is missing and npm is available the Angular app is built first.
"""
import runpy
import shutil
import subprocess
import sys
from pathlib import Path

BROWSER_DIR = Path(__file__).parent.resolve()
APP_DIR     = BROWSER_DIR / "app"
DIST_INDEX  = APP_DIR / "dist" / "browser" / "index.html"
SERVER      = BROWSER_DIR / "server.py"
VENV_DIR    = BROWSER_DIR / ".venv"

# Platform-specific paths inside the venv
if sys.platform == "win32":
    VENV_PYTHON = VENV_DIR / "Scripts" / "python.exe"
    VENV_PIP    = VENV_DIR / "Scripts" / "pip.exe"
else:
    VENV_PYTHON = VENV_DIR / "bin" / "python"
    VENV_PIP    = VENV_DIR / "bin" / "pip"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _run(*args, cwd=None):
    result = subprocess.run(args, cwd=cwd)
    if result.returncode != 0:
        sys.exit(result.returncode)


# ---------------------------------------------------------------------------
# Build step — only needed when dist/ is absent
# ---------------------------------------------------------------------------

def build():
    print("dist/ not found — building Angular app.")
    npm = shutil.which("npm")
    if not npm:
        print(
            "ERROR: npm not found. Install Node.js (https://nodejs.org) to build the app,\n"
            f"       or place a pre-built dist/ at {APP_DIR / 'dist'}."
        )
        sys.exit(1)

    if not (APP_DIR / "node_modules").exists():
        print("→ npm install")
        _run(npm, "install", cwd=APP_DIR)

    npx = shutil.which("npx") or "npx"
    print("→ ng build")
    _run(npx, "ng", "build", "--configuration", "production", cwd=APP_DIR)
    print("Build complete.\n")


# ---------------------------------------------------------------------------
# Environment setup — creates a local .venv with Flask on first run
# ---------------------------------------------------------------------------

def ensure_env():
    """Ensure Flask is available; create a local .venv via pip if needed."""
    if not VENV_PYTHON.exists():
        print("First-time setup: creating local Python environment...")
        _run(sys.executable, "-m", "venv", str(VENV_DIR))
        print("Installing Flask...")
        _run(str(VENV_PIP), "install", "flask", "--quiet")
        print("Done.\n")


# ---------------------------------------------------------------------------
# Launch step
# ---------------------------------------------------------------------------

def launch():
    # Fast path: Flask is already importable in this interpreter.
    try:
        import flask  # noqa: F401
        sys.argv = [str(SERVER)] + sys.argv[1:]
        runpy.run_path(str(SERVER), run_name="__main__")
        return
    except ImportError:
        pass

    # Flask not available — set up (or reuse) the local .venv and re-exec.
    ensure_env()
    result = subprocess.run(
        [str(VENV_PYTHON), str(SERVER)] + sys.argv[1:],
        cwd=BROWSER_DIR,
    )
    sys.exit(result.returncode)


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if not DIST_INDEX.exists():
        build()
    launch()
