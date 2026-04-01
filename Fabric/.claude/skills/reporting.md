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
