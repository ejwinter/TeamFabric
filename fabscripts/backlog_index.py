#!/usr/bin/env python3
"""Generate the backlog index: a browsable index of all requests and the
epic > feature > work item > task backlog hierarchy.

Three artifacts are written side by side (from one scan):

  backlog-index.md       Rich, human-readable index. One line per entity with
                         the first paragraph of the Description (or Summary).
  backlog-index.slim.md  Compact, AGENT-FACING index. One line per entity with
                         the fields you filter on (state, type, assignee,
                         iteration, priority, blocked, labels, due date) and NO
                         description prose. Cheap to load fully; consult it
                         before scanning the tree, then open only the files it
                         links to.
  backlog-index.json     Machine-readable dump of the same data plus counts,
                         for deterministic, zero-LLM-token filtering by scripts.

Usage:
    python fabscripts/backlog_index.py              # write all three (repo root)
    python fabscripts/backlog_index.py --out FILE   # rich index path; slim/json
                                                    #   derived as siblings
    python fabscripts/backlog_index.py --check      # exit 1 (print STALE) if any
                                                    #   entity is newer than the
                                                    #   index; filesystem-only
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "backlog-index.md"

TITLE_RE = re.compile(r"^#\s+(.*\S)\s*$", re.MULTILINE)
# Note: H = horizontal whitespace only ([^\S\r\n]). A plain \s* would match
# newlines, so an empty field (e.g. "Effort:\nExternal: None") would bleed its
# value in from the following line. Keep property matches on a single line.
STATE_RE = re.compile(r"^-?[^\S\r\n]*(?:State|Status):[^\S\r\n]*(\S.*?)[^\S\r\n]*$", re.MULTILINE)
HEADING_RE = re.compile(r"^##\s+", re.MULTILINE)

# Values that mean "field is not set" (placeholders, defaults, blanks).
UNSET = {"", "none", "tbd", "not set", "n/a", "na", "—", "-"}


def field_value(text: str, name: str) -> str:
    """Return a property value, or '' if absent or an unset placeholder."""
    m = re.search(rf"^-?[^\S\r\n]*{re.escape(name)}:[^\S\r\n]*(.*?)[^\S\r\n]*$", text, re.MULTILINE)
    if not m:
        return ""
    val = m.group(1).strip()
    if not val or val.startswith("[") or val.lower() in UNSET:
        return ""
    return val


def is_truthy(val: str) -> bool:
    """Whether a flag-style property (e.g. Blocked) is set to an affirmative."""
    return val.strip().lower() in {"yes", "true", "y", "1"}


def format_dates(start: str, target: str) -> str:
    """Compact date span: '(2026-05-01 → 2027-01-01)', or one-sided variants."""
    if start and target:
        return f" 📅 {start} → {target}"
    if start:
        return f" 📅 starts {start}"
    if target:
        return f" 📅 due {target}"
    return ""


def parse_entity(path: Path, kind: str) -> dict:
    """Pull title, state, filter fields, and first description paragraph."""
    text = path.read_text(encoding="utf-8")

    title_match = TITLE_RE.search(text)
    title = title_match.group(1).strip() if title_match else path.stem

    state_match = STATE_RE.search(text)
    state = state_match.group(1).strip() if state_match else "—"

    start = field_value(text, "Start Date")
    target = field_value(text, "Target Date")

    # Entity id is the folder name (file stem for tasks).
    entity_id = path.stem if kind == "task" else path.parent.name

    return {
        "id": entity_id,
        "kind": kind,
        "title": title,
        "state": state,
        "start": start,
        "target": target,
        "dates": format_dates(start, target),
        "desc": first_paragraph(text, ("Description", "Summary")),
        "link": path.relative_to(REPO_ROOT).as_posix(),
        # Filter fields (empty string when unset).
        "type": field_value(text, "Type"),
        "assigned": field_value(text, "Assigned to"),
        "iteration": field_value(text, "Iteration"),
        "priority": field_value(text, "Priority"),
        "labels": field_value(text, "Labels"),
        "blocked": is_truthy(field_value(text, "Blocked")),
        # Request-specific cross-references / fields (empty for backlog entities).
        "owner": field_value(text, "Owner"),
        "backlog_epic": field_value(text, "Backlog Epic"),
        "backlog_feature": field_value(text, "Backlog Feature"),
        "effort": field_value(text, "Effort"),
    }


def first_paragraph(text: str, section_names: tuple[str, ...]) -> str:
    """Return the first non-empty paragraph under the first matching section."""
    for name in section_names:
        m = re.search(rf"^##\s+{re.escape(name)}\s*$", text, re.MULTILINE)
        if not m:
            continue
        body = text[m.end():]
        # stop at the next level-2 heading
        next_heading = HEADING_RE.search(body)
        if next_heading:
            body = body[: next_heading.start()]
        # first non-empty paragraph (lines up to a blank line)
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


def collect_requests() -> list[dict]:
    req_dir = REPO_ROOT / "requests"
    rows = []
    if not req_dir.exists():
        return rows
    for request_md in sorted(req_dir.glob("R-*/request.md")):
        rows.append(parse_entity(request_md, "request"))
    return rows


def collect_backlog() -> list[dict]:
    """Build the nested epic > feature > work item > task tree."""
    epics_dir = REPO_ROOT / "backlog" / "epics"
    epics = []
    if not epics_dir.exists():
        return epics
    for epic_path in sorted(epics_dir.iterdir()):
        epic_md = epic_path / "epic.md"
        if not epic_md.exists():
            continue
        epic = parse_entity(epic_md, "epic")
        epic["features"] = []
        for feat_path in sorted((epic_path / "features").glob("*/")) if (epic_path / "features").exists() else []:
            feat_md = feat_path / "feature.md"
            if not feat_md.exists():
                continue
            feature = parse_entity(feat_md, "feature")
            feature["workitems"] = []
            wi_root = feat_path / "workitems"
            for wi_path in sorted(wi_root.glob("*/")) if wi_root.exists() else []:
                wi_md = wi_path / "workitem.md"
                if not wi_md.exists():
                    continue
                wi = parse_entity(wi_md, "workitem")
                wi["tasks"] = []
                task_root = wi_path / "tasks"
                if task_root.exists():
                    for task_md in sorted(task_root.glob("*.md")):
                        wi["tasks"].append(parse_entity(task_md, "task"))
                feature["workitems"].append(wi)
            epic["features"].append(feature)
        epics.append(epic)
    return epics


def counts(requests: list[dict], epics: list[dict]) -> dict:
    n_feat = sum(len(e["features"]) for e in epics)
    n_wi = sum(len(f["workitems"]) for e in epics for f in e["features"])
    n_task = sum(len(w["tasks"]) for e in epics for f in e["features"] for w in f["workitems"])
    return {
        "requests": len(requests),
        "epics": len(epics),
        "features": n_feat,
        "workitems": n_wi,
        "tasks": n_task,
    }


def count_line(c: dict) -> str:
    return (f"**{c['requests']}** requests · **{c['epics']}** epics · "
            f"**{c['features']}** features · **{c['workitems']}** work items · "
            f"**{c['tasks']}** tasks")


# ---------------------------------------------------------------------------
# Rich human-readable index (backlog-index.md) — unchanged layout
# ---------------------------------------------------------------------------

def fmt(entity: dict, indent: int, kind: str) -> str:
    pad = "    " * indent
    desc = f" — {entity['desc']}" if entity["desc"] else ""
    return (f"{pad}- **{kind}: [{entity['title']}]({entity['link']})** — "
            f"`{entity['state']}`{entity['dates']}{desc}\n")


def render(requests: list[dict], epics: list[dict]) -> str:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    out = [
        "# Backlog Index\n\n",
        f"_Generated {now} by `fabscripts/backlog_index.py` — do not edit by hand; re-run to refresh._\n\n",
        count_line(counts(requests, epics)) + "\n\n",
    ]

    out.append("## Requests\n\n")
    if requests:
        for r in requests:
            out.append(fmt(r, 0, "Request"))
    else:
        out.append("_No requests._\n")
    out.append("\n")

    out.append("## Backlog\n\n")
    if not epics:
        out.append("_No epics._\n")
    for epic in epics:
        out.append(fmt(epic, 0, "Epic"))
        for feature in epic["features"]:
            out.append(fmt(feature, 1, "Feature"))
            for wi in feature["workitems"]:
                out.append(fmt(wi, 2, "Work Item"))
                for task in wi["tasks"]:
                    out.append(fmt(task, 3, "Task"))
        out.append("\n")

    return "".join(out)


# ---------------------------------------------------------------------------
# Slim agent-facing index (backlog-index.slim.md)
# ---------------------------------------------------------------------------

def badges(entity: dict) -> str:
    """Compact ' · '-joined filter fields, present-only."""
    parts: list[str] = []
    if entity["kind"] == "workitem" and entity["type"]:
        parts.append(entity["type"])
    if entity["owner"]:
        parts.append(f"owner {entity['owner']}")
    if entity["assigned"]:
        parts.append(f"@{entity['assigned']}")
    if entity["iteration"]:
        parts.append(f"iter {entity['iteration']}")
    if entity["priority"]:
        parts.append(f"P{entity['priority']}")
    if entity["blocked"]:
        parts.append("⛔ blocked")
    if entity["target"]:
        parts.append(f"due {entity['target']}")
    ref = entity["backlog_epic"] or entity["backlog_feature"]
    if ref:
        parts.append(f"→ {ref}")
    if entity["effort"]:
        parts.append(f"effort {entity['effort']}")
    if entity["labels"]:
        parts.append(f"[{entity['labels']}]")
    return (" · " + " · ".join(parts)) if parts else ""


def fmt_slim(entity: dict, indent: int, kind: str) -> str:
    pad = "    " * indent
    return (f"{pad}- {kind} [{entity['title']}]({entity['link']}) — "
            f"`{entity['state']}`{badges(entity)}\n")


def render_slim(requests: list[dict], epics: list[dict]) -> str:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    out = [
        "# Backlog Index (slim)\n\n",
        f"_Generated {now} by `fabscripts/backlog_index.py` — agent-facing compact index. "
        "Consult this before scanning the backlog/requests tree; open only the files it links to. "
        "Re-run the script to refresh after editing any entity._\n\n",
        count_line(counts(requests, epics)) + "\n\n",
    ]

    out.append("## Requests\n\n")
    if requests:
        for r in requests:
            out.append(fmt_slim(r, 0, "Request"))
    else:
        out.append("_No requests._\n")
    out.append("\n")

    out.append("## Backlog\n\n")
    if not epics:
        out.append("_No epics._\n")
    for epic in epics:
        out.append(fmt_slim(epic, 0, "Epic"))
        for feature in epic["features"]:
            out.append(fmt_slim(feature, 1, "Feature"))
            for wi in feature["workitems"]:
                out.append(fmt_slim(wi, 2, "Work Item"))
                for task in wi["tasks"]:
                    out.append(fmt_slim(task, 3, "Task"))
        out.append("\n")

    return "".join(out)


# ---------------------------------------------------------------------------
# Machine-readable index (backlog-index.json)
# ---------------------------------------------------------------------------

# Fields carried in the JSON, pruned to non-empty values per entity.
_JSON_FIELDS = ("id", "kind", "title", "state", "start", "target", "desc", "link",
                "type", "assigned", "iteration", "priority", "labels", "blocked",
                "owner", "backlog_epic", "backlog_feature", "effort")


def _entity_json(entity: dict) -> dict:
    out = {}
    for k in _JSON_FIELDS:
        v = entity.get(k, "")
        if v in ("", False):  # prune empty strings and the unset blocked flag
            continue
        out[k] = v
    for child_key in ("features", "workitems", "tasks"):
        if entity.get(child_key):
            out["children"] = [_entity_json(c) for c in entity[child_key]]
            break
    return out


def render_json(requests: list[dict], epics: list[dict]) -> str:
    payload = {
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "counts": counts(requests, epics),
        "requests": [_entity_json(r) for r in requests],
        "backlog": [_entity_json(e) for e in epics],
    }
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


# ---------------------------------------------------------------------------
# Freshness check (filesystem-only; no parsing, no LLM tokens)
# ---------------------------------------------------------------------------

def _entity_mtimes() -> list[float]:
    """mtimes of every backlog/request entity file (entity data only)."""
    times: list[float] = []
    epics_dir = REPO_ROOT / "backlog" / "epics"
    if epics_dir.exists():
        times += [p.stat().st_mtime for p in epics_dir.rglob("*.md")]
    req_dir = REPO_ROOT / "requests"
    if req_dir.exists():
        times += [p.stat().st_mtime for p in req_dir.glob("R-*/**/*.md")]
    return times


def check_fresh(out: Path) -> int:
    """Return 0 if the index is up to date, 1 (and print STALE) otherwise."""
    slim = out.with_suffix(".slim.md")
    js = out.with_suffix(".json")
    targets = [out, slim, js]
    missing = [t for t in targets if not t.exists()]
    if missing:
        print("STALE: index artifact(s) missing — "
              + ", ".join(t.name for t in missing))
        return 1
    index_mtime = min(t.stat().st_mtime for t in targets)
    entity_times = _entity_mtimes()
    newest = max(entity_times) if entity_times else 0.0
    if newest > index_mtime:
        print("STALE: backlog/requests changed since the index was generated — "
              "re-run `python fabscripts/backlog_index.py`")
        return 1
    print("fresh")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate the backlog index (rich + slim + json)")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT,
                        help="rich index output path; slim/json derived as siblings")
    parser.add_argument("--check", action="store_true",
                        help="exit 1 (print STALE) if entities are newer than the index")
    args = parser.parse_args()

    out = args.out
    if args.check:
        return check_fresh(out)

    requests = collect_requests()
    epics = collect_backlog()

    slim = out.with_suffix(".slim.md")
    js = out.with_suffix(".json")
    out.write_text(render(requests, epics), encoding="utf-8")
    slim.write_text(render_slim(requests, epics), encoding="utf-8")
    js.write_text(render_json(requests, epics), encoding="utf-8")
    for p in (out, slim, js):
        try:
            shown = p.relative_to(REPO_ROOT)
        except ValueError:
            shown = p
        print(f"Wrote {shown}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
