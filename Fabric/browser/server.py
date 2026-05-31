"""Backlog Browser — local Flask server.

Serves the pre-built Angular SPA and a JSON API that reads the team's
backlog markdown files.  Run from your team repo root:

    cd backlog/browser
    poetry install          # one-time
    poetry run python server.py

Or pass --root explicitly:

    poetry run python server.py --root /path/to/team-repo
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import threading
import webbrowser
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

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
# Flask app
# ---------------------------------------------------------------------------

app = Flask(__name__, static_folder=None)


# -- API routes ---------------------------------------------------------------

@app.route("/api/backlog")
def api_backlog():
    refresh = request.args.get("refresh") == "1"
    return jsonify(get_tree(refresh))


@app.route("/api/stats")
def api_stats():
    return jsonify(bp.compute_stats(get_tree()))


@app.route("/api/item", methods=["GET"])
def api_item_get():
    raw = request.args.get("path", "")
    if not raw:
        return jsonify({"error": "path required"}), 400
    p = safe_path(raw)
    if p is None or not p.exists():
        return jsonify({"error": "not found"}), 404
    text = p.read_text(encoding="utf-8")
    kind = _infer_kind(p)
    entity = bp.parse_entity(p, _repo_root, kind)
    entity["html"] = bp.render_to_html(text)
    entity["raw"] = text
    return jsonify(entity)


@app.route("/api/item", methods=["PUT"])
def api_item_put():
    data = request.get_json(force=True)
    raw = (data or {}).get("path", "")
    content = (data or {}).get("content", "")
    if not raw:
        return jsonify({"error": "path required"}), 400
    p = safe_path(raw)
    if p is None:
        return jsonify({"error": "invalid path"}), 400
    if not p.exists():
        return jsonify({"error": "file not found"}), 404
    p.write_text(content, encoding="utf-8")
    # Bust cache so next /api/backlog reflects the change
    global _tree_cache
    _tree_cache = None
    # Return the re-parsed entity
    kind = _infer_kind(p)
    entity = bp.parse_entity(p, _repo_root, kind)
    entity["html"] = bp.render_to_html(content)
    entity["raw"] = content
    return jsonify(entity)


@app.route("/api/search")
def api_search():
    q = request.args.get("q", "").strip()
    include_closed = request.args.get("include_closed", "0") == "1"
    results = bp.search_all(_repo_root, q, include_closed)
    return jsonify(results)


@app.route("/api/git/commit", methods=["POST"])
def api_git_commit():
    data = request.get_json(force=True)
    message = (data or {}).get("message", "").strip()
    if not message:
        return jsonify({"error": "commit message required"}), 400
    try:
        # Stage backlog and requests directories
        subprocess.run(
            ["git", "add", "backlog/", "requests/"],
            cwd=_repo_root, check=True, capture_output=True, text=True,
        )
        result = subprocess.run(
            ["git", "commit", "-m", message],
            cwd=_repo_root, capture_output=True, text=True,
        )
        if result.returncode == 0:
            return jsonify({"ok": True, "output": result.stdout.strip()})
        return jsonify({"ok": False, "output": result.stdout + result.stderr}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/git/push", methods=["POST"])
def api_git_push():
    try:
        result = subprocess.run(
            ["git", "push"],
            cwd=_repo_root, capture_output=True, text=True,
        )
        output = (result.stdout + result.stderr).strip()
        if result.returncode == 0:
            return jsonify({"ok": True, "output": output})
        return jsonify({"ok": False, "output": output}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# -- Static file serving (Angular SPA) ----------------------------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path: str):
    if path and (DIST / path).exists():
        return send_from_directory(DIST, path)
    index = DIST / "index.html"
    if index.exists():
        return send_from_directory(DIST, "index.html")
    return (
        "<h2>Backlog Browser</h2>"
        "<p>The Angular app has not been built yet. "
        "See <code>README.md</code> for build instructions.<br>"
        "The API is available at <a href='/api/backlog'>/api/backlog</a>.</p>",
        200,
    )


# ---------------------------------------------------------------------------
# Kind inference helper
# ---------------------------------------------------------------------------

def _infer_kind(p: Path) -> str:
    name = p.name
    if name == "epic.md":
        return "epic"
    if name == "feature.md":
        return "feature"
    if name == "workitem.md":
        return "workitem"
    if name == "request.md":
        return "request"
    return "task"


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    global _repo_root

    ap = argparse.ArgumentParser(description="Backlog Browser — local web server")
    ap.add_argument("--root", default=None, help="Path to team repo root (auto-detected if omitted)")
    ap.add_argument("--port", type=int, default=8082, help="Port to listen on (default: 8082)")
    ap.add_argument("--no-open", action="store_true", help="Do not open a browser automatically")
    args = ap.parse_args()

    _repo_root = discover_root(args.root)

    # Warm the cache and print startup summary
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
    app.run(host="127.0.0.1", port=args.port, debug=False)


if __name__ == "__main__":
    main()
