# Skill: Reporting

## Purpose

Generate reports from the Fabric working memory. Invoked explicitly via `/report` or implicitly when the user asks for a visual overview, activity summary, or status report.

## Output Directory

All reports are written to `output/` at the instance root. This directory is gitignored and must exist before writing. If it does not exist, create it.

File naming:
- Mindmap: `output/mindmap-YYYY-MM-DD.html`
- Gantt: `output/gantt-YYYY-MM-DD.html`
- Activity: `output/activity-<period>-YYYY-MM-DD.md`
- Effort: `output/effort-YYYY-MM-DD.html`

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
- **Description**: the first non-lorem-ipsum paragraph under `## Description` (if the description appears to be filler text, omit it)

### State Filtering

Default: include `Active` and `New` states only. When `--all` flag is present, include `Resolved`, `Closed`, and `Removed` as well.

### Hours Rollup

For each work item, sum `Estimated Hours` and `Remaining Hours` across all its task files. If no task files exist, or all tasks have no hours values, record `null` (display as `—`). Never treat missing data as `0`.

Propagate upward:
- A feature's Est/Rem = sum of its work items' rolled-up values
- An epic's Est/Rem = sum of its features' values
- At any level, if all children return `null`, the parent also shows `null` / `—`
- If some children have hours and some do not, sum only the non-null values and note the partial coverage in the detail panel (e.g. "36h est — partial, 2 of 5 items have estimates")

### Title Shortening

If an entity's H1 name exceeds 24 characters, derive a display name from its folder slug:
- Split on `-`
- Title-case each word
- Join with space

Example: `fhir-resource-parser` → `FHIR Resource Parser`

Always carry the full name separately for the detail panel.

## Checking Module Enablement

Before generating a backlog report (mindmap or gantt), verify the Backlog module is enabled in `CLAUDE.md` (the Enabled Modules table should show `Backlog | Enabled`). If disabled, inform the user and stop.

The activity report does not require the Backlog module — it can run on any Fabric instance.

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

// Node group transform — positions node at its radial coordinate
.attr("transform", d => {
  const angle = d.x * 180 / Math.PI - 90;
  return `translate(${cx},${cy}) rotate(${angle}) translate(${d.y},0)`;
})
```

### Text rotation — critical

This formula keeps all text readable regardless of position around the circle. Use pure counter-rotation only — do NOT add any conditional flip logic:

```javascript
textElement.attr("transform", d => `rotate(${90 - d.x * 180 / Math.PI})`)
```

For multi-line labels, use `<tspan>` elements with `dy` offsets centered around `y=0`. Remove and re-append tspan children each render to avoid duplicates.

### Visual design

Background: `#f7f5f2` (off-white canvas). Body and `#map-area` both use this background.

Node ellipse sizes (rx × ry):

| Type | rx | ry |
|---|---|---|
| Root | 58 | 30 |
| Epic | 52 | 27 |
| Feature | 44 | 21 |
| Work Item | 37 | 18 |

Node colors:

| Type | State | Fill | Stroke |
|---|---|---|---|
| Root | — | `#c8d8f0` | `#7898c8` |
| Epic | Active | `#7eb8d4` | `#5a9ab8` |
| Epic | New | `#b8d4b8` | `#8ab88a` |
| Feature | Any | `#f0d080` | `#d4b060` |
| Work Item | Any | `#e8b8c8` | `#d090a8` |

New/inactive nodes (state ≠ Active and type ≠ root): set `opacity: 0.38` on both the ellipse and text elements.

Active nodes: `font-weight: 700`, prefix display label with `* `.

Link lines: `stroke: #c8c0b8`, `stroke-width: 1.8`. Links to New-state target nodes: add `stroke-dasharray: 5,4`.

### Interactivity

**Zoom/pan:** attach `d3.zoom().scaleExtent([0.35, 3])` to the SVG element, applying the transform to the inner `<g>` container group.

**Click → detail panel:** clicking any node opens a 310px panel sliding in from the right (CSS `transition: width 0.22s ease`). The selected node gets `stroke-width: 3.5`. Closing the panel deselects.

Detail panel contents (in order):
1. Type badge — colour-coded pill: blue (`#dbeeff`/`#1a5a8a`) for Epic, yellow (`#fff4cc`/`#7a5800`) for Feature, pink (`#ffe4ee`/`#7a1838`) for Work Item
2. Full entity name as `<h2>`
3. Properties grid (2-column label/value): State (★ Active or plain text for New), Dates, Release, Area, Priority, Assigned to, Iteration
4. Est / Rem hours from rollup — format as `"36h / 28h"` or `"— / —"` if null; note partial coverage if applicable
5. Description paragraph (omit if no meaningful description)
6. Child list: one bullet per child, coloured dot (blue = Active, `#ccc` = New), ★ suffix on active children
7. ✕ button in top-right corner of panel closes it

### Legend

Bottom-left of `#map-area`, white card with `border: 1px solid #e8e4e0`, `border-radius: 8px`:

```
● Active Epic    ● New Epic (faded)    ● Active Feature    ● New Feature (faded)    ● Work Item
Click any node to view details
```

### Data shape to embed in the HTML

Build the tree as a nested JavaScript object literal and embed it as `const treeData = {...}` in the `<script>` block. Use actual data extracted from the backlog files — never use placeholder values.

```javascript
{
  id: "root",
  name: "Team\nName",         // \n splits into two tspan lines
  fullName: "Full Team Name",
  type: "root",
  state: "Active",
  desc: "Snapshot as of YYYY-MM-DD.",
  children: [
    {
      id: "e1",
      name: "Short\nLabel",   // display name ≤24 chars per line, \n for line break
      fullName: "Full Epic Name",
      type: "epic",
      state: "Active",        // or "New"
      dates: "Feb 2026 – Sep 2026",
      priority: "4",
      area: "Clinical Data Lake",
      est: "56",              // string, or null if no task data
      rem: "44",              // string, or null if no task data
      desc: "First meaningful sentence of description.",
      children: [ /* features as same shape */ ]
    }
  ]
}
```

Work items are leaf nodes — include `children: []` or omit `children` entirely. Include `assignee`, `iteration`, `est`, `rem` on work item nodes.

---

## Renderer: Gantt (`/report gantt`)

Generate a self-contained interactive HTML file. White background, professional, print-friendly.

### Page structure

Same D3 v7 CDN script tag as mindmap. Layout:

```
[page header: team name + date range]
[gantt table: label column (220px fixed) | timeline columns (flexible)]
[legend strip]
```

### Timeline scale

Compute the date range from the earliest `Start Date` and latest `Target Date` across all entities being shown. Expand to full month boundaries (first day of earliest month, last day of latest month). Use month-level columns.

If an entity has no Start/Target Date, render its bar row with a muted `"No dates set"` text in the timeline area rather than omitting the row.

### Row structure

Render rows in this order. Insert a separator row (10px, `background: #f1f5f9`) between epics.

1. Epic row — full-width bar spanning its date range, bold label
2. Feature rows — indented 1.75rem, medium bar
3. Work item rows — indented 2.5rem, thin accent bar (omit when `--epics-only` flag is set)

### Bar styles

| State | Fill | Border | Text |
|---|---|---|---|
| Active | `#0ea5e9` solid | none | white |
| New | `#334155` | `1px dashed #475569` | `#94a3b8` |
| Resolved | `#94a3b8` solid | none | white |

Bar heights: epic 22px, feature 16px, work item 12px. Row height: 34px min.

### Today line

Amber vertical line (`#f59e0b`, 2px wide, 65% opacity) at today's date x-position. Render it as an absolutely-positioned element over the timeline area. If today falls outside the computed date range, clamp it to the nearest edge.

### Click → detail panel

Same detail panel implementation as the mindmap (310px, slides in from right, same content structure). Clicking a row label or bar cell opens the panel for that entity.

### Color scheme and typography

```
Background:        #ffffff
Header row bg:     #f8fafc
Grid lines:        #f1f5f9 (vertical month separators)
Epic label:        #1e293b, font-weight 700, font-size 13px
Feature label:     #475569, font-weight 500, font-size 12px
Work item label:   #94a3b8, font-weight 400, font-size 11.5px
Font family:       -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Legend

Bottom strip inside the gantt container, `background: #f8fafc`, `border-top: 1px solid #e8e4e0`:

```
■ Active   □ New (planned)   ▪ Resolved   | Today
```

### Data shape

Build a flat ordered array of row objects (not nested). Each row has a `level` field controlling indentation and bar style.

```javascript
const rows = [
  {
    id: "e1",
    level: "epic",
    label: "EHR Pipeline Modernization",    // display name (shortened if needed)
    fullName: "EHR Pipeline Modernization",
    state: "Active",
    startDate: "2026-02-01",               // ISO date string or null
    targetDate: "2026-09-30",
    est: "56",                             // string or null
    rem: "44",
    desc: "First meaningful sentence.",
    area: "Clinical Data Lake",
    priority: "4",
    childIds: ["f1", "f2", "f3"]          // for detail panel child list
  },
  {
    id: "f1",
    level: "feature",
    parentId: "e1",
    label: "FHIR R4 Support",
    fullName: "FHIR R4 Support",
    state: "Active",
    startDate: "2026-02-01",
    targetDate: "2026-05-15",
    release: "v3.0",
    est: "24",
    rem: "16",
    desc: "...",
    childIds: ["w1", "w2", "w3"]
  },
  {
    id: "w1",
    level: "workitem",
    parentId: "f1",
    label: "FHIR Resource Parser",
    fullName: "FHIR Resource Parser",
    state: "Active",
    startDate: null,
    targetDate: null,
    assignee: "marcus.chen@riverdale.org",
    iteration: "Sprint 2026-08",
    est: "24",
    rem: "16",
    desc: "...",
    childIds: []
  }
  // ... all rows in display order (epics, then their features, then their work items)
];
```

Embed actual data from the backlog files. Do not use placeholder values.

---

## Renderer: Activity Report (`/report day|week|month|quarter|year`)

Generate a markdown document summarising what changed in the Fabric instance over the specified period. Output to `output/activity-<period>-YYYY-MM-DD.md`.

### Period lookback

| Argument | Lookback | Granularity |
|---|---|---|
| `day` | Past 24 hours | Individual work items and request IDs |
| `week` | Past 7 days | Individual work items and request IDs |
| `month` | Past 30 days | Work items summarised by count, features by name |
| `quarter` | Past 90 days | Features summarised by count, epics by name |
| `year` | Past 365 days | Epic-level counts only |

### Data collection

**Step 1 — Git history.** Run:

```bash
git log --since="<lookback date>" --name-status --format="%H|%an|%ae|%ad|%s" --date=short
```

Parse the output to identify:
- Files added (`A`) under `requests/` → new requests (extract ID from folder name)
- Files modified under `requests/` where state changed → status changes
- Files added under `backlog/epics/` → classify by path depth (epic/feature/workitem)
- Files where a state field changed to `Resolved` or `Closed` → completed items
- Files added or modified under `team/members/` → team changes (new member, allocation change)
- Files added or modified under `products/` → product changes

**Step 2 — Context logs.** For each entity file modified in the period, read the entity file and extract context log entries whose timestamps (`YYYY-MM-DD` prefix) fall within the lookback window. Collect the 2–5 most significant entries — prefer entries mentioning decisions, evaluations, accepts/rejects, or status changes over routine content updates.

### Report format

```markdown
# Activity Report — <Period> ending <YYYY-MM-DD>

_Covering <start date> to <end date>_

## Requests
- New: <n> — R-101 (Clinical ML Pipeline), R-102 (Cohort Analysis)
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

### Rules

- **Omit sections with no activity** — do not write empty sections. A quiet period may produce a very short report.
- **Granularity scales with period:**
  - `day`/`week`: list individual work item names and request IDs
  - `month`: replace work item lists with counts (e.g. "8 work items added across 3 features"); list features by name
  - `quarter`/`year`: replace feature lists with counts; list epics by name only
- **Notable Context:** 2–5 bullets from context log entries. Each bullet captures a decision, outcome, or key event — not routine ingestion. Omit this section entirely if no relevant context log activity occurred in the period.
- **Report header** always shows the exact date range, not just the period name.
- **If git history is unavailable** (e.g. not a git repo), note this at the top of the report and fall back to reading current entity states only.

---

## Renderer: Effort Report (`/report effort`)

Generate a self-contained Chart.js HTML file showing total effort broken down by a team-defined label dimension.

### Arguments

- `by=<label-key>` — required. The label key to group by (e.g. `service-type`, `service-tier`).
- `scope=requests|backlog|all` — default `all`. Controls which data sources are traversed.
- `period` — optional date range filter applied to entity close dates. Values: `month`, `quarter`, `year`, `YYYY-MM-DD:YYYY-MM-DD`. Default: all-time (no filter).

### Data traversal

#### Label-aware attribution (backlog scopes)

Labels can be set at any level of the backlog hierarchy. A team might put `service-tier` on epics but `modality` on features. The traversal uses **lowest-wins attribution**: effort is claimed by the most specific entity that has the `by=` key set. This means the same report command resolves naturally at whatever level the team actually applies the label, without any configuration.

Algorithm for a single epic subtree:

1. Walk the tree depth-first (tasks → work items → features → epic).
2. At each node, check if its `Labels:` field contains the `by=` key.
3. If yes: claim that node's own `Effort:` value plus the sum of all *unclaimed* `Effort:` values from its descendants. Mark those descendants as claimed.
4. If no: leave the node's effort unclaimed for the parent to absorb.
5. After the full tree walk, any effort still unclaimed at the root epic level is attributed to the epic's label value (if set) or to `"(unlabeled)"`.

This means:
- A feature labeled `modality=imaging` claims its own effort and its work items' effort, even if the parent epic has no `modality` label.
- A work item labeled `modality=pathology` claims its own effort before its parent feature gets a chance to absorb it.
- Tier labels on the epic claim whatever effort wasn't already claimed at a lower level.

**scope=requests**
Scan `requests/*/request.md`. For each request:
- Read `Effort:` from the Properties section (pre-engagement hours).
- Read `Labels:` and extract the value for the `by=` key. If absent, attribute to `"(unlabeled)"`.
- Apply date filter on the request's `Submitted:` field if a period is specified.

**scope=backlog**
Walk the full backlog hierarchy. Apply the label-aware attribution algorithm per epic subtree.
Apply date filter on each entity's `Target Date` field if a period is specified — filter at the node level before attributing effort.

**scope=all** (default)
Merge both sources, avoiding double-counting on linked entities:
1. Scan all requests. For each request with a `Backlog Epic:` link, combine request.Effort with the label-aware attribution result from the linked epic subtree. Attribute the request's own effort to the request's `by=` label value (requests are pre-engagement and labelled at the request level).
2. Collect all epic IDs referenced via `Backlog Epic:` links across all requests.
3. Walk the backlog. For any epic whose ID is **not** in the set from step 2 (no linked request), apply label-aware attribution independently.
4. Merge all attributed effort grouped by label value.

### Aggregation

After traversal, produce a grouped result:

```javascript
[
  { label: "data-integration", hours: 84, count: 12 },
  { label: "analytics",        hours: 47, count:  8 },
  { label: "advisory",         hours: 11, count:  5 },
  { label: "(unlabeled)",      hours:  9, count:  3 }
]
```

Sort descending by hours. Compute `totalHours` and `percentShare` per group.

### Page structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Team Name] — Effort Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <style>/* see styles below */</style>
</head>
<body>
  <div class="page-header">...</div>
  <div class="kpi-card">...</div>
  <div class="chart-row">
    <div class="chart-wrap"><canvas id="effortDonut"></canvas></div>
    <div class="summary-table-wrap">...</div>
  </div>
  <div class="footer">...</div>
  <script>/* data + Chart.js init */</script>
</body>
</html>
```

### Visual design

Background: `#f7f5f2`. Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

**Page header:** Team name left, report title and date range right. `border-bottom: 2px solid #e8e4e0`, padding `20px 32px`.

**KPI card:** centered, `background: #ffffff`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`. Two values side by side:
- Total effort hours (large: `font-size: 48px, font-weight: 700, color: #1e293b`)
- Total items with effort recorded (smaller: `font-size: 20px, color: #64748b`)

**Chart row:** two-column flex layout, `gap: 32px`, `max-width: 960px`, centered.

Left column — donut chart:
- `Chart.js` doughnut, `cutout: '62%'`
- Color palette (cycle if more labels): `['#4f86c6','#e07b54','#5ba05b','#c9a84c','#9b72b0','#5ba8a0','#c96e6e','#8c8c8c']`
- Legend below chart, horizontal, label + hours + percentage
- Center label (drawn via plugin): total hours in large text

Right column — summary table:
```
| Label value | Hours | Items | Share |
|-------------|-------|-------|-------|
| data-int... |  84h  |   12  |  56%  |
```
`border-collapse: collapse`, alternating row background `#f8fafc`. Header `background: #1e293b, color: #ffffff`. Percentage share rendered as a thin inline bar (`background: #4f86c6`, height `6px`) below the number.

**Footer:** `font-size: 11px, color: #94a3b8`. Content:
`Generated by Fabric · Data range: <range> · Scope: <scope> · Label: <by=> · Generated <date>`

### Chart.js initialisation

```javascript
const data = [/* array of {label, hours, count} objects embedded from traversal */];
const totalHours = data.reduce((s, d) => s + d.hours, 0);
const palette = ['#4f86c6','#e07b54','#5ba05b','#c9a84c','#9b72b0','#5ba8a0','#c96e6e','#8c8c8c'];

new Chart(document.getElementById('effortDonut'), {
  type: 'doughnut',
  data: {
    labels: data.map(d => d.label),
    datasets: [{ data: data.map(d => d.hours), backgroundColor: palette, borderWidth: 2 }]
  },
  options: {
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.parsed}h (${Math.round(ctx.parsed / totalHours * 100)}%)`
        }
      }
    }
  }
});
```

Center text plugin (inline, no external dependency):

```javascript
Chart.register({
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea: { width, height, left, top } } = chart;
    ctx.save();
    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(totalHours + 'h', left + width / 2, top + height / 2);
    ctx.restore();
  }
});
```

### Empty state

If traversal produces no effort data (no `Effort:` fields found, or all are zero), render the page with the KPI card showing `0h` and a muted message in place of the chart: `"No effort recorded for this scope and period."` Do not fail silently.
