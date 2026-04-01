# Effort Tracking Design

**Date:** 2026-04-01
**Status:** Approved

## Overview

Effort tracking captures actual hours spent on backlog work. It is distinct from estimated and remaining hours (which are task-only planning fields) and represents a historical record of work done. Teams opt in via a constitution module flag.

## Schema

An `Effort:` property is added to all four backlog entity templates: Task, Work Item, Feature, and Epic.

```
- Effort: [actual hours spent, populated on close]
```

`Estimated Hours` and `Remaining Hours` remain task-only. `Effort:` is omitted from the file entirely when no effort has been recorded — same convention as `Labels`. It is populated at close time (by prompt or manually) and may also be set manually at any time.

### Placement in templates

- **Task:** After `Remaining Hours`
- **Work Item, Feature, Epic:** In the Properties section (these levels have no other hours fields)

## Effort Capture Behavior

When Effort Tracking is enabled, the agent collects effort as part of the close confirmation whenever it sets or confirms `State: Closed` on any backlog entity. Effort is collected before writing the file.

### Task (no children)

> "Closing 'Write migration script.' How many hours did this take? (Enter a number or skip)"

### Work item / feature / epic — all children have effort

> "Closing 'Deploy auth service.' All 4 tasks have effort — total is **14h**. Use that, or enter a different value?"

### Work item / feature / epic — partial child coverage

> "Closing 'Deploy auth service.' 3 of 4 tasks have effort — partial total is **11h**. Enter a total effort (or skip)."

### Work item / feature / epic — no children have effort (or no children at all)

> "Closing 'Deploy auth service.' No tasks have effort recorded. How many hours did this work item take? (Enter a number or skip)"

This case also applies when the entity has no children at all (e.g. a work item with no tasks, on a team that skips the task level).

Skipping is always valid — effort is never required. If skipped, the `Effort:` field is omitted from the file.

### Coverage check scope

The coverage check (all / partial / none) looks only at **direct children's `Effort:` fields**, not a deep scan. This is intentional — each level owns its own effort value, and a child's effort may already represent a rolled-up or manually overridden total. The agent does not recurse into grandchildren when proposing a close-time sum.

## Rollup Behavior

### Short-circuit rule

When rolling up effort from children:
- If a child has its own `Effort:` value, use it directly. Do not sum that child's descendants.
- If a child has no `Effort:` value, sum effort from its children recursively, applying the same short-circuit rule at each level.

This means a manually set effort at any level represents the authoritative cost for that subtree, regardless of what the children record.

### Child Summary display

Each child row in the Child Summary table includes an effort column:

```
| Feature | State | Effort |
|---------|-------|--------|
| F-001 Auth redesign | Closed | 32h |
| F-002 Data pipeline | Active | 18h (partial) |
| F-003 Reporting | New | — |
```

- `(partial)` — effort was summed from children with incomplete coverage
- `—` — no effort exists anywhere in that subtree

A rolled-up total line is added below the table:

```
- Effort (rolled up): 50h (1 feature pending)
```

The parenthetical notes how many children have no effort, so readers know the total may be incomplete.

### `/rollup-backlog` changes

The existing scan reads child entity files. It will additionally:
1. Read each child's `Effort:` field.
2. When a child has no `Effort:`, recurse into its descendants and apply the short-circuit rule to compute a subtree total.
3. Flag partial coverage (some descendants missing effort).
4. Write the effort column into the Child Summary table and the rolled-up total line.

The `--deep` flag already processes bottom-up, which aligns naturally — each level's effort is accurate before the parent is rolled up.

## Constitution Flag

A new row in the module table in the team's `CLAUDE.md`:

```
| Effort Tracking | Disabled | Capture actual hours on close, rollup to parent |
```

**When absent or Disabled:** No effort prompts on close. `Effort:` field not added to new entities. Effort column omitted from Child Summary.

**When Enabled:** All capture and rollup behavior above activates. Existing entities without `Effort:` are unaffected — the field is simply absent until the item is next closed or manually added.

The `/update` command adds this row when updating existing instances. Since absent = disabled, existing instances get no behavior change until they opt in.

## Implementation Scope

Changes required:
1. **`Fabric/backlog/template-task.md`** — add `Effort:` after `Remaining Hours`
2. **`Fabric/backlog/template-workitem.md`** — add `Effort:` to Properties
3. **`Fabric/backlog/template-feature.md`** — add `Effort:` to Properties
4. **`Fabric/backlog/template-epic.md`** — add `Effort:` to Properties
5. **`Fabric/template/fabric-backlog.md`** — add Effort Tracking section covering: field definition, close prompt rules, short-circuit rollup rule, module flag behavior
6. **`Fabric/.claude/commands/rollup-backlog.md`** — extend scan to read `Effort:`, apply short-circuit rule, write effort column and total to Child Summary
7. **`Fabric/template/CLAUDE.md`** — add `| Effort Tracking | Disabled | ... |` row to module table
8. **`Example/`** — update example entity files and CLAUDE.md to reflect the new field and flag
