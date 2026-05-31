#!/usr/bin/env python3
"""Generate backlog-index.md: a single browsable index of all requests and the
epic > feature > work item > task backlog hierarchy.

For every entity it captures the title, state, the first paragraph of the
Description (or Summary, for requests), and a repo-relative link to the source
markdown file. Re-running overwrites the index.

Usage:
    python scripts/backlog_index.py            # writes <repo>/backlog-index.md
    python scripts/backlog_index.py --out FILE  # custom output path
"""
from __future__ import annotations

import argparse
import datetime as dt
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "backlog-index.md"

TITLE_RE = re.compile(r"^#\s+(.*\S)\s*$", re.MULTILINE)
STATE_RE = re.compile(r"^-?\s*(?:State|Status):\s*(\S.*?)\s*$", re.MULTILINE)
HEADING_RE = re.compile(r"^##\s+", re.MULTILINE)

# Values that mean "field is not set" (placeholders, defaults, blanks).
UNSET = {"", "none", "tbd", "not set", "n/a", "na", "—", "-"}


def field_value(text: str, name: str) -> str:
    """Return a property value, or '' if absent or an unset placeholder."""
    m = re.search(rf"^-?\s*{re.escape(name)}:\s*(.*?)\s*$", text, re.MULTILINE)
    if not m:
        return ""
    val = m.group(1).strip()
    if not val or val.startswith("[") or val.lower() in UNSET:
        return ""
    return val


def format_dates(start: str, target: str) -> str:
    """Compact date span: '(2026-05-01 → 2027-01-01)', or one-sided variants."""
    if start and target:
        return f" 📅 {start} → {target}"
    if start:
        return f" 📅 starts {start}"
    if target:
        return f" 📅 due {target}"
    return ""


def parse_entity(path: Path) -> dict:
    """Pull title, state, and first description paragraph from an entity file."""
    text = path.read_text(encoding="utf-8")

    title_match = TITLE_RE.search(text)
    title = title_match.group(1).strip() if title_match else path.stem

    state_match = STATE_RE.search(text)
    state = state_match.group(1).strip() if state_match else "—"

    return {
        "title": title,
        "state": state,
        "dates": format_dates(field_value(text, "Start Date"),
                              field_value(text, "Target Date")),
        "desc": first_paragraph(text, ("Description", "Summary")),
        "link": path.relative_to(REPO_ROOT).as_posix(),
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
        rows.append(parse_entity(request_md))
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
        epic = parse_entity(epic_md)
        epic["features"] = []
        for feat_path in sorted((epic_path / "features").glob("*/")) if (epic_path / "features").exists() else []:
            feat_md = feat_path / "feature.md"
            if not feat_md.exists():
                continue
            feature = parse_entity(feat_md)
            feature["workitems"] = []
            wi_root = feat_path / "workitems"
            for wi_path in sorted(wi_root.glob("*/")) if wi_root.exists() else []:
                wi_md = wi_path / "workitem.md"
                if not wi_md.exists():
                    continue
                wi = parse_entity(wi_md)
                wi["tasks"] = []
                task_root = wi_path / "tasks"
                if task_root.exists():
                    for task_md in sorted(task_root.glob("*.md")):
                        wi["tasks"].append(parse_entity(task_md))
                feature["workitems"].append(wi)
            epic["features"].append(feature)
        epics.append(epic)
    return epics


def fmt(entity: dict, indent: int, kind: str) -> str:
    pad = "  " * indent
    desc = f" — {entity['desc']}" if entity["desc"] else ""
    return (f"{pad}- **{kind}: [{entity['title']}]({entity['link']})** — "
            f"`{entity['state']}`{entity['dates']}{desc}\n")


def render(requests: list[dict], epics: list[dict]) -> str:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    n_feat = sum(len(e["features"]) for e in epics)
    n_wi = sum(len(f["workitems"]) for e in epics for f in e["features"])
    n_task = sum(len(w["tasks"]) for e in epics for f in e["features"] for w in f["workitems"])

    out = [
        "# Backlog Index\n\n",
        f"_Generated {now} by `scripts/backlog_index.py` — do not edit by hand; re-run to refresh._\n\n",
        f"**{len(requests)}** requests · **{len(epics)}** epics · "
        f"**{n_feat}** features · **{n_wi}** work items · **{n_task}** tasks\n\n",
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate backlog-index.md")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, help="output path")
    args = parser.parse_args()

    requests = collect_requests()
    epics = collect_backlog()
    args.out.write_text(render(requests, epics), encoding="utf-8")
    print(f"Wrote {args.out.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
