#!/usr/bin/env python3
"""Backlog Browser launcher.

Single entry point for all platforms (macOS, Linux, Windows).

Usage:
    python browser.py              # auto-detect repo root, open browser
    python browser.py --root /path/to/repo
    python browser.py --port 9000 --no-open

If app/dist/ is missing and npm is available the Angular app is built first.
Flask is loaded from the current Python environment when possible; otherwise
the script falls back to Poetry to install dependencies.
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


# ---------------------------------------------------------------------------
# Build step
# ---------------------------------------------------------------------------

def _run(*args, cwd=None):
    result = subprocess.run(args, cwd=cwd)
    if result.returncode != 0:
        sys.exit(result.returncode)


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
# Launch step
# ---------------------------------------------------------------------------

def launch():
    # Prefer running server.py in the current process (Flask already importable).
    try:
        import flask  # noqa: F401
        sys.argv = [str(SERVER)] + sys.argv[1:]
        runpy.run_path(str(SERVER), run_name="__main__")
        return
    except ImportError:
        pass

    # Flask not available — try Poetry to install deps then re-run.
    poetry = shutil.which("poetry")
    if not poetry:
        print(
            "ERROR: Flask is not installed and Poetry was not found.\n"
            "Install Poetry (https://python-poetry.org), then re-run this script,\n"
            "or activate a virtual environment that has Flask installed."
        )
        sys.exit(1)

    print("Flask not found in this environment — installing via Poetry...")
    _run(poetry, "install", "--quiet", cwd=BROWSER_DIR)
    result = subprocess.run(
        [poetry, "run", "python", str(SERVER)] + sys.argv[1:],
        cwd=BROWSER_DIR,
    )
    sys.exit(result.returncode)


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if not DIST_INDEX.exists():
        build()
    launch()
