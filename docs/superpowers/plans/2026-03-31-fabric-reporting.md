# Fabric Reporting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/report mindmap`, `/report gantt`, and `/report day|week|month|quarter|year` commands to Fabric, generating interactive D3 HTML and markdown activity reports from the backlog working memory.

**Architecture:** A single `reporting.md` skill handles all shared logic (backlog traversal, hours rollup, title shortening, output file naming). A `report.md` command routes to the appropriate renderer. Reports are written to a gitignored `output/` directory at the instance root. HTML reports use D3 v7 from CDN; activity reports are plain markdown.

**Tech Stack:** D3 v7 (CDN), markdown, git log (for activity data source), Fabric skill/command markdown files.

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `Fabric/.claude/skills/reporting.md` | Reporting skill — data traversal, hours rollup, all three renderers |
| Create | `Fabric/.claude/commands/report.md` | `/report` command — argument routing |
| Modify | `Fabric/.claude/commands/init.md` | Add `output/` creation and `.gitignore` entry to init steps |
| Copy | `Example/.claude/fabric-backlog.md` | Enable Backlog module in Example instance |
| Modify | `Example/CLAUDE.md` | Enable Backlog module, add @import for fabric-backlog.md |
| Create | `Example/.gitignore` | Gitignore `output/` and `staging/` |
| Create | `Example/output/.gitkeep` | Ensure output/ directory exists in repo |
| Create | Several `Example/.../tasks/*.md` | Example task files with Estimated/Remaining Hours for rollup testing |

---

## Task 1: Prepare the Example Instance

Enable the Backlog module and set up `output/` in the Example instance so reporting can be tested end-to-end.

**Files:**
- Modify: `Example/CLAUDE.md`
- Create: `Example/.claude/fabric-backlog.md`
- Create: `Example/.gitignore`
- Create: `Example/output/.gitkeep`

- [ ] **Step 1: Copy fabric-backlog.md into Example**

```bash
cp Fabric/template/fabric-backlog.md Example/.claude/fabric-backlog.md
```

- [ ] **Step 2: Enable Backlog module in Example/CLAUDE.md**

Open `Example/CLAUDE.md` and make two changes:

Add the @import at the top (after existing imports):
```
@.claude/fabric-backlog.md
```

Update the Enabled Modules table to set Backlog to Enabled:
```markdown
| Backlog | Enabled | Hierarchical work tracking — epics, features, work items, tasks |
```

- [ ] **Step 3: Create Example/.gitignore**

```
output/
staging/*
!staging/README.md
```

- [ ] **Step 4: Create output directory marker**

```bash
mkdir -p Example/output && touch Example/output/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add Example/.claude/fabric-backlog.md Example/CLAUDE.md Example/.gitignore Example/output/.gitkeep
git commit -m "feat: enable Backlog module and output/ dir in Example instance"
```

---

## Task 2: Add Example Tasks with Hours

Add task files under several Example work items so the hours rollup logic has real data to work with during testing. Tasks live at `workitems/<slug>/tasks/<slug>.md`.

**Files:**
- Create: `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md`
- Create: `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/write-tests.md`
- Create: `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/adt-event-mapping/tasks/map-adt-types.md`
- Create: `Example/backlog/epics/ehr-pipeline-modernization/features/streaming-ingestion/workitems/kafka-consumer-framework/tasks/consumer-scaffold.md`
- Create: `Example/backlog/epics/operational-reporting-v2/features/realtime-census-dashboard/workitems/census-event-stream/tasks/kafka-topic-setup.md`

- [ ] **Step 1: Create tasks for fhir-resource-parser**

`Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md`:
```markdown
# Implement FHIR R4 Resource Parser

## Properties

- State: Active
- Assigned to: marcus.chen@riverdale.org
- Estimated Hours: 16
- Remaining Hours: 8

## Description

Implement the core FHIR R4 parser for Patient, Encounter, and Observation resources.
```

`Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/write-tests.md`:
```markdown
# Write Parser Unit Tests

## Properties

- State: New
- Assigned to: marcus.chen@riverdale.org
- Estimated Hours: 8
- Remaining Hours: 8

## Description

Write unit tests covering all FHIR R4 resource types and edge cases.
```

- [ ] **Step 2: Create task for adt-event-mapping**

`Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/adt-event-mapping/tasks/map-adt-types.md`:
```markdown
# Map ADT Event Types

## Properties

- State: New
- Assigned to:
- Estimated Hours: 12
- Remaining Hours: 12

## Description

Map A01, A02, A03, A08 ADT event types to FHIR Encounter status transitions.
```

- [ ] **Step 3: Create task for kafka-consumer-framework**

`Example/backlog/epics/ehr-pipeline-modernization/features/streaming-ingestion/workitems/kafka-consumer-framework/tasks/consumer-scaffold.md`:
```markdown
# Scaffold Kafka Consumer

## Properties

- State: New
- Assigned to:
- Estimated Hours: 20
- Remaining Hours: 20

## Description

Scaffold base Kafka consumer class with configurable topic subscription and error handling.
```

- [ ] **Step 4: Create task for census-event-stream**

`Example/backlog/epics/operational-reporting-v2/features/realtime-census-dashboard/workitems/census-event-stream/tasks/kafka-topic-setup.md`:
```markdown
# Set Up Census Kafka Topic

## Properties

- State: New
- Assigned to:
- Estimated Hours: 4
- Remaining Hours: 4

## Description

Create and configure the census-events Kafka topic with appropriate partitioning and retention.
```

- [ ] **Step 5: Commit**

```bash
git add Example/backlog/
git commit -m "feat: add example tasks with hours for reporting rollup testing"
```

---

## Task 3: Write the Reporting Skill — Core and Data Traversal

Create `Fabric/.claude/skills/reporting.md` with the shared data traversal, hours rollup, title shortening, and output naming logic. This task covers the foundational section of the skill only; renderer sections are added in Tasks 4–6.

**Files:**
- Create: `Fabric/.claude/skills/reporting.md`

- [ ] **Step 1: Create the skill file**

Create `Fabric/.claude/skills/reporting.md` with this content:

````markdown
# Skill: Reporting

## Purpose

Generate reports from the Fabric working memory. Invoked explicitly via `/report` or implicitly when the user asks for a visual overview, activity summary, or status report.

## Output Directory

All reports are written to `output/` at the instance root. This directory is gitignored and must exist before writing. If it does not exist, create it.

File naming:
- Mindmap: `output/mindmap-YYYY-MM-DD.html`
- Gantt: `output/gantt-YYYY-MM-DD.html`
- Activity: `output/activity-<period>-YYYY-MM-DD.md`

If a file with today's date already exists, overwrite it.

## Data Traversal

Walk `backlog/epics/` to build the full entity tree. The folder structure encodes the hierarchy:

```
backlog/epics/<epic>/epic.md
backlog/epics/<epic>/features/<feature>/feature.md
backlog/epics/<epic>/features/<feature>/workitems/<workitem>/workitem.md
backlog/epics/<epic>/features/<feature>/workitems/<workitem>/tasks/<task>.md
```

For each entity, extract from the markdown file:
- **Name**: the `# H1` header line
- **State**: from `- State: <value>` in Properties
- **Start Date / Target Date**: from Properties (format: `YYYY-MM-DD` or human-readable)
- **Priority**: from Properties
- **Area**: from Properties (epic/feature)
- **Product / Release**: from Properties (feature)
- **Assigned to**: from Properties (work item/task)
- **Iteration**: from Properties (work item)
- **Estimated Hours / Remaining Hours**: from Properties (task only)
- **Description**: the first non-lorem-ipsum paragraph under `## Description`

### State Filtering

Default: include `Active` and `New` states only. When `--all` flag is present, include `Resolved`, `Closed`, and `Removed` as well.

### Hours Rollup

For each work item, sum `Estimated Hours` and `Remaining Hours` across all its task files. If no task files exist, or all tasks have no hours values, record `null` (display as `—`). Never treat missing data as 0.

Propagate upward: a feature's Est/Rem is the sum of its work items' rolled-up values. An epic's Est/Rem is the sum of its features'. At any level, if all children return `null`, the parent also shows `null` / `—`.

### Title Shortening

If an entity's H1 name exceeds 24 characters, derive a display name from its folder slug:
- Split on `-`
- Title-case each word
- Join with space

Example: `fhir-resource-parser` → `FHIR Resource Parser` (use the original if it is already short enough).

Always carry the full name separately for the detail panel.

## Checking Module Enablement

Before generating a backlog report, verify the Backlog module is enabled in `CLAUDE.md` (the Enabled Modules table should show `Backlog | Enabled`). If disabled, inform the user and stop.
````

- [ ] **Step 2: Verify file was written correctly**

Read `Fabric/.claude/skills/reporting.md` and confirm all sections are present: Purpose, Output Directory, Data Traversal, Hours Rollup, Title Shortening, Module Enablement check.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/reporting.md
git commit -m "feat: add reporting skill — core data traversal and hours rollup"
```

---

## Task 4: Reporting Skill — Mindmap Renderer

Append the mindmap renderer section to `Fabric/.claude/skills/reporting.md`.

**Files:**
- Modify: `Fabric/.claude/skills/reporting.md`

- [ ] **Step 1: Append the mindmap renderer section**

Append to `Fabric/.claude/skills/reporting.md`:

````markdown
---

## Renderer: Mindmap (`/report mindmap`)

Generate a self-contained interactive HTML file using D3 v7 (loaded from CDN: `https://d3js.org/d3.v7.min.js`).

### Page structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Team Name] — Backlog Mindmap</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>/* see styles below */</style>
</head>
<body>
  <div id="map-area"><svg id="svg"></svg></div>
  <div id="detail-panel">
    <button id="detail-close">✕</button>
    <div id="detail-content"></div>
  </div>
  <div id="legend"><!-- see legend below --></div>
  <script>/* see script below */</script>
</body>
</html>
```

### Layout

Use a D3 radial tree layout. The root node is the team name. Level 1 = epics, level 2 = features, level 3 = work items.

```javascript
const root = d3.hierarchy(treeData);
const R = Math.min(W, H) * 0.44;
d3.tree()
  .size([2 * Math.PI, R])
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.5) / a.depth)(root);

// Node group transform
.attr("transform", d => {
  const angle = d.x * 180 / Math.PI - 90;
  return `translate(${cx},${cy}) rotate(${angle}) translate(${d.y},0)`;
})
```

### Text rotation — critical

This formula keeps all text readable regardless of position around the circle. Do not use any flip/conditional logic — pure counter-rotation only:

```javascript
textElement.attr("transform", d => `rotate(${90 - d.x * 180 / Math.PI})`)
```

For multi-line labels, use `<tspan>` elements with `dy` offsets centered around `y=0`.

### Visual design

Background: `#f7f5f2` (off-white canvas).

Node ellipse sizes (rx × ry):
- Root: 58 × 30
- Epic: 52 × 27
- Feature: 44 × 21
- Work Item: 37 × 18

Node colors:
| Type | State | Fill | Stroke |
|---|---|---|---|
| Root | — | `#c8d8f0` | `#7898c8` |
| Epic | Active | `#7eb8d4` | `#5a9ab8` |
| Epic | New | `#b8d4b8` | `#8ab88a` |
| Feature | Any | `#f0d080` | `#d4b060` |
| Work Item | Any | `#e8b8c8` | `#d090a8` |

New/inactive nodes (any node where state ≠ Active): set `opacity: 0.38` on the ellipse and text.

Active nodes: bold font weight, prefix label with `* `.

Link lines: `stroke: #c8c0b8`, width 1.8. New-state target nodes: use `stroke-dasharray: 5,4` on the link.

### Interactivity

**Zoom/pan:** attach `d3.zoom().scaleExtent([0.35, 3])` to the SVG, transforming the `<g>` container.

**Click → detail panel:** clicking any node opens a 310px panel sliding in from the right. The panel shows:
- Type badge (colour-coded pill: blue for Epic, yellow for Feature, pink for Work Item)
- Full entity name as `<h2>`
- Properties grid (2-column: label / value): State (★ Active or New), Dates, Release, Area, Priority, Assigned to, Iteration
- Est / Rem hours from rollup (`—` if null)
- Description paragraph
- Child list: bullet per child with a coloured dot (blue = Active, grey = New) and ★ suffix on active children
- A ✕ button closes the panel

Selected node gets a thicker stroke (3.5px). Closing the panel deselects.

### Legend

Bottom-left, white card with 1px border:
```
● Active Epic   ● New Epic (faded)   ● Active Feature   ● New Feature (faded)   ● Work Item
Click any node to view details
```

### Data shape to embed in the HTML

Build the tree as a nested JS object literal and embed it as a `const treeData = {...}` in the script. Structure:

```javascript
{
  id: "root",
  name: "Team\nName",        // \n splits to two tspan lines
  fullName: "Full Team Name",
  type: "root",
  state: "Active",
  desc: "Snapshot as of YYYY-MM-DD.",
  children: [
    {
      id: "e1",
      name: "Short\nLabel",  // display name, max 2 lines
      fullName: "Full Epic Name",
      type: "epic",
      state: "Active",       // or "New"
      dates: "Feb 2026 – Sep 2026",
      priority: "4",
      area: "Clinical Data Lake",
      est: "56",             // rolled up, or null → display "—"
      rem: "44",
      desc: "First meaningful sentence of description.",
      children: [ /* features */ ]
    }
  ]
}
```

Embed the actual data extracted from the backlog files at generation time. Do not use placeholder values.
````

- [ ] **Step 2: Verify**

Read the file and confirm the mindmap section is present and complete through the data shape definition.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/reporting.md
git commit -m "feat: add mindmap renderer section to reporting skill"
```

---

## Task 5: Reporting Skill — Gantt Renderer

Append the Gantt renderer section to `Fabric/.claude/skills/reporting.md`.

**Files:**
- Modify: `Fabric/.claude/skills/reporting.md`

- [ ] **Step 1: Append the Gantt renderer section**

Append to `Fabric/.claude/skills/reporting.md`:

````markdown
---

## Renderer: Gantt (`/report gantt`)

Generate a self-contained interactive HTML file. White background, professional, print-friendly.

### Page structure

Same CDN script tag as mindmap. Page layout:

```
[header: title + date range]
[gantt table: label column (220px) | timeline columns (flexible)]
[legend]
```

### Timeline scale

Compute the date range from the earliest `Start Date` and latest `Target Date` across all entities being shown. Expand to full month boundaries. Use month-level columns.

If an entity has no Start/Target Date, render its bar row with a muted "No dates set" label in the timeline area rather than omitting the row.

### Row structure

For each epic (separator bar between epics):
1. Epic row — full-width bar, bold label
2. Feature rows — indented 1 level, medium bar
3. Work item rows — indented 2 levels, thin accent bar (only when `--epics-only` is NOT set)

### Bar styles

| State | Style |
|---|---|
| Active | Solid `#0ea5e9` fill, white label text |
| New | `#334155` fill, dashed border `#475569`, muted text |
| Resolved | `#94a3b8` solid fill |

Bar height: epic 22px, feature 16px, work item 12px. Row height: 34px.

### Today line

Amber vertical line (`#f59e0b`, 2px, 60% opacity) at today's date position. Always render even if today is outside the timeline range (clamp to edge).

### Click → detail panel

Same detail panel implementation as the mindmap. Clicking a row label or bar opens the panel with the entity's full details. Panel is 310px, slides in from the right.

### Color scheme

Background: white (`#ffffff`). Header row: `#f8fafc`. Alternate row shading: every other epic group has `#fafafa` background. Grid lines: `#f1f5f9`. Labels: `#1e293b` (epic), `#475569` (feature), `#94a3b8` (work item).

### Legend

Bottom strip inside the table:
```
■ Active   □ New (planned)   ▪ Resolved   | Today
```

### Data shape

Build a flat array of rows (not nested), each with a `level` field:

```javascript
const rows = [
  {
    id: "e1", level: "epic", label: "EHR Pipeline Modernization",
    fullName: "EHR Pipeline Modernization",
    state: "Active", startDate: "2026-02-01", targetDate: "2026-09-30",
    est: "56", rem: "44",
    desc: "...", area: "Clinical Data Lake", priority: "4",
    children: ["f1","f2","f3"]   // child IDs for detail panel list
  },
  {
    id: "f1", level: "feature", parentId: "e1",
    label: "FHIR R4 Support", fullName: "FHIR R4 Support",
    state: "Active", startDate: "2026-02-01", targetDate: "2026-05-15",
    release: "v3.0", est: "24", rem: "16",
    desc: "...", children: ["w1","w2","w3"]
  },
  {
    id: "w1", level: "workitem", parentId: "f1",
    label: "FHIR Resource Parser", fullName: "FHIR Resource Parser",
    state: "Active", startDate: null, targetDate: null,
    assignee: "marcus.chen@riverdale.org", iteration: "Sprint 2026-08",
    est: "24", rem: "16", desc: "..."
  }
  // ... all rows in display order
];
```
````

- [ ] **Step 2: Verify**

Read the updated file and confirm the Gantt section is appended correctly after the mindmap section.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/reporting.md
git commit -m "feat: add Gantt renderer section to reporting skill"
```

---

## Task 6: Reporting Skill — Activity Report Renderer

Append the activity report section to `Fabric/.claude/skills/reporting.md`.

**Files:**
- Modify: `Fabric/.claude/skills/reporting.md`

- [ ] **Step 1: Append the activity report section**

Append to `Fabric/.claude/skills/reporting.md`:

````markdown
---

## Renderer: Activity Report (`/report day|week|month|quarter|year`)

Generate a markdown document summarising what changed in the Fabric instance over the specified period.

### Period lookback

| Argument | Lookback | Granularity |
|---|---|---|
| `day` | Past 24 hours | Individual work items and request IDs |
| `week` | Past 7 days | Individual work items and request IDs |
| `month` | Past 30 days | Work items summarised by count, features by name |
| `quarter` | Past 90 days | Features summarised by count, epics by name |
| `year` | Past 365 days | Epic-level counts only |

### Data collection

**Step 1 — Git history:** Run the equivalent of:
```
git log --since="<lookback date>" --name-status --format="%H|%an|%ae|%ad|%s" --date=short
```
Parse the output to identify:
- Files added (`A`) under `requests/` → new requests
- Files added under `backlog/epics/` → new backlog items (classify by depth: epic/feature/workitem)
- Files modified with state-related changes → read the file to extract current State
- Files modified under `team/members/` → team changes
- Files modified under `products/` → product changes

**Step 2 — Context logs:** For each entity file modified in the period, read its context log section and extract entries whose timestamps fall within the lookback window. Collect the 2–5 most significant entries (prefer entries with explicit decisions, evaluations, or status changes over routine updates).

### Report format

Output file: `output/activity-<period>-YYYY-MM-DD.md`

```markdown
# Activity Report — <Period> ending <YYYY-MM-DD>

_Covering <start date> to <end date>_

## Requests
- New: <n> — R-101 (Clinical ML Pipeline), R-102 (...)
- Completed evaluations: <n>
- Status changes: R-099 → Accepted, R-098 → Rejected

## Backlog
- Work items completed (Resolved/Closed): <n> — <titles>
- Work items added: <n> — <titles>
- Features completed: <n> — <titles>
- Features added: <n> — <titles>

## Team
- Members added: <names or "none">
- Members benched: <names or "none">
- Allocation changes: <name: old% → new%> or "none"

## Products
- Products added or updated: <names or "none">

## Notable Context
- <key decision or event from a context log entry>
- <another notable entry>
```

**Rules:**
- Omit any section entirely if it has no activity (do not write empty sections).
- For `month` granularity and above: replace individual work item lists with counts. Example: "8 work items added across 3 features."
- For `quarter`/`year`: drop the Backlog work-item rows; show features/epics instead.
- The "Notable Context" section contains 2–5 bullets drawn from context log entries. Each bullet should capture a decision, outcome, or key event — not a routine update. Omit this section entirely if no relevant context log activity occurred.
- Report header always shows exact date range, not just the period name.
````

- [ ] **Step 2: Verify**

Read the file end to confirm the activity section is present with all three subsections (Period lookback, Data collection, Report format).

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/reporting.md
git commit -m "feat: add activity report renderer to reporting skill"
```

---

## Task 7: Write the `/report` Command

Create `Fabric/.claude/commands/report.md` to route arguments to the appropriate renderer in the reporting skill.

**Files:**
- Create: `Fabric/.claude/commands/report.md`

- [ ] **Step 1: Create the command file**

Create `Fabric/.claude/commands/report.md`:

```markdown
# /report — Generate a Fabric Report

## Usage

```
/report <type> [options]
```

## Arguments

| Type | Description |
|---|---|
| `mindmap` | Radial D3 mindmap of the backlog hierarchy |
| `gantt` | D3 Gantt timeline of epics, features, and work items |
| `day` | Activity summary for the past 24 hours |
| `week` | Activity summary for the past 7 days |
| `month` | Activity summary for the past 30 days |
| `quarter` | Activity summary for the past 90 days |
| `year` | Activity summary for the past 365 days |

## Options

| Option | Applies to | Effect |
|---|---|---|
| `--all` | mindmap, gantt | Include Resolved, Closed, and Removed items (default: Active + New only) |
| `--epics-only` | gantt | Show epics and features only; omit work item rows |

## Behavior

1. Check the argument. If missing or unrecognised, list valid types and stop.
2. For `mindmap` or `gantt`: verify the Backlog module is enabled. If not, tell the user and stop.
3. Load the reporting skill and invoke the appropriate renderer.
4. Write output to `output/` (create the directory if it does not exist).
5. Confirm the output path to the user and remind them to run `python -m http.server` from the instance root to view HTML reports.

## Notes

- Read-only. No meta mode required.
- If the backlog is empty or contains no Active/New items, generate the report with an empty state message rather than failing.
- The reporting skill (`skills/reporting.md`) contains all renderer logic. This command is routing only.
```

- [ ] **Step 2: Verify**

Read the file and confirm all argument types, options, and behavior steps are present.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/report.md
git commit -m "feat: add /report command"
```

---

## Task 8: Update /init to Create output/ Directory

Modify the `/init` command to create `output/` and add it to `.gitignore` during first-time setup.

**Files:**
- Modify: `Fabric/.claude/commands/init.md`

- [ ] **Step 1: Add output/ to the generated files list in init.md**

In `Fabric/.claude/commands/init.md`, find step 3 ("Generate structural files") and add two items:
- `output/` directory (with a `.gitkeep` so it appears in git)
- `.gitignore` entry: `output/` (append to existing `.gitignore` or create one if absent)

The updated step 3 list should read:
```
- AGENT.md (constitution with sensible defaults)
- team/team.md (team facts)
- team/members/<name>/profile.md (one per member)
- requests/REQUESTS.md (request module doc, if Triage module enabled)
- staging/README.md (staging directory marker)
- output/.gitkeep (report output directory)
- .gitignore (includes: output/, staging/*, !staging/README.md)
```

- [ ] **Step 2: Verify**

Read `Fabric/.claude/commands/init.md` and confirm `output/.gitkeep` and `.gitignore` entries appear in the generated files list.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/init.md
git commit -m "feat: add output/ dir and .gitignore creation to /init"
```

---

## Task 9: Register Reporting in fabric-core.md

Add the `/report` command and `reporting` skill to the command/skill tables in `Fabric/template/fabric-core.md` so they appear in team instances.

**Files:**
- Modify: `Fabric/template/fabric-core.md`

- [ ] **Step 1: Add /report to the Core Commands table**

In `Fabric/template/fabric-core.md`, find the `## Core Commands` table and append:

```markdown
| /report | Generate reports from the backlog: `mindmap`, `gantt`, or `day/week/month/quarter/year` activity summaries. Requires Backlog module for mindmap and gantt. |
```

- [ ] **Step 2: Add reporting to the Core Skills table**

In the `## Core Skills` table, append:

```markdown
| reporting | Generate interactive HTML reports (mindmap, Gantt) and markdown activity summaries from the backlog working memory. Handles data traversal, hours rollup, and all three renderers. |
```

- [ ] **Step 3: Verify**

Read `Fabric/template/fabric-core.md` and confirm both rows are present in their respective tables.

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-core.md
git commit -m "feat: register /report command and reporting skill in fabric-core"
```

---

## Task 10: Validate — Mindmap Report

Test `/report mindmap` end-to-end in the Example instance.

- [ ] **Step 1: Confirm prerequisites**

Verify these files exist:
- `Example/.claude/fabric-backlog.md`
- `Example/backlog/epics/ehr-pipeline-modernization/epic.md`
- At least one task file with `Estimated Hours` under a work item

- [ ] **Step 2: Run the report**

In the Example instance context, invoke `/report mindmap`. The agent should:
1. Read `CLAUDE.md` and confirm Backlog is enabled
2. Walk `backlog/epics/` and collect the full entity tree (2 epics, 6 features, 15 work items)
3. Roll up hours from task files
4. Generate `output/mindmap-<today>.html`

- [ ] **Step 3: Verify output**

Check that `Example/output/mindmap-<today>.html` exists and contains:
- `d3.v7.min.js` CDN script tag
- `const treeData = {` with actual entity data (not placeholder values)
- The text rotation formula: `rotate(${90 - d.x * 180 / Math.PI})`
- A detail panel div with `id="detail-panel"`
- Hours values for entities that have task data (not all `—`)

- [ ] **Step 4: Open in browser**

```bash
cd Example && python -m http.server 8080
```

Open `http://localhost:8080/output/mindmap-<today>.html`. Verify:
- Radial tree renders with correct hierarchy
- Active nodes are bold with `*` prefix
- New nodes are faded
- Clicking a node opens the detail panel
- Text is readable on all nodes (no upside-down labels)
- Hours show rolled-up values for work items with tasks, `—` for others

---

## Task 11: Validate — Gantt Report

Test `/report gantt` end-to-end in the Example instance.

- [ ] **Step 1: Run the report**

Invoke `/report gantt` in the Example instance context. The agent should generate `output/gantt-<today>.html`.

- [ ] **Step 2: Verify output**

Check that `Example/output/gantt-<today>.html` exists and contains:
- Actual entity data embedded as `const rows = [`
- Today line logic referencing today's date
- White background CSS (`background: #ffffff` or `white`)
- Detail panel div

- [ ] **Step 3: Open in browser**

```bash
cd Example && python -m http.server 8080
```

Open `http://localhost:8080/output/gantt-<today>.html`. Verify:
- Timeline spans Feb 2026 – Dec 2026
- Today amber line is visible at approximately Apr 2026
- Active epic bar (EHR Pipeline) is solid blue
- New epic bar (Operational Reporting) is dashed/muted
- Clicking a row opens the detail panel
- `--epics-only` flag omits work item rows when used

---

## Task 12: Validate — Activity Report

Test `/report week` end-to-end in the Example instance.

- [ ] **Step 1: Run the report**

Invoke `/report week` in the Example instance context. The agent should:
1. Run `git log --since="7 days ago"` against the Example instance's git history
2. Read context logs from any entities modified in that window
3. Generate `output/activity-week-<today>.md`

- [ ] **Step 2: Verify output**

Check that `Example/output/activity-week-<today>.md` exists and:
- Starts with `# Activity Report — Week ending <date>`
- Shows `_Covering <start> to <end>_` date range
- Contains at least a Backlog section reflecting the tasks added in Task 2
- Omits sections with no activity
- Does not contain any `[placeholder]` or `[n]` literals — all values are real

- [ ] **Step 3: Spot-check granularity**

Run `/report year` and verify the output uses epic-level aggregation (no individual work item names, just counts).

- [ ] **Step 4: Final commit if any fixes were needed during validation**

```bash
git add Fabric/.claude/skills/reporting.md Fabric/.claude/commands/report.md
git commit -m "fix: reporting adjustments from validation"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Output directory convention ✓, mindmap visual design ✓, text rotation fix ✓, Gantt white background ✓, detail panel ✓, hours rollup ✓, activity report structure ✓, period granularity table ✓, git + context log data sources ✓, `/init` output/ creation ✓, Example instance tasks ✓
- [x] **Placeholder scan:** No TBD/TODO. All code blocks contain actual content. Data shape examples use real entity names from Example.
- [x] **Type consistency:** `est`/`rem` fields are consistently `null` (not `0`) for missing hours across mindmap data shape (Task 4) and Gantt data shape (Task 5). Detail panel consistently shows `—` for null.
