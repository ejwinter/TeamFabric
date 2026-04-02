# Effort Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `Effort:` field to all backlog entity levels, with AI-prompted capture on close, short-circuit rollup, and a constitution opt-in flag.

**Architecture:** All changes are to markdown files — four entity templates, the `fabric-backlog.md` module rules, the `rollup-backlog.md` command, the `Fabric/template/CLAUDE.md` module table, and the `Example/` instance. No code is written; verification is done by reading the modified files and confirming the content is correct.

**Tech Stack:** Markdown, git

---

## File Map

| File | Change |
|------|--------|
| `Fabric/backlog/template-task.md` | Add `Effort:` after `Remaining Hours` |
| `Fabric/backlog/template-workitem.md` | Add `Effort:` to Properties section |
| `Fabric/backlog/template-feature.md` | Add `Effort:` to Properties section |
| `Fabric/backlog/template-epic.md` | Add `Effort:` to Properties section |
| `Fabric/template/fabric-backlog.md` | Add Effort Tracking section; add `Effort:` to property lists in entity definitions |
| `Fabric/.claude/commands/rollup-backlog.md` | Extend scan to read `Effort:`, short-circuit rule, effort column in Child Summary |
| `Fabric/template/CLAUDE.md` | Add `Effort Tracking` row to module table |
| `Example/CLAUDE.md` | Add `Effort Tracking` row to module table |
| `Example/.claude/fabric-backlog.md` | Sync updated content from `Fabric/template/fabric-backlog.md` |
| `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md` | Add `Effort: 16` to demonstrate field in context |

---

## Task 1: Add Effort field to entity templates

**Files:**
- Modify: `Fabric/backlog/template-task.md`
- Modify: `Fabric/backlog/template-workitem.md`
- Modify: `Fabric/backlog/template-feature.md`
- Modify: `Fabric/backlog/template-epic.md`

- [ ] **Step 1: Add Effort to task template**

In `Fabric/backlog/template-task.md`, the Properties section currently ends with:
```
- Estimated Hours: [number of hours this should take or was originally estimated at]
- Remaining Hours: [the number of hours remaining on the task]
```

Add `Effort:` after `Remaining Hours`:
```
- Estimated Hours: [number of hours this should take or was originally estimated at]
- Remaining Hours: [the number of hours remaining on the task]
- Effort: [actual hours spent, populated on close]
```

- [ ] **Step 2: Add Effort to workitem template**

In `Fabric/backlog/template-workitem.md`, the Properties section ends with:
```
- Assigned to: [optional, the name or email of the person this is assigned to, it is probably a team member]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

Add `Effort:` between `Assigned to` and `Labels`:
```
- Assigned to: [optional, the name or email of the person this is assigned to, it is probably a team member]
- Effort: [actual hours spent, populated on close]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

- [ ] **Step 3: Add Effort to feature template**

In `Fabric/backlog/template-feature.md`, the Properties section ends with:
```
- Priority: [optional 1(lowest)-5(highest) representing the priority of the feature]
- Area: [optional area path representing a product or service line]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

Add `Effort:` between `Area` and `Labels`:
```
- Priority: [optional 1(lowest)-5(highest) representing the priority of the feature]
- Area: [optional area path representing a product or service line]
- Effort: [actual hours spent, populated on close]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

- [ ] **Step 4: Add Effort to epic template**

In `Fabric/backlog/template-epic.md`, the Properties section ends with:
```
- Priority: [optional 1(lowest)-5(highest) representing the priority of the epic]
- Area: [optional area path representing a product or service line]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

Add `Effort:` between `Area` and `Labels`:
```
- Priority: [optional 1(lowest)-5(highest) representing the priority of the epic]
- Area: [optional area path representing a product or service line]
- Effort: [actual hours spent, populated on close]
- Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction, security-sensitive=true]
```

- [ ] **Step 5: Verify all four templates**

Read each file and confirm `Effort:` appears in the correct position in each Properties section.

- [ ] **Step 6: Commit**

```bash
git add Fabric/backlog/template-task.md Fabric/backlog/template-workitem.md Fabric/backlog/template-feature.md Fabric/backlog/template-epic.md
git commit -m "feat: add Effort field to all backlog entity templates"
```

---

## Task 2: Add Effort Tracking rules to fabric-backlog.md

**Files:**
- Modify: `Fabric/template/fabric-backlog.md`

This task updates the canonical module rules file. Two places need changes: (1) the entity property lists in the Entity Hierarchy section, and (2) a new Effort Tracking section added after the Labels section.

- [ ] **Step 1: Update entity property lists**

In the **Epic** properties block, add `Effort:` between `Area` and `Labels`:
```
- Area: [optional area path representing a product or service line]
- Effort: [optional, actual hours spent — populated on close when Effort Tracking is enabled]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

In the **Feature** properties block, add `Effort:` between `Area` and `Labels`:
```
- Area: [optional area path representing a product or service line]
- Effort: [optional, actual hours spent — populated on close when Effort Tracking is enabled]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

In the **Work Item** properties block, add `Effort:` between `Assigned to` and `Labels`:
```
- Assigned to: [optional]
- Effort: [optional, actual hours spent — populated on close when Effort Tracking is enabled]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

In the **Task** properties block, add `Effort:` after `Remaining Hours`:
```
- Estimated Hours: [optional]
- Remaining Hours: [optional]
- Effort: [optional, actual hours spent — populated on close when Effort Tracking is enabled]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

- [ ] **Step 2: Add Effort Tracking section**

After the `## Labels` section (which ends with the line `Classification, inbox refinement, assignment recommendations, and reclassification guidance are in the backlog-refinement skill.`) and before `## Relationship to Triage`, insert:

```markdown
## Effort Tracking

Effort tracking captures actual hours spent on backlog work. It is distinct from `Estimated Hours` and `Remaining Hours` (task-only planning fields) and represents a historical record of work done. Teams opt in via the `Effort Tracking` module flag in their constitution.

When Effort Tracking is **disabled** (or absent): no effort prompts on close, `Effort:` field not added to new entities, effort column omitted from Child Summary.

When Effort Tracking is **enabled**: the agent collects effort as part of the close confirmation whenever it sets or confirms `State: Closed` on any backlog entity. Effort is collected before writing the file. The `Effort:` field is omitted from the file entirely when no effort has been recorded — same convention as `Labels`.

### Close Prompts

**Task (no children):**
> "Closing '[title].' How many hours did this take? (Enter a number or skip)"

**Work item / feature / epic — all direct children have effort:**
> "Closing '[title].' All N children have effort — total is Xh. Use that, or enter a different value?"

**Work item / feature / epic — partial direct child coverage:**
> "Closing '[title].' N of M children have effort — partial total is Xh. Enter a total effort (or skip)."

**Work item / feature / epic — no direct children have effort (or no children at all):**
> "Closing '[title].' No children have effort recorded. How many hours did this take? (Enter a number or skip)"

This last case also applies when the entity has no children at all (e.g. a work item on a team that skips the task level).

The coverage check looks only at **direct children's `Effort:` fields**, not a deep scan. Skipping is always valid — effort is never required.

### Short-Circuit Rollup Rule

When rolling up effort from children:
- If a child has its own `Effort:` value, use it directly. Do not sum that child's descendants.
- If a child has no `Effort:` value, sum effort from its children recursively, applying the same rule at each level.

A manually set effort at any level represents the authoritative cost for that subtree, regardless of what the children record.
```

- [ ] **Step 3: Verify**

Read `Fabric/template/fabric-backlog.md` and confirm:
- `Effort:` appears in all four entity property lists
- The `## Effort Tracking` section is present after `## Labels`
- All four close prompt variants are present
- The short-circuit rollup rule is present

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "feat: add Effort Tracking section and field definitions to fabric-backlog.md"
```

---

## Task 3: Update rollup-backlog command

**Files:**
- Modify: `Fabric/.claude/commands/rollup-backlog.md`

- [ ] **Step 1: Extend the scan step**

In step 2 of the Behavior section ("Scan children"), the current text for features is:

```
- For features: count work item subdirectories and sum estimated hours from task files (if present) for the sizing signal.
```

Replace that line with:

```
- For features: count work item subdirectories. If Effort Tracking is enabled, read each child work item's `Effort:` field. For work items without `Effort:`, recurse into their task children and sum task-level `Effort:` values (applying the short-circuit rule: if a task has `Effort:`, use it; otherwise it contributes 0). Flag partial coverage when some descendants are missing effort entirely.
- For epics: count feature subdirectories and note their states. If Effort Tracking is enabled, read each child feature's `Effort:` field. For features without `Effort:`, recurse into their work item children and apply the same short-circuit rule.
```

- [ ] **Step 2: Update the Child Summary output spec**

In step 6 ("Write on confirmation"), after the `Labels (rolled up)` example, add:

```markdown
If Effort Tracking is enabled, include an effort column in the Child Summary table and an effort total line below it:

```text
| Feature | State | Effort |
|---------|-------|--------|
| F-001 Auth redesign | Closed | 32h |
| F-002 Data pipeline | Active | 18h (partial) |
| F-003 Reporting | New | — |

- Effort (rolled up): 50h (1 feature pending)
```

Column values:
- `Xh` — entity has its own `Effort:` value or a complete subtree sum
- `Xh (partial)` — subtree sum exists but some descendants have no effort
- `—` — no effort anywhere in the subtree

The total line's parenthetical counts direct children with no effort contribution.

If Effort Tracking is disabled, omit the effort column and total line entirely.
```

- [ ] **Step 3: Verify**

Read `Fabric/.claude/commands/rollup-backlog.md` and confirm:
- Scan step now describes effort field reading and short-circuit recursion for both epics and features
- Child Summary output spec includes the effort column and total line with all three column value formats

- [ ] **Step 4: Commit**

```bash
git add Fabric/.claude/commands/rollup-backlog.md
git commit -m "feat: add effort rollup to rollup-backlog command"
```

---

## Task 4: Update Fabric template CLAUDE.md

**Files:**
- Modify: `Fabric/template/CLAUDE.md`

- [ ] **Step 1: Add Effort Tracking module row**

In `Fabric/template/CLAUDE.md`, the Enabled Modules table currently reads:

```
| Backlog | Disabled | Epic/feature/work-item hierarchy |
| Scrum | Disabled | Sprint ceremonies and daily facilitation |
```

Add a new row after Backlog:

```
| Backlog | Disabled | Epic/feature/work-item hierarchy |
| Effort Tracking | Disabled | Capture actual hours on close, rollup to parent |
| Scrum | Disabled | Sprint ceremonies and daily facilitation |
```

- [ ] **Step 2: Verify**

Read `Fabric/template/CLAUDE.md` and confirm the Effort Tracking row is present and uses `Disabled` as the default.

- [ ] **Step 3: Commit**

```bash
git add Fabric/template/CLAUDE.md
git commit -m "feat: add Effort Tracking module row to template CLAUDE.md"
```

---

## Task 5: Update Example instance

**Files:**
- Modify: `Example/CLAUDE.md`
- Modify: `Example/.claude/fabric-backlog.md`
- Modify: `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md`

- [ ] **Step 1: Add Effort Tracking module row to Example/CLAUDE.md**

In `Example/CLAUDE.md`, the Enabled Modules table currently reads:

```
| Backlog | Enabled | Hierarchical work tracking — epics, features, work items, tasks |
| Scrum | Disabled | Team does not follow scrum practices |
```

Add a new row after Backlog:

```
| Backlog | Enabled | Hierarchical work tracking — epics, features, work items, tasks |
| Effort Tracking | Enabled | Capture actual hours on close, rollup to parent |
| Scrum | Disabled | Team does not follow scrum practices |
```

The Example instance has Effort Tracking enabled so it demonstrates the active behavior.

- [ ] **Step 2: Sync Example/.claude/fabric-backlog.md**

`Example/.claude/fabric-backlog.md` is a copy of `Fabric/template/fabric-backlog.md` (as it would appear in a deployed instance). Replace its entire contents with the updated content from `Fabric/template/fabric-backlog.md` (which now includes the `## Effort Tracking` section and updated property lists from Task 2).

- [ ] **Step 3: Add Effort to an example task**

In `Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md`, the Properties section currently reads:

```
- State: Active
- Assigned to: marcus.chen@riverdale.org
- Estimated Hours: 16
- Remaining Hours: 8
```

Add `Effort: 16` after `Remaining Hours` to demonstrate the field in a real entity:

```
- State: Active
- Assigned to: marcus.chen@riverdale.org
- Estimated Hours: 16
- Remaining Hours: 8
- Effort: 16
```

- [ ] **Step 4: Verify**

Read all three modified files and confirm:
- `Example/CLAUDE.md` has `Effort Tracking | Enabled` row
- `Example/.claude/fabric-backlog.md` has the `## Effort Tracking` section and all four updated entity property lists
- `implement-parser.md` has `- Effort: 16` after `Remaining Hours`

- [ ] **Step 5: Commit**

```bash
git add Example/CLAUDE.md Example/.claude/fabric-backlog.md "Example/backlog/epics/ehr-pipeline-modernization/features/fhir-r4-support/workitems/fhir-resource-parser/tasks/implement-parser.md"
git commit -m "feat: update Example instance with effort tracking module and sample data"
```
