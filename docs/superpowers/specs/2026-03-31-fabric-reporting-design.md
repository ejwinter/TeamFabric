# Fabric Reporting — Design Spec

**Date:** 2026-03-31
**Status:** Approved

## Overview

Add a reporting capability to Fabric that generates reports from the backlog working memory. The primary goal is a high-impact management demo that demonstrates Fabric's value versus ADO + PowerBI workflows — polished, instantly-generated reports from the same markdown files the team already maintains.

Three report types in scope:

- **Mindmap** — radial D3 visualization of the backlog hierarchy
- **Gantt** — D3 timeline of epics, features, and work items
- **Activity** — markdown summary of what changed over a time period

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `Fabric/.claude/skills/reporting.md` | Reporting skill — implicit capability |
| `Fabric/.claude/commands/report.md` | `/report` command — explicit entry point |
| `output/` directory | Gitignored output directory at instance root |

The `output/` directory is created at `/init` time and added to `.gitignore`. It is the single drop zone for all generated report files.

### Skill responsibilities

The `reporting` skill handles all shared logic:

1. **Data traversal** — walk `backlog/epics/` recursively, collecting epics → features → work items → tasks
2. **State filtering** — Active + New by default; `--all` flag includes Resolved/Closed/Removed
3. **Hours rollup** — sum `Estimated Hours` and `Remaining Hours` from all `tasks/*.md` under each work item; propagate sums up to feature and epic levels; show `—` at any level with no task data (never show 0 for missing data)
4. **Title shortening** — if an entity's header name exceeds 24 characters, use the folder slug (split on `-`, title-cased) as the display name
5. **HTML generation** — write self-contained HTML to `output/` with D3 v7 loaded from CDN
6. **Markdown generation** — write `.md` activity reports to `output/`
7. **Output naming** — `output/<type>-YYYY-MM-DD.<ext>`; overwrites if same date, creates new file if date differs

---

## Command Interface

```text
/report mindmap              # radial mindmap, Active + New items
/report gantt                # Gantt timeline, Active + New items
/report mindmap --all        # include Resolved/Closed/Removed
/report gantt --epics-only   # epics + features only, no work items
/report day                  # activity in the past 24 hours
/report week                 # activity in the past 7 days
/report month                # activity in the past 30 days
/report quarter              # activity in the past 90 days
/report year                 # activity in the past 365 days
```

All commands are read-only. No meta mode required. Output is always written to `output/`.

Viewing HTML reports: `python -m http.server` from the instance root, then open the URL shown.

---

## Report A: Backlog Mindmap

### Technology

D3 v7 radial tree, self-contained HTML.

### Visual design

- Off-white canvas (`#f7f5f2`), radial layout centered on the team name
- **Color coding by type and state:**
  - Active epic: solid blue
  - New epic: muted green, ~40% opacity
  - Feature (Active): yellow; Feature (New): yellow, ~40% opacity
  - Work Item: pink; faded if New
- **Active nodes:** bold text, `*` prefix on label
- **New/inactive nodes:** faded to ~40% opacity so active work is immediately prominent
- Text is always readable regardless of position (pure counter-rotation: `rotate(90 - d.x * 180/π)`)
- Zoom and pan via D3 zoom behavior

### Interaction

- **Click any node** → detail panel slides in from the right
- **Zoom/pan** — scroll to zoom, drag to pan

### Detail panel (right side, 310px)

Shows on click, closes with ✕ button. Contents:

- Type badge (Epic / Feature / Work Item)
- Full name, state (★ Active or New)
- Properties grid: dates, release, area, priority, assigned, iteration
- Est / Rem hours (rolled up; `—` if no task data)
- Description (from entity markdown)
- Child list with state indicators and ★ for active children

### Hours display

Hours are rolled up from tasks and shown in the detail panel only (not on the map nodes themselves, to avoid clutter). Any level with no task data shows `—` for both Est and Rem.

---

## Report B: Gantt Chart

### Technology

D3 v7 timeline, self-contained HTML, white/light professional background.

### Visual design

- White background, clean sans-serif — suitable for slides and printing
- Rows: Epic (bold, full-width bar) → Feature (indented) → Work Item (indented further)
- Separator row between epics for readability
- **Bar styles by state:**
  - Active: solid blue fill
  - New: dashed outline, muted fill
  - Resolved: grey fill
- Today line in amber
- Timeline auto-computed from earliest Start Date to latest Target Date across all shown entities
- Month-level columns
- Entities with no dates show a "No dates" placeholder label rather than being omitted

### Interaction

- **Click any row label or bar** → same detail panel as the mindmap (consistent UX)
- Zoom/pan via D3

---

## Report C: Activity Report

### Technology

Markdown document written to `output/`. No browser required — readable directly in any markdown viewer or terminal.

### Commands

```text
/report day | week | month | quarter | year
```

Output file: `output/activity-<period>-YYYY-MM-DD.md` (e.g. `activity-week-2026-03-31.md`)

### Data sources

Both sources are used together:

- **Git history** (`git log --since=<date>`) — authoritative record of what files changed, when, and by whom. Used for counts, new/closed entity detection, and team/product changes.
- **Context logs** — append-only entries on each entity with timestamps, author, and narrative content. Used to surface key decisions, evaluations, and qualitative notes from the period.

### Report structure

```text
# Activity Report — <Period> ending <date>

## Requests
- New: [n] — [list of request IDs and titles]
- Completed evaluations: [n]
- Status changes: [list of ID → new status]

## Backlog
- Work items completed (Resolved/Closed): [n] — [titles]
- Work items added: [n] — [titles]
- Features completed: [n] — [titles]
- Features added: [n] — [titles]

## Team
- Members added: [names or "none"]
- Members benched: [names or "none"]
- Allocation changes: [names and delta or "none"]

## Products
- Products added or updated: [names or "none"]

## Notable Context
[2–5 bullet points drawn from context log entries in the period —
 key decisions, evaluations, or notable changes. Omit if no
 context log activity in the period.]
```

Sections with no activity are omitted entirely rather than shown as empty. A report for a quiet period may be very short.

### Period boundaries

| Command | Lookback |
|---|---|
| `/report day` | Past 24 hours |
| `/report week` | Past 7 days |
| `/report month` | Past 30 days |
| `/report quarter` | Past 90 days |
| `/report year` | Past 365 days |

The report header always shows the exact date range covered.

### Progressively higher level

Shorter periods show item-level detail (individual story titles, specific request IDs). Longer periods aggregate upward — `/report year` shows feature and epic counts rather than individual work item lists, to keep the report scannable.

| Period | Granularity |
|---|---|
| day / week | Individual work items and requests by name |
| month | Work items summarized, features by name |
| quarter / year | Features summarized, epics by name |

---

## Output Directory Convention

```text
<instance-root>/
  output/                           # gitignored
    mindmap-2026-03-31.html
    gantt-2026-03-31.html
    activity-week-2026-03-31.md
    activity-month-2026-03-31.md
```

- Added to `.gitignore` during `/init`
- HTML files are self-contained (D3 loaded from CDN; no local assets required)
- Markdown files are plain text, readable anywhere
- Quick HTML hosting: `python -m http.server` from instance root

---

## Relationship to Existing Commands

- `/status` shows a live snapshot of current state (counts, allocation, staleness). Activity reports show what *changed* over a period.
- `/describe-team` provides narrative synthesis on demand. Activity reports are structured artifacts suitable for async sharing with management.

---

## Example Instance Changes

To support testing:

- Add tasks with `Estimated Hours` and `Remaining Hours` under existing Example work items to validate hours rollup
- Ensure `output/` exists and is gitignored in the Example instance

---

## Out of Scope

- Request pipeline report and team allocation report — deferred to a future iteration
- D3 interactive enhancements beyond click-to-detail (collapse, filtering UI) — future iteration
- Offline/no-CDN mode — deferred
- Export to PDF or image — deferred
- Scheduled/automatic report generation — deferred
