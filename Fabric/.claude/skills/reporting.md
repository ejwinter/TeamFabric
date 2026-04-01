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
