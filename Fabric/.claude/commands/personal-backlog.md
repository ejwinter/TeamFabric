# /personal-backlog — Personal Work Queue

## Usage

```
/personal-backlog
```

Generates (or refreshes) `output/personal-backlog.md` — a quick-reference list of backlog items assigned to the current user.

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

Scan all entity files in `backlog/` recursively (work items and tasks at every depth). Do not scan `backlog/inbox/`. For each file, check whether the `Assigned to:` property matches the resolved member's email. Matching is case-insensitive.

**State filter:**
- **With iteration config:** Include items where `Iteration:` matches the current iteration name, OR items in `Active` state with no `Iteration:` set. Also include any items in `Closed` state whose `Terminated:` date falls within the current iteration window (these go in the "Closed this sprint" group).
- **Without iteration config:** Include all items where `State:` is not `Closed` or `Removed`.

### 4. Group and Sort

Group collected items into up to four buckets, in this order:

| Group | Criteria |
|-------|----------|
| Active | `State: Active` and no non-empty `## Blockers` section with an Active entry |
| New | `State: New` |
| Blocked | `State: Active` with a `## Blockers` section containing at least one `Status: Active` entry |
| Closed this sprint | `State: Closed` (iteration config only) |

Items in Blocked are removed from Active — they must not appear in both groups.

Within each group, sort by `Priority:` descending (highest number first). Items without a `Priority:` value sort to the bottom of their group.

### 5. Write the Report

Ensure `output/` exists at the instance root (create if needed). Write `output/personal-backlog.md`, overwriting any prior version:

```markdown
# Personal Backlog — [Member Name]
Generated: YYYY-MM-DD

*Current iteration: YYMMDD-YYMMDD*

## Active ([n])

| Item | Type | Priority | Iteration |
|------|------|----------|-----------|
| [Title](../relative/path/to/workitem.md) | Story | 3 | 260415-260428 |

## New ([n])

| Item | Type | Priority | Iteration |
|------|------|----------|-----------|
| [Title](../relative/path/to/workitem.md) | Story | — | 260415-260428 |

## Blocked ([n])

| Item | Type | Iteration |
|------|------|-----------|
| [Title](../relative/path/to/workitem.md) | Story | 260415-260428 |

## Closed this Sprint ([n])

| Item | Type | Terminated |
|------|------|------------|
| [Title](../relative/path/to/workitem.md) | Story | 2026-04-10 |
```

**Relative links:** Each item's link is a relative path from `output/personal-backlog.md` to the entity file (e.g. `../backlog/epics/ehr-pipeline/features/fhir-r4/workitems/fhir-parser/workitem.md`).

**Empty groups:** Omit the table and show `*(none)*` instead. Always emit the group header so the section is visible even when empty.

**Omit columns** that are entirely empty across all items in a group (e.g. if no items in the Active group have a Priority set, omit the Priority column for that table). The Type and Item columns are always present.

**The "Current iteration" line** is omitted when no iteration config is present.

**Tasks vs Work Items:** Display both. For tasks, append the parent work item name in italic after the title: `Implement parser *(fhir-resource-parser)*`. The parent is the work item folder name containing the `tasks/` directory.

### 6. Confirm Output

Confirm the file was written or refreshed:

> "Personal backlog written to `output/personal-backlog.md` — [n] items across [list of non-empty groups]."

If no items were found, explain the filter that was applied:

> "No assigned items found for [Name]. Filter applied: current iteration 260415-260428 (plus Active items with no iteration set)."

or, without iteration config:

> "No assigned items found for [Name] across all non-terminal states."

## Notes

- Read-only command. No meta mode required.
- Running the command again refreshes `output/personal-backlog.md` in place.
- Does not scan `backlog/inbox/` — inbox items are unassigned by definition.
- Does not scan `requests/` — request assignments are managed by the Triage module.
