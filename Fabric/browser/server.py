"""Backlog Browser — local FastAPI server.

Serves the pre-built Angular SPA and a JSON API that reads the team's
backlog markdown files.  Use the launcher instead of running this directly:

    python backlog/browser/browser.py

Or pass --root explicitly:

    python backlog/browser/browser.py --root /path/to/team-repo
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import threading
import webbrowser
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel

import parser as bp  # backlog parser

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

DIST = Path(__file__).parent / "app" / "dist" / "browser"

_tree_cache: dict | None = None
_repo_root: Path | None = None


def discover_root(cli_root: str | None) -> Path:
    if cli_root:
        root = Path(cli_root).resolve()
        if not (root / "backlog" / "epics").exists():
            sys.exit(f"--root {cli_root}: no backlog/epics/ directory found there")
        return root
    candidate = Path.cwd()
    for _ in range(6):
        if (candidate / "backlog" / "epics").exists():
            return candidate
        candidate = candidate.parent
    sys.exit(
        "Could not find backlog/epics/ in this directory or any parent.\n"
        "Run from your team repo root, or pass --root <path>."
    )


def get_tree(refresh: bool = False) -> dict:
    global _tree_cache
    if _tree_cache is None or refresh:
        _tree_cache = bp.parse_all(_repo_root)
    return _tree_cache


def safe_path(raw: str) -> Path | None:
    """Resolve a repo-relative path and verify it stays inside repo_root."""
    try:
        p = (_repo_root / raw).resolve()
        p.relative_to(_repo_root)  # raises ValueError if outside
        return p
    except (ValueError, Exception):
        return None


# ---------------------------------------------------------------------------
# Request body models
# ---------------------------------------------------------------------------

class SaveItemBody(BaseModel):
    path: str
    content: str


class CommitBody(BaseModel):
    message: str


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(docs_url=None, redoc_url=None)


# -- API routes ---------------------------------------------------------------

@app.get("/api/backlog")
def api_backlog(refresh: str = Query(default="0")):
    return get_tree(refresh == "1")


@app.get("/api/stats")
def api_stats():
    return bp.compute_stats(get_tree())


@app.get("/api/item")
def api_item_get(path: str = Query(default="")):
    if not path:
        return JSONResponse({"error": "path required"}, status_code=400)
    p = safe_path(path)
    if p is None or not p.exists():
        return JSONResponse({"error": "not found"}, status_code=404)
    text = p.read_text(encoding="utf-8")
    kind = _infer_kind(p)
    entity = bp.parse_entity(p, _repo_root, kind)
    entity["html"] = bp.render_to_html(text)
    entity["raw"] = text
    return entity


@app.put("/api/item")
def api_item_put(body: SaveItemBody):
    if not body.path:
        return JSONResponse({"error": "path required"}, status_code=400)
    p = safe_path(body.path)
    if p is None:
        return JSONResponse({"error": "invalid path"}, status_code=400)
    if not p.exists():
        return JSONResponse({"error": "file not found"}, status_code=404)
    p.write_text(body.content, encoding="utf-8")
    global _tree_cache
    _tree_cache = None
    kind = _infer_kind(p)
    entity = bp.parse_entity(p, _repo_root, kind)
    entity["html"] = bp.render_to_html(body.content)
    entity["raw"] = body.content
    return entity


@app.get("/api/search")
def api_search(q: str = Query(default=""), include_closed: str = Query(default="0")):
    return bp.search_all(_repo_root, q.strip(), include_closed == "1")


@app.post("/api/git/commit")
def api_git_commit(body: CommitBody):
    if not body.message.strip():
        return JSONResponse({"error": "commit message required"}, status_code=400)
    try:
        subprocess.run(
            ["git", "add", "backlog/", "requests/"],
            cwd=_repo_root, check=True, capture_output=True, text=True,
        )
        result = subprocess.run(
            ["git", "commit", "-m", body.message.strip()],
            cwd=_repo_root, capture_output=True, text=True,
        )
        if result.returncode == 0:
            return {"ok": True, "output": result.stdout.strip()}
        return JSONResponse({"ok": False, "output": result.stdout + result.stderr}, status_code=400)
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=500)


@app.post("/api/git/push")
def api_git_push():
    try:
        result = subprocess.run(
            ["git", "push"],
            cwd=_repo_root, capture_output=True, text=True,
        )
        output = (result.stdout + result.stderr).strip()
        if result.returncode == 0:
            return {"ok": True, "output": output}
        return JSONResponse({"ok": False, "output": output}, status_code=400)
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=500)


# -- Static file serving (Angular SPA) — must be last -------------------------

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    if full_path:
        file_path = DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
    index = DIST / "index.html"
    if index.exists():
        return FileResponse(index)
    return HTMLResponse(
        "<h2>Backlog Browser</h2>"
        "<p>The Angular app has not been built yet. "
        "See <code>README.md</code> for build instructions.<br>"
        "The API is available at <a href='/api/backlog'>/api/backlog</a>.</p>"
    )


# ---------------------------------------------------------------------------
# Kind inference helper
# ---------------------------------------------------------------------------

def _infer_kind(p: Path) -> str:
    name = p.name
    if name == "epic.md":     return "epic"
    if name == "feature.md":  return "feature"
    if name == "workitem.md": return "workitem"
    if name == "request.md":  return "request"
    return "task"


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    import uvicorn

    global _repo_root

    ap = argparse.ArgumentParser(description="Backlog Browser — local web server")
    ap.add_argument("--root",    default=None, help="Path to team repo root (auto-detected if omitted)")
    ap.add_argument("--port",    type=int, default=8082, help="Port to listen on (default: 8082)")
    ap.add_argument("--no-open", action="store_true", help="Do not open a browser automatically")
    args = ap.parse_args()

    _repo_root = discover_root(args.root)

    tree = get_tree()
    stats = bp.compute_stats(tree)
    print()
    print("Backlog Browser")
    print(f"  Root:  {_repo_root}")
    print(
        f"  Epics: {stats['epics']} | "
        f"Features: {stats['features']} | "
        f"Work items: {stats['workitems']} | "
        f"Tasks: {stats['tasks']}"
    )
    print(f"  URL:   http://127.0.0.1:{args.port}")
    print()

    if not args.no_open:
        print("Opening browser... (use --no-open to suppress)")

        def _open():
            import time
            time.sleep(1.2)
            webbrowser.open(f"http://127.0.0.1:{args.port}")

        threading.Thread(target=_open, daemon=True).start()

    print("Press Ctrl+C to stop.\n")
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="warning")


if __name__ == "__main__":
    main()
