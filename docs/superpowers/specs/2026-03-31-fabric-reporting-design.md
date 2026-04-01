# Fabric Reporting — Design Spec

**Date:** 2026-03-31
**Status:** Approved

## Overview

Add a reporting capability to Fabric that generates interactive HTML reports from the backlog working memory. The primary goal is a high-impact management demo that demonstrates Fabric's value versus ADO + PowerBI workflows — polished, instantly-generated reports from the same markdown files the team already maintains.

Two report types in scope: a radial mindmap of the backlog hierarchy, and a Gantt timeline of epics, features, and work items.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `Fabric/.claude/skills/reporting.md` | Reporting skill — implicit capability loaded by the agent |
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
6. **Output naming** — `output/<type>-YYYY-MM-DD.html`; overwrites if same date, creates new file if date differs

---

## Command Interface

```
/report mindmap              # radial mindmap, Active + New items
/report gantt                # Gantt timeline, Active + New items
/report mindmap --all        # include Resolved/Closed/Removed
/report gantt --epics-only   # epics + features only, no work items
```

Both commands are read-only. No meta mode required. Output is always written to `output/`.

Viewing reports: `python -m http.server` from the instance root, then open the URL shown.

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

## Output Directory Convention

```
<instance-root>/
  output/                    # gitignored
    mindmap-2026-03-31.html  # self-contained, viewable in any browser
    gantt-2026-03-31.html
```

- Added to `.gitignore` during `/init`
- Files are self-contained HTML (D3 loaded from CDN; no local assets required)
- Future D3-based reports follow the same convention
- Quick hosting: `python -m http.server` from instance root

---

## Relationship to Existing Commands

- `/status` already updated to show backlog counts (Active + New epics, features, work items) when the Backlog module is enabled. The reporting skill provides the deeper visual view.
- `/describe-team` provides narrative synthesis. Reporting provides visual artifacts for external audiences (management, stakeholders).

---

## Example Instance Changes

To support testing:
- Add a handful of tasks with `Estimated Hours` and `Remaining Hours` under existing Example work items so the hours rollup can be validated
- Ensure `output/` exists and is gitignored in the Example instance

---

## Out of Scope

- Request pipeline report (C) and team allocation report (D) — deferred, not in this iteration
- D3 interactive enhancements beyond click-to-detail (collapse, filtering UI, animations) — future iteration
- Offline/no-CDN mode — deferred
- Export to PDF or image — deferred
