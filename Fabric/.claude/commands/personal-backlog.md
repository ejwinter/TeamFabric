# /personal-backlog — Personal Work Queue

## Usage

```
/personal-backlog
```

Generates (or refreshes) `output/personal-backlog.md` — a quick-reference view of the current user's assigned work, grouped by feature.

## Behavior

### 1. Resolve Identity

Invoke the `identity` skill to identify the current user. If identity cannot be resolved (no matching email in member profiles), inform the user and stop:

> "I couldn't match your git email to a team member profile. Personal backlog requires a matched profile — ask someone with meta mode access to run /add-member if you're new."

### 2. Determine Iteration Filter

Read `### Iterations` from the team's `CLAUDE.md`. If `Iteration Start:` and `Iteration Duration:` are present, compute the current iteration name using:

```
n             = floor((today − Iteration Start) / Iteration Duration)
current_start = Iteration Start + n × Iteration Duration
current_end   = current_start + Iteration Duration − 1
name          = YYMMDD-YYMMDD  (e.g. 260401-260414)
```

If the `### Iterations` subsection is absent, there is no iteration filter — show all non-terminal assigned items.

### 3. Scan the Backlog

Scan all entity files in `backlog/` recursively. Do not scan `backlog/inbox/`. For each file, check whether the `Assigned to:` property matches the resolved member's email (case-insensitive). Collect matching features, work items, and tasks separately.

**State filter:**
- **With iteration config:** Include features and work items where `Iteration:` matches the current iteration name, OR items in `Active` state with no `Iteration:` set. Include `Closed` items whose `Terminated:` date falls within the current iteration window (these go in the "Closed this sprint" group). Features do not have an `Iteration:` field — include assigned features whose `State:` is non-terminal (not Closed or Removed).
- **Without iteration config:** Include all features, work items, and tasks where `State:` is not `Closed` or `Removed`.

### 4. Group by State

Assign each item to one of four state groups:

| Group | Criteria |
|-------|----------|
| Active | `State: Active` and `## Blockers` has no `Status: Active` entry |
| New | `State: New` |
| Blocked | `State: Active` with at least one `Status: Active` entry in `## Blockers` |
| Closed this sprint | `State: Closed` (iteration config only) |

Items in Blocked are removed from Active — they must not appear in both groups. Each item appears in exactly one group, determined by its own state.

### 5. Build the Feature Tree

Within each state group, organize items under their parent feature:

- **For work items and tasks:** identify the parent feature from the folder path (the `features/<feature-id>/` ancestor in the file's path). Load the feature title and path from its `feature.md`.
- **For features assigned directly to the user:** the feature itself is the top-level item.

A feature header appears in a state group when any of the following is true:
1. The feature itself is assigned to the user and its state falls in that group.
2. One or more child work items or tasks assigned to the user have a state that falls in that group.

The same feature may appear as a header in multiple state groups if its children have different states (e.g., some Active, some Blocked).

Sort features within each group by `Priority:` descending. Items without `Priority:` sort to the bottom.

### 6. Write the Report

Ensure `output/` exists at the instance root (create if needed). Write `output/personal-backlog.md`, overwriting any prior version:

```markdown
# Personal Backlog — [Member Name]
Generated: YYYY-MM-DD

*Current iteration: YYMMDD-YYMMDD*

## Active

### [FHIR R4 Support](../backlog/epics/ehr-pipeline/features/fhir-r4-support/feature.md) *(yours)*
- [FHIR Resource Parser](../backlog/.../workitem.md) — Story · 260415-260428
- [ADT Event Mapping](../backlog/.../workitem.md) — Story · 260415-260428

### [Data Lineage Tracking](../backlog/.../feature.md)
- [dbt Lineage Integration](../backlog/.../workitem.md) — Story

## New

### [FHIR R4 Support](../backlog/.../feature.md) *(yours)*
- [ADT Event Mapping](../backlog/.../workitem.md) — Story · 260415-260428

## Blocked

### [FHIR R4 Support](../backlog/.../feature.md) *(yours)*
- [FHIR Validation Suite](../backlog/.../workitem.md) — Story · 260415-260428 ⚠ blocked

## Closed this Sprint

### [FHIR R4 Support](../backlog/.../feature.md) *(yours)*
- [Schema Registry](../backlog/.../workitem.md) — Story · closed 2026-04-20
```

**Formatting rules:**

- `*(yours)*` appears on the feature header only when the feature itself is assigned to the user. Features used only as grouping context have no tag.
- **Relative links:** paths are relative from `output/personal-backlog.md` (e.g. `../backlog/epics/.../feature.md`).
- **Item line format:** `- [Title](../path) — Type · Iteration` where Type is the work item's `Type:` field (Story, Bug, etc.) and Iteration is omitted when blank. For tasks, omit Type and append the parent work item name in italic: `- [Task Title](../path) — *(workitem-name)*`.
- **Features assigned to user with no child items in this group:** show the feature header alone with no bullet list beneath it (it is its own item).
- **The "Current iteration" line** is omitted when no iteration config is present.
- **Empty groups:** omit the group entirely — do not emit empty `## Active` headers.

### 7. Confirm Output

Confirm the file was written or refreshed:

> "Personal backlog written to `output/personal-backlog.md` — [n] items across [list of non-empty groups]."

If no items were found:

> "No assigned items found for [Name]. Filter applied: current iteration 260415-260428 (plus Active items with no iteration set)."

## Notes

- Read-only command. No meta mode required.
- Running the command again refreshes `output/personal-backlog.md` in place.
- Does not scan `backlog/inbox/`.
- Does not scan `requests/` — request assignments are managed by the Triage module.
