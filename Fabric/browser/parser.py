"""Backlog parser: walks the epic→feature→workitem→task hierarchy and
returns structured dicts suitable for JSON serialisation.

Adapted from fabscripts/backlog_index.py.  Key additions:
  - parse_properties() extracts every ## Properties key/value
  - render_to_html() converts markdown to safe HTML (stdlib only)
  - search_all() does full-text search across every entity file
  - All functions accept an explicit repo_root Path argument
"""
from __future__ import annotations

import html
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Regexes
# ---------------------------------------------------------------------------
TITLE_RE = re.compile(r"^#\s+(.*\S)\s*$", re.MULTILINE)
STATE_RE = re.compile(r"^-?\s*(?:State|Status):\s*(\S.*?)\s*$", re.MULTILINE)
HEADING_RE = re.compile(r"^##\s+", re.MULTILINE)
PROP_LINE_RE = re.compile(r"^-?\s*([^:\n]+?):\s*(.*?)\s*$", re.MULTILINE)

UNSET = {"", "none", "tbd", "not set", "n/a", "na", "—", "-"}
CLOSED_STATES = {"closed", "removed"}


# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------

def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _field(text: str, name: str) -> str:
    m = re.search(rf"^-?\s*{re.escape(name)}:\s*(.*?)\s*$", text, re.MULTILINE)
    if not m:
        return ""
    val = m.group(1).strip()
    if not val or val.startswith("[") or val.lower() in UNSET:
        return ""
    return val


def _first_paragraph(text: str, *section_names: str) -> str:
    for name in section_names:
        m = re.search(rf"^##\s+{re.escape(name)}\s*$", text, re.MULTILINE)
        if not m:
            continue
        body = text[m.end():]
        nxt = HEADING_RE.search(body)
        if nxt:
            body = body[: nxt.start()]
        para: list[str] = []
        for line in body.splitlines():
            stripped = line.strip()
            if not stripped:
                if para:
                    break
                continue
            if stripped.startswith("<!--"):
                continue
            para.append(stripped)
        if para:
            return " ".join(para)
    return ""


def parse_properties(text: str) -> dict[str, str]:
    """Extract all key: value pairs from the ## Properties section."""
    m = re.search(r"^##\s+Properties\s*$", text, re.MULTILINE)
    if not m:
        # fall back: scan the whole file for property-like lines before first ##
        block = text
        nxt = HEADING_RE.search(text)
        if nxt:
            block = text[: nxt.start()]
    else:
        body = text[m.end():]
        nxt = HEADING_RE.search(body)
        block = body[: nxt.start()] if nxt else body

    props: dict[str, str] = {}
    for line in block.splitlines():
        pm = PROP_LINE_RE.match(line.strip())
        if not pm:
            continue
        key = pm.group(1).strip()
        val = pm.group(2).strip()
        if not key or val.startswith("[") or val.lower() in UNSET:
            continue
        props[key] = val
    return props


# ---------------------------------------------------------------------------
# Markdown → HTML (stdlib only, best-effort)
# ---------------------------------------------------------------------------

def render_to_html(text: str) -> str:
    """Convert a markdown entity file to safe HTML."""
    # 1. Strip HTML comments
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)

    lines = text.splitlines()
    out: list[str] = []
    in_code = False
    in_list = False

    def flush_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    for line in lines:
        # Fenced code blocks
        if line.strip().startswith("```"):
            flush_list()
            if in_code:
                out.append("</code></pre>")
                in_code = False
            else:
                lang = line.strip()[3:].strip()
                cls = f' class="language-{html.escape(lang)}"' if lang else ""
                out.append(f"<pre><code{cls}>")
                in_code = True
            continue
        if in_code:
            out.append(html.escape(line))
            continue

        # Headings
        hm = re.match(r"^(#{1,6})\s+(.*)", line)
        if hm:
            flush_list()
            level = len(hm.group(1))
            content = _inline(hm.group(2))
            out.append(f"<h{level}>{content}</h{level}>")
            continue

        # Horizontal rule
        if re.match(r"^[-*_]{3,}\s*$", line):
            flush_list()
            out.append("<hr>")
            continue

        # List items (unordered: -, *, +)
        lm = re.match(r"^(\s*)[-*+]\s+(.*)", line)
        if lm:
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{_inline(lm.group(2))}</li>")
            continue

        # Ordered list
        olm = re.match(r"^(\s*)\d+\.\s+(.*)", line)
        if olm:
            flush_list()
            out.append(f"<ol><li>{_inline(olm.group(2))}</li></ol>")
            continue

        flush_list()

        # Blank line → paragraph break
        if not line.strip():
            out.append("")
            continue

        out.append(f"<p>{_inline(line)}</p>")

    flush_list()
    if in_code:
        out.append("</code></pre>")

    # Collapse consecutive <p> and merge blank lines
    return "\n".join(out)


def _inline(text: str) -> str:
    """Apply inline markdown formatting to an already-html-escaped-safe string."""
    # Escape HTML first
    t = html.escape(text)
    # Bold+italic: ***text*** or ___text___
    t = re.sub(r"\*{3}(.+?)\*{3}", r"<strong><em>\1</em></strong>", t)
    t = re.sub(r"_{3}(.+?)_{3}", r"<strong><em>\1</em></strong>", t)
    # Bold
    t = re.sub(r"\*{2}(.+?)\*{2}", r"<strong>\1</strong>", t)
    t = re.sub(r"_{2}(.+?)_{2}", r"<strong>\1</strong>", t)
    # Italic
    t = re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)
    t = re.sub(r"_(.+?)_", r"<em>\1</em>", t)
    # Inline code
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    # Links  [text](url)  — url was html-escaped, we need to unescape for href
    t = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>',
        t,
    )
    # Strikethrough
    t = re.sub(r"~~(.+?)~~", r"<del>\1</del>", t)
    return t


# ---------------------------------------------------------------------------
# Entity parsing
# ---------------------------------------------------------------------------

def parse_entity(path: Path, repo_root: Path, kind: str) -> dict:
    text = _read(path)
    tm = TITLE_RE.search(text)
    title = tm.group(1).strip() if tm else path.stem
    sm = STATE_RE.search(text)
    state = sm.group(1).strip() if sm else "—"
    props = parse_properties(text)
    start = _field(text, "Start Date")
    target = _field(text, "Target Date")
    desc = _first_paragraph(text, "Description", "Summary")
    return {
        "id": path.parent.name if path.name != path.parent.name else path.stem,
        "kind": kind,
        "title": title,
        "state": state,
        "path": path.relative_to(repo_root).as_posix(),
        "properties": props,
        "desc": desc,
        "dates": {"start": start, "target": target},
    }


# ---------------------------------------------------------------------------
# Hierarchy collection
# ---------------------------------------------------------------------------

def collect_tasks(wi_path: Path, repo_root: Path) -> list[dict]:
    task_dir = wi_path / "tasks"
    if not task_dir.exists():
        return []
    tasks = []
    for task_md in sorted(task_dir.glob("*.md")):
        e = parse_entity(task_md, repo_root, "task")
        e["id"] = task_md.stem
        tasks.append(e)
    return tasks


def collect_workitems(feat_path: Path, repo_root: Path) -> list[dict]:
    wi_root = feat_path / "workitems"
    if not wi_root.exists():
        return []
    items = []
    for wi_path in sorted(wi_root.glob("*/")):
        wi_md = wi_path / "workitem.md"
        if not wi_md.exists():
            continue
        wi = parse_entity(wi_md, repo_root, "workitem")
        wi["tasks"] = collect_tasks(wi_path, repo_root)
        items.append(wi)
    return items


def collect_features(epic_path: Path, repo_root: Path) -> list[dict]:
    feat_root = epic_path / "features"
    if not feat_root.exists():
        return []
    features = []
    for feat_path in sorted(feat_root.glob("*/")):
        feat_md = feat_path / "feature.md"
        if not feat_md.exists():
            continue
        feat = parse_entity(feat_md, repo_root, "feature")
        feat["workitems"] = collect_workitems(feat_path, repo_root)
        features.append(feat)
    return features


def collect_epics(repo_root: Path) -> list[dict]:
    epics_dir = repo_root / "backlog" / "epics"
    if not epics_dir.exists():
        return []
    epics = []
    for epic_path in sorted(epics_dir.glob("*/")):
        epic_md = epic_path / "epic.md"
        if not epic_md.exists():
            continue
        epic = parse_entity(epic_md, repo_root, "epic")
        epic["features"] = collect_features(epic_path, repo_root)
        epics.append(epic)
    return epics


def collect_requests(repo_root: Path) -> list[dict]:
    req_dir = repo_root / "requests"
    if not req_dir.exists():
        return []
    reqs = []
    for req_md in sorted(req_dir.glob("R-*/request.md")):
        e = parse_entity(req_md, repo_root, "request")
        e["id"] = req_md.parent.name
        reqs.append(e)
    return reqs


def parse_all(repo_root: Path) -> dict:
    import datetime as dt
    epics = collect_epics(repo_root)
    requests = collect_requests(repo_root)
    return {
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "epics": epics,
        "requests": requests,
    }


def compute_stats(tree: dict) -> dict:
    by_state: dict[str, int] = {}

    def tally(state: str) -> None:
        by_state[state] = by_state.get(state, 0) + 1

    n_feat = n_wi = n_task = 0
    for epic in tree["epics"]:
        tally(epic["state"])
        for feat in epic.get("features", []):
            n_feat += 1
            tally(feat["state"])
            for wi in feat.get("workitems", []):
                n_wi += 1
                tally(wi["state"])
                for task in wi.get("tasks", []):
                    n_task += 1
                    tally(task["state"])
    for req in tree.get("requests", []):
        tally(req["state"])

    return {
        "epics": len(tree["epics"]),
        "features": n_feat,
        "workitems": n_wi,
        "tasks": n_task,
        "requests": len(tree["requests"]),
        "by_state": by_state,
    }


# ---------------------------------------------------------------------------
# Full-text search
# ---------------------------------------------------------------------------

def _snippet(text: str, query: str, context: int = 120) -> str:
    """Return a short excerpt surrounding the first match of query in text."""
    idx = text.lower().find(query.lower())
    if idx == -1:
        return ""
    start = max(0, idx - context // 2)
    end = min(len(text), idx + len(query) + context // 2)
    excerpt = text[start:end]
    if start > 0:
        excerpt = "…" + excerpt
    if end < len(text):
        excerpt = excerpt + "…"
    # Bold the match
    pat = re.compile(re.escape(query), re.IGNORECASE)
    excerpt = pat.sub(lambda m: f"**{m.group()}**", excerpt)
    return excerpt


def _iter_all_files(repo_root: Path):
    """Yield (path, kind) for every entity file."""
    epics_dir = repo_root / "backlog" / "epics"
    if epics_dir.exists():
        for epic_path in sorted(epics_dir.glob("*/")):
            if (epic_path / "epic.md").exists():
                yield epic_path / "epic.md", "epic"
            for feat_path in sorted((epic_path / "features").glob("*/")) if (epic_path / "features").exists() else []:
                if (feat_path / "feature.md").exists():
                    yield feat_path / "feature.md", "feature"
                wi_root = feat_path / "workitems"
                if wi_root.exists():
                    for wi_path in sorted(wi_root.glob("*/")):
                        if (wi_path / "workitem.md").exists():
                            yield wi_path / "workitem.md", "workitem"
                        if (wi_path / "tasks").exists():
                            for t in sorted((wi_path / "tasks").glob("*.md")):
                                yield t, "task"
    req_dir = repo_root / "requests"
    if req_dir.exists():
        for req_md in sorted(req_dir.glob("R-*/request.md")):
            yield req_md, "request"


def search_all(repo_root: Path, query: str, include_closed: bool = False) -> list[dict]:
    if not query or not query.strip():
        return []
    results = []
    for path, kind in _iter_all_files(repo_root):
        text = _read(path)
        if query.lower() not in text.lower():
            continue
        e = parse_entity(path, repo_root, kind)
        if kind == "task":
            e["id"] = path.stem
        if not include_closed and e["state"].lower() in CLOSED_STATES:
            continue
        e["snippet"] = _snippet(text, query)
        results.append(e)
    return results
