# clean-fabric Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `/clean-fabric` command to TeamFabric, including all schema changes, module rule updates, and Example instance demonstration data.

**Architecture:** Schema changes are applied to Fabric templates first (the canonical source), then propagated to the Example instance. The `entity-transitions` skill and triage module gain `Terminated:` write behavior so the field is set proactively. The `clean-fabric` command handles backfill for any entities that missed it. Member's `bench` subcommand is renamed `depart`.

**Tech Stack:** Markdown files, Claude Code slash commands and skills, git for history and date backfill.

---

## File Map

**Modified — templates:**
- `Fabric/backlog/template-epic.md` — add `Terminated:` to Properties
- `Fabric/backlog/template-feature.md` — add `Terminated:` to Properties
- `Fabric/backlog/template-workitem.md` — add `Terminated:` to Properties
- `Fabric/backlog/template-task.md` — add `Terminated:` to Properties
- `Fabric/team/members/template/profile.md` — `Benched` → `Departed`, add `Terminated:`
- `Fabric/team/stakeholders/template/profile.md` — update `Status` values, add `Terminated:`
- `Fabric/products/template/product.md` — add `Terminated:` to Properties

**Modified — module rules:**
- `Fabric/template/fabric-core.md` — add `## Fabric GC` configuration section
- `Fabric/template/fabric-triage.md` — write `Terminated:` when request hits terminal state
- `Fabric/template/fabric-backlog.md` — note that `entity-transitions` writes `Terminated:` on close/remove

**Modified — commands and skills:**
- `Fabric/.claude/commands/member.md` — rename `bench` → `depart`, update all references, write `Terminated:` on depart
- `Fabric/.claude/skills/entity-transitions.md` — write `Terminated:` in Closed/Resolved/Removed transition paths

**Created:**
- `Fabric/.claude/commands/clean-fabric.md` — the new command

**Modified — Example instance (copy of template changes + demo data):**
- `Example/.claude/fabric-core.md`
- `Example/.claude/fabric-triage.md`
- `Example/.claude/fabric-backlog.md`
- `Example/team/members/alex-rivera/profile.md` — new departed member
- `Example/backlog/epics/ehr-pipeline-modernization/epic.md` — add `Terminated:` to demonstrate backfill
- `Example/requests/R-101/request.md` — add `Terminated:` to demonstrate backfill

---

## Task 1: Add `Terminated:` to backlog entity templates

**Files:**
- Modify: `Fabric/backlog/template-epic.md`
- Modify: `Fabric/backlog/template-feature.md`
- Modify: `Fabric/backlog/template-workitem.md`
- Modify: `Fabric/backlog/template-task.md`

- [ ] **Step 1: Add `Terminated:` to template-epic.md**

In `Fabric/backlog/template-epic.md`, in the `## Properties` block, add after the `State:` line:

```markdown
- State: New | Active | Resolved | Removed | Closed
- Terminated: [YYYY-MM-DD — set when State becomes Closed or Removed]
```

- [ ] **Step 2: Add `Terminated:` to template-feature.md**

In `Fabric/backlog/template-feature.md`, in the `## Properties` block, add after the `State:` line:

```markdown
- State: New | Active | Resolved | Removed | Closed
- Terminated: [YYYY-MM-DD — set when State becomes Closed or Removed]
```

- [ ] **Step 3: Add `Terminated:` to template-workitem.md**

In `Fabric/backlog/template-workitem.md`, in the `## Properties` block, add after the `State:` line:

```markdown
- State: New | Active | Resolved | Removed | Closed
- Terminated: [YYYY-MM-DD — set when State becomes Closed or Removed]
```

- [ ] **Step 4: Add `Terminated:` to template-task.md**

In `Fabric/backlog/template-task.md`, in the `## Properties` block, add after the `State:` line:

```markdown
- State: New | Active | Closed | Removed
- Terminated: [YYYY-MM-DD — set when State becomes Closed or Removed]
```

- [ ] **Step 5: Verify all four files**

Read each template and confirm `Terminated:` appears immediately after `State:` in the Properties block. Confirm no other lines were disturbed.

- [ ] **Step 6: Commit**

```bash
git add Fabric/backlog/template-epic.md Fabric/backlog/template-feature.md Fabric/backlog/template-workitem.md Fabric/backlog/template-task.md
git commit -m "add Terminated: field to backlog entity templates"
```

---

## Task 2: Update member profile template

**Files:**
- Modify: `Fabric/team/members/template/profile.md`

- [ ] **Step 1: Rename Benched → Departed and add Terminated:**

In `Fabric/team/members/template/profile.md`, replace:

```markdown
Status: [Active | Benched | Onboarding]
```

with:

```markdown
Status: [Active | Departed | Onboarding]
Terminated: [YYYY-MM-DD — set when Status becomes Departed]
```

- [ ] **Step 2: Verify**

Read the file and confirm `Status:` shows `Active | Departed | Onboarding` and `Terminated:` appears on the next line. Confirm no other content changed.

- [ ] **Step 3: Commit**

```bash
git add Fabric/team/members/template/profile.md
git commit -m "rename Benched to Departed in member template, add Terminated: field"
```

---

## Task 3: Update stakeholder profile template

**Files:**
- Modify: `Fabric/team/stakeholders/template/profile.md`

- [ ] **Step 1: Update Status values and add Terminated:**

In `Fabric/team/stakeholders/template/profile.md`, replace:

```markdown
Status: Active | Former
```

with:

```markdown
Status: Active | Departed
Terminated: [YYYY-MM-DD — set when Status becomes Departed]
```

- [ ] **Step 2: Verify**

Read the file and confirm `Status:` shows `Active | Departed` and `Terminated:` is present below it.

- [ ] **Step 3: Commit**

```bash
git add Fabric/team/stakeholders/template/profile.md
git commit -m "update stakeholder template: Departed status and Terminated: field"
```

---

## Task 4: Update product template

**Files:**
- Modify: `Fabric/products/template/product.md`

- [ ] **Step 1: Add Terminated: after Status:**

In `Fabric/products/template/product.md`, find the `Status:` line in the properties area and add `Terminated:` immediately after it:

```markdown
Status: [Active | Sunset | Planned | Retired]
Terminated: [YYYY-MM-DD — set when Status becomes Retired or Sunset]
```

- [ ] **Step 2: Verify**

Read the file and confirm `Terminated:` appears after `Status:`.

- [ ] **Step 3: Commit**

```bash
git add Fabric/products/template/product.md
git commit -m "add Terminated: field to product template"
```

---

## Task 5: Update entity-transitions skill to write `Terminated:`

**Files:**
- Modify: `Fabric/.claude/skills/entity-transitions.md`

- [ ] **Step 1: Add Terminated: write to Active → Resolved/Closed path**

In the `Active → Resolved / Closed` section, find step 9 (the confirmation and write step). After "set `State: Resolved` or `State: Closed`", add:

```markdown
9. On confirmation: set `State: Resolved` or `State: Closed` as appropriate for the entity type. Update any confirmed explicit DoD checkboxes. Write `Terminated: <today's date>` to the Properties block if not already set.
```

- [ ] **Step 2: Add Terminated: write to Any → Removed path**

In the `Any → Removed` section, find step 4 (the confirmation and write step). After "Set `State: Removed`", add:

```markdown
4. On confirmation:
   - Set `State: Removed`.
   - Write `Terminated: <today's date>` to the Properties block if not already set.
   - Do NOT delete the file.
   - Suggest a git commit: "Recommend committing this change: `git commit -m 'Remove [entity title]'`"
```

- [ ] **Step 3: Verify**

Read the skill file and confirm `Terminated:` write instructions appear in both terminal transition paths, and the "if not already set" guard is present in both to avoid overwriting an existing date.

- [ ] **Step 4: Commit**

```bash
git add Fabric/.claude/skills/entity-transitions.md
git commit -m "write Terminated: date on terminal state transitions"
```

---

## Task 6: Update fabric-triage.md to write `Terminated:` on terminal request states

**Files:**
- Modify: `Fabric/template/fabric-triage.md`

- [ ] **Step 1: Add Terminated: to the close prompt section**

In `Fabric/template/fabric-triage.md`, find the `#### Close prompt` section (around line 83). After the existing effort prompt instruction, add:

```markdown
When writing a terminal state to a request, also write `Terminated: <today's date>` to the request's Properties block if not already set. This applies to all terminal states: Declined, Withdrawn, Complete, and any team-defined equivalents.
```

- [ ] **Step 2: Verify**

Read the section and confirm the `Terminated:` write instruction is present, with the "if not already set" guard and the list of terminal states.

- [ ] **Step 3: Commit**

```bash
git add Fabric/template/fabric-triage.md
git commit -m "write Terminated: date when request reaches terminal state"
```

---

## Task 7: Update member command — bench → depart

**Files:**
- Modify: `Fabric/.claude/commands/member.md`

- [ ] **Step 1: Update the subcommand table**

In the subcommands table, replace:

```markdown
| bench [name] | Set a member's status to Benched |
| activate [name] | Restore a benched member to Active |
```

with:

```markdown
| depart [name] | Set a member's status to Departed |
| activate [name] | Restore a departed member to Active |
```

- [ ] **Step 2: Rename the /member bench section to /member depart**

Replace the entire `## /member bench` section header and content. Change:
- Section header: `## /member bench` → `## /member depart`
- Purpose line: "Set a member's status to Benched" → "Set a member's status to Departed"
- Confirmation prompt: replace `"Bench [name]? They will be excluded..."` with `"Mark [name] as Departed? They will be excluded from capacity calculations and staffing suggestions. Their profile and all context references will be preserved."`
- Status write: `Status: Benched` → `Status: Departed`
- Context log entry: `"Status changed to Benched"` → `"Status changed to Departed"`
- Add after the status write: also write `Terminated: <today's date>` to the Properties block.
- Notes: change "Benching is reversible via `/member activate`." → "Departure is reversible via `/member activate`."
- Notes: change "The AI should never suggest removing or deleting a member. Benching is the correct action." → "The AI should never suggest removing or deleting a member. `/member depart` is the correct action."

- [ ] **Step 3: Update /member activate section**

In `## /member activate`:
- Purpose line: "Restore a benched member to Active status." → "Restore a departed member to Active status."
- Step 1 filter: "filtered to Benched members" → "filtered to Departed members"
- Step 1 empty case: "no benched members exist" → "no departed members exist"
- Context log entry: `"Status changed to Active"` → `"Status changed to Active. [allocation note if changed]"`
- Add after setting `Status: Active`: also clear `Terminated:` from the Properties block (remove the line entirely).

- [ ] **Step 4: Verify**

Read the full command file and confirm:
- No remaining references to "Benched" or "bench" (except in comments about old data)
- `Terminated:` is written on depart and cleared on activate
- The notes section no longer references benching

- [ ] **Step 5: Commit**

```bash
git add Fabric/.claude/commands/member.md
git commit -m "rename member bench to depart, write Terminated: on departure"
```

---

## Task 8: Add `## Fabric GC` section to fabric-core.md

**Files:**
- Modify: `Fabric/template/fabric-core.md`

- [ ] **Step 1: Add the GC section**

Append the following section to the end of `Fabric/template/fabric-core.md`:

```markdown
## Fabric GC

The `/clean-fabric` command scans the instance for stale and terminal-state artifacts and removes or archives them after review. Default retention is 90 days after `Terminated:` for most artifacts; 1 year for epics and requests.

Teams may override defaults by adding a `## Fabric GC` table to their `CLAUDE.md` or `team/team.md`:

```markdown
## Fabric GC

| Artifact | Retention |
|----------|-----------|
| standup-log | 180 days |
| retro | 1 year |
| member | 1 year |
```

Valid artifact keys: `epic`, `request`, `feature`, `workitem`, `task`, `inbox-item`, `standup-log`, `discuss-log`, `retro`, `member`, `stakeholder`, `product`.

When a team member asks "how do I change retention for X?", point them to this table and explain that it overrides the framework defaults for that artifact type only.
```

- [ ] **Step 2: Verify**

Read the end of `fabric-core.md` and confirm the section is present with the full valid artifact key list and the override table format example.

- [ ] **Step 3: Commit**

```bash
git add Fabric/template/fabric-core.md
git commit -m "add Fabric GC configuration section to fabric-core"
```

---

## Task 9: Update fabric-backlog.md behavioral rules

**Files:**
- Modify: `Fabric/template/fabric-backlog.md`

- [ ] **Step 1: Add Terminated: note to behavioral rules**

In `Fabric/template/fabric-backlog.md`, in the `## Behavioral Rules` section, add after the line about `entity-transitions`:

```markdown
- When `entity-transitions` writes a terminal state (Closed or Removed), it also writes `Terminated: <today>` to the entity's Properties block. This date is used by `/clean-fabric` to calculate retention eligibility.
```

- [ ] **Step 2: Verify**

Read the behavioral rules section and confirm the new note is present and references both `entity-transitions` and `/clean-fabric`.

- [ ] **Step 3: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "note Terminated: write behavior in backlog module rules"
```

---

## Task 10: Create the `/clean-fabric` command

**Files:**
- Create: `Fabric/.claude/commands/clean-fabric.md`

- [ ] **Step 1: Create the command file with the following content:**

```markdown
# /clean-fabric — Instance Maintenance and Garbage Collection

## Purpose

Scan this Fabric instance for stale and terminal-state artifacts, produce a review report, and — after confirmation — remove or archive eligible items. Git history is the safety net; nothing is acted on without user approval.

Also performs a `Terminated:` backfill sweep across all terminal-state entities so future runs have a reliable date.

---

## Usage

```
/clean-fabric
```

No arguments. Always runs interactively.

---

## Step 1: Terminated: Backfill Sweep

Before evaluating cleanup eligibility, scan **all** terminal-state entities in the instance — regardless of age.

For each terminal-state entity missing a `Terminated:` field:

1. Run `git log --follow -1 --format="%as" -- <file-path>` to find the last commit date on the entity's primary file.
2. If git returns a date, write `Terminated: <git-date>` to the Properties block.
3. If git returns nothing (untracked or ambiguous), write `Terminated: <today>` and add the entity to the report's **Needs Attention** section.

Terminal states by artifact:
- Epic, Feature, Work Item: `State: Closed` or `State: Removed`
- Task: `State: Closed` or `State: Removed`
- Request: `Status: Declined`, `Status: Withdrawn`, `Status: Complete` (and any team-defined terminal states in their triage module)
- Product: `Status: Retired` or `Status: Sunset`
- Member profile: `Status: Departed`
- Stakeholder profile: `Status: Departed`

Also flag any member profile with `Status: Benched` in the **Needs Attention** section: "Status: Benched should be updated to Departed."

Track:
- Total terminal-state entities scanned
- Count backfilled using git date
- Count backfilled using today's date (flagged)

---

## Step 2: Load Retention Rules

Read retention overrides from the team's constitution. Check two locations in order:
1. `CLAUDE.md` — look for a `## Fabric GC` table
2. `team/team.md` — look for a `## Fabric GC` table

If a `## Fabric GC` table is found, use its values to override the defaults below. For any artifact type not in the table, use the default.

**Default retention rules:**

| Artifact | Terminal States | Retention | Action |
|---|---|---|---|
| Epic | `Closed`, `Removed` | 1 year | Archive → `backlog/archive/<slug>.md` |
| Request | `Declined`, `Withdrawn`, `Complete` | 1 year | Archive → `requests/archive/R-NNN.md` |
| Feature | `Closed`, `Removed` | 90 days | Delete directory |
| Work Item | `Closed`, `Removed` | 90 days | Delete directory |
| Task | `Closed`, `Removed` | 90 days | Delete directory |
| Inbox Item | Any (age from file mtime) | 90 days | Delete file |
| Standup log | Date in filename | 90 days | Delete file |
| Member discuss-log | Date in filename | 90 days | Delete file |
| Retro folder | `Status: Closed` + `Closed:` date | 90 days | Delete directory |
| Member profile | `Status: Departed` + `Terminated:` | 90 days | Archive → `team/archive/members/<slug>.md` |
| Stakeholder profile | `Status: Departed` + `Terminated:` | 90 days | Archive → `team/archive/stakeholders/<slug>.md` |
| Product | `Retired`, `Sunset` | 90 days | Archive → `products/archive/<slug>.md` |

---

## Step 3: Candidate Scan

Identify all artifacts past their retention threshold. For each artifact type:

**Epics** — scan `backlog/epics/*/epic.md`. For each: read `State:` and `Terminated:`. If terminal and `(today − Terminated) >= retention`, add to candidates.

**Requests** — scan `requests/R-*/request.md`. For each: read `Status:` and `Terminated:`. If terminal and past retention, add to candidates.

**Features** — scan all `*/features/*/feature.md` files. Check `State:` and `Terminated:`.

**Work Items** — scan all `*/workitems/*/workitem.md` files. Check `State:` and `Terminated:`.

**Tasks** — scan all `*/tasks/*/task.md` files. Check `State:` and `Terminated:`.

**Inbox Items** — scan `backlog/inbox/*.md`. Use file mtime as the age.

**Standup logs** — scan `team/standup/standup-log/YYYY-MM-DD.md`. Parse date from filename. Age = today − filename date.

**Member discuss-logs** — scan `team/members/*/discuss-log/YYYY-MM-DD.md`. Parse date from filename.

**Retro folders** — scan `team/retros/*/retro.md`. Read `Status:` and `Closed:`. If `Status: Closed` and `(today − Closed) >= retention`, add to candidates.

**Member profiles** — scan `team/members/*/profile.md` (exclude `template/`). Read `Status:` and `Terminated:`.

**Stakeholder profiles** — scan `team/stakeholders/*/profile.md` (exclude `template/`). Read `Status:` and `Terminated:`.

**Products** — scan `products/*/product.md` (exclude `template/`). Read `Status:` and `Terminated:`.

---

## Step 4: Write Report

Write the full candidate list to `output/cleanup-report.md`. Create the `output/` directory if it doesn't exist.

Report format:

```markdown
# Fabric Cleanup Report — YYYY-MM-DD

## Terminated: Backfill
Scanned N terminal-state entities.
Backfilled Terminated: on N entities (git date: N, today's date: N).

## Summary
N items eligible for cleanup across N artifact types.
N items to archive. N items to delete.

## To Be Archived — 1 Year Retention

### Epics (N)
| Epic | Terminated | Age | Gravestone |
|------|-----------|-----|------------|
| <slug> | YYYY-MM-DD | NNN days | backlog/archive/<slug>.md |

### Requests (N)
| Request | Title | Terminated | Age | Gravestone |
|---------|-------|-----------|-----|------------|
| R-NNN | Title | YYYY-MM-DD | NNN days | requests/archive/R-NNN.md |

## To Be Archived — 90 Day Retention

### Members (N)
| Member | Terminated | Age | Gravestone |
|--------|-----------|-----|------------|

### Stakeholders (N)
| Stakeholder | Terminated | Age | Gravestone |
|-------------|-----------|-----|------------|

### Products (N)
| Product | State | Terminated | Age | Gravestone |
|---------|-------|-----------|-----|------------|

## To Be Deleted — 90 Day Retention

### Features (N)
| Feature | Parent Epic | Terminated | Age |
|---------|------------|-----------|-----|

### Work Items (N)
| Work Item | Parent Feature | Terminated | Age |
|-----------|---------------|-----------|-----|

### Tasks (N)
| Task | Parent Work Item | Terminated | Age |
|------|-----------------|-----------|-----|

### Standup Logs (N)
Files: team/standup/standup-log/ — N files, date range YYYY-MM-DD to YYYY-MM-DD

### Member Discuss-Logs (N)
| Member | Files | Oldest |
|--------|-------|--------|

### Retros (N)
| Retro | Closed | Age |
|-------|--------|-----|

### Inbox Items (N)
N files older than 90 days.

## Needs Attention
- `<path>` — Terminated: set to today (git date unavailable). Verify before next run.
- `<path>` — Status: Benched should be updated to Departed.
```

If there are no candidates in a section, omit that section from the report entirely.

---

## Step 5: Present Summary and Confirm

After writing the report, present a brief summary to the user:

```
Cleanup scan complete. Report written to output/cleanup-report.md.

  X epics eligible for archiving
  X requests eligible for archiving
  X members / stakeholders / products eligible for archiving
  X features, work items, and tasks eligible for deletion
  X standup/discuss logs eligible for deletion
  X retros eligible for deletion
  X inbox items eligible for deletion

  X entities had Terminated: backfilled (Y via git, Z set to today — see Needs Attention)

Review output/cleanup-report.md, then type "proceed" to execute cleanup, or "cancel" to abort.
```

Wait for the user's response. If they type anything other than "proceed", abort and inform them no changes were made.

---

## Step 6: Execute

### Archiving Epics

For each eligible epic:

1. Run `/rollup-backlog <slug> --deep` to produce a final rollup.
2. Build the gravestone file (see format below).
3. Write gravestone to `backlog/archive/<slug>.md`. Create the directory if needed.
4. Delete the epic's source directory: `backlog/epics/<slug>/` (including all descendant features, work items, and tasks).

**Epic gravestone format:**

```markdown
# [Epic Title] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Closed | Removed

## Properties
[Copy the full Properties block verbatim from the epic file]

## Summary
[Copy the epic's ## Description section content]

## Descendants
[Build from the final rollup — list all features, each indented with their work items and tasks:]
- Feature: <title> (<State>)
  - Work Item: <title> (<State>)
    - Task: <title> (<State>)
  - Work Item: <title> (<State>)

*Full history available via `git log -- backlog/epics/<slug>/`*
```

### Archiving Requests

For each eligible request:

1. Build the gravestone file.
2. Write to `requests/archive/R-NNN.md`. Create the directory if needed.
3. Delete the request's source directory: `requests/R-NNN/`.

**Request gravestone format:**

```markdown
# R-NNN: [Request Title] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Declined | Withdrawn | Complete

## Properties
[Copy the full Properties block verbatim from the request file]

## Summary
[Copy the request's ## Summary section content]

## Evaluation Outcome
[Copy the final evaluation section or outcome notes if present. Omit section if absent.]

*Full history available via `git log -- requests/R-NNN/`*
```

### Archiving Members

For each eligible member:

1. Build the gravestone.
2. Write to `team/archive/members/<slug>.md`. Create the directory if needed.
3. Delete the member's source directory: `team/members/<slug>/` (including discuss-log/).

**Member gravestone format:**

```markdown
# [Member Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
Status at archive: Departed

## Properties
Role: [value]
Team Function: [value]
Allocation: [value]
Email: [value]

## Summary
[Copy the ## Summary section content]

*Full history available via `git log -- team/members/<slug>/`*
```

### Archiving Stakeholders

For each eligible stakeholder:

1. Build the gravestone.
2. Write to `team/archive/stakeholders/<slug>.md`. Create the directory if needed.
3. Delete the stakeholder's source directory: `team/stakeholders/<slug>/`.

**Stakeholder gravestone format:**

```markdown
# [Stakeholder Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
Status at archive: Departed

## Properties
Role: [value]
Organization: [value]
Email: [value if present]

## Summary
[Copy the ## Summary section content]

*Full history available via `git log -- team/stakeholders/<slug>/`*
```

### Archiving Products

For each eligible product:

1. Build the gravestone.
2. Write to `products/archive/<slug>.md`. Create the directory if needed.
3. Delete the product's source directory: `products/<slug>/`.

**Product gravestone format:**

```markdown
# [Product Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Retired | Sunset

## Properties
Status: [value]
Owners: [value]
Repository: [value if present]

## Summary
[Copy the ## Description section content]

*Full history available via `git log -- products/<slug>/`*
```

### Deleting Features, Work Items, Tasks

Delete each eligible directory in full. No gravestone. Git history is sufficient.

### Deleting Log Files

Delete each eligible `standup-log/YYYY-MM-DD.md` and `discuss-log/YYYY-MM-DD.md` file individually.

### Deleting Retro Folders

Delete each eligible `team/retros/<retro-slug>/` directory in full.

### Deleting Inbox Items

Delete each eligible file in `backlog/inbox/`.

---

## Step 7: Final Report

Update `output/cleanup-report.md` — append a `## Actions Taken` section:

```markdown
## Actions Taken — YYYY-MM-DD HH:MM

### Archived
- backlog/archive/ehr-pipeline-modernization.md (was backlog/epics/ehr-pipeline-modernization/)
- requests/archive/R-042.md (was requests/R-042/)

### Deleted
- 12 standup log files (team/standup/standup-log/)
- 3 retro folders (team/retros/)
- 8 backlog entities (features, work items, tasks)

### Nothing eligible this run
[if applicable]
```

Then prompt the user:

> "Cleanup complete. output/cleanup-report.md updated with actions taken. Please review and commit when ready."

Do not commit automatically. The user commits.

---

## Notes

- The `output/` directory is gitignored in deployed instances. The report is ephemeral.
- Never touch: `CLAUDE.md`, `.claude/fabric-*.md`, `team/team.md`, `staging/`, `requests/workflow/`, `backlog/archive/`, `requests/archive/`, `team/archive/`, `products/archive/`, `output/`.
- `discuss-today.md`, `discuss-yesterday.md`, `standup-today.md`, `standup-yesterday.md` are managed by their modules — do not touch.
- If `output/` does not exist, create it. Do not create a `.gitignore` entry — it should already exist in a properly initialized instance.
```

- [ ] **Step 2: Verify the command file**

Read `Fabric/.claude/commands/clean-fabric.md` and confirm all seven steps are present and cover:
- Backfill sweep with git fallback and today's date fallback
- Retention rule loading including override lookup
- Candidate scan covering all 12 artifact types
- Report format with all sections
- Confirmation gate ("proceed" keyword)
- Gravestone format for all 5 archived artifact types
- Final report and user prompt to commit

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/clean-fabric.md
git commit -m "add clean-fabric command"
```

---

## Task 11: Update Example instance

**Files:**
- Modify: `Example/.claude/fabric-core.md`
- Modify: `Example/.claude/fabric-triage.md`
- Modify: `Example/.claude/fabric-backlog.md`
- Create: `Example/team/members/alex-rivera/profile.md`
- Modify: `Example/backlog/epics/ehr-pipeline-modernization/epic.md` (or whichever epic exists)
- Modify: `Example/requests/R-101/request.md`

- [ ] **Step 1: Propagate fabric-core.md to Example**

Copy `Fabric/template/fabric-core.md` to `Example/.claude/fabric-core.md`, replacing the existing file entirely.

- [ ] **Step 2: Propagate fabric-triage.md to Example**

Copy `Fabric/template/fabric-triage.md` to `Example/.claude/fabric-triage.md`, replacing the existing file entirely.

- [ ] **Step 3: Propagate fabric-backlog.md to Example**

Copy `Fabric/template/fabric-backlog.md` to `Example/.claude/fabric-backlog.md`, replacing the existing file entirely.

- [ ] **Step 4: Add a departed member to Example**

Create `Example/team/members/alex-rivera/profile.md`:

```markdown
# Alex Rivera

Role: Data Engineer
Team Function: Pipeline development and EHR data integration
Allocation: 0%
Status: Departed
Terminated: 2026-01-15

## Summary

Alex joined the team in mid-2025 to lead the initial FHIR R4 integration work. He departed in January 2026 to join a healthcare startup. His foundational work on the parser and schema registry underpins much of the current EHR pipeline.

## Responsibilities

- FHIR R4 pipeline development
- Schema registry management

## Expertise

- FHIR R4 resource modeling
- Apache Kafka consumer frameworks
- Healthcare interoperability standards

## Contact

Email: a.rivera@riverdale.org

## Context Log

- 2026-01-15 - Offboarding: Alex departed the team. Status set to Departed.
- 2025-09-01 - Onboarding: Joined as Data Engineer focused on FHIR R4 integration work.
```

- [ ] **Step 5: Add Terminated: to an existing terminal-state Example epic**

Read `Example/backlog/epics/ehr-pipeline-modernization/epic.md`. If its `State:` is `Closed` or `Removed` and it has no `Terminated:` field, add `Terminated: 2025-12-01` after the `State:` line to demonstrate the backfill scenario. If the epic is not in a terminal state, skip this step and note it.

- [ ] **Step 6: Add Terminated: to R-101 to demonstrate a completed request**

Read `Example/requests/R-101/request.md`. Add `Terminated: 2025-12-20` to the Properties block after `Status:` if it is in a terminal state. If R-101 is still active, skip this step.

- [ ] **Step 7: Verify Example instance**

Confirm:
- `Example/.claude/fabric-core.md` contains the `## Fabric GC` section
- `Example/team/members/alex-rivera/profile.md` exists with `Status: Departed` and a `Terminated:` date
- At least one entity in the instance has a `Terminated:` date to demonstrate the pattern

- [ ] **Step 8: Commit**

```bash
git add Example/.claude/fabric-core.md Example/.claude/fabric-triage.md Example/.claude/fabric-backlog.md
git add Example/team/members/alex-rivera/
git add Example/backlog/ Example/requests/
git commit -m "update Example instance: GC rules, departed member, Terminated: demo data"
```

---

## Self-Review Checklist

After completing all tasks, verify the following against the spec:

- [ ] `Terminated:` field present in all 7 entity templates
- [ ] `Departed` status in member and stakeholder templates (no remaining `Benched`)
- [ ] `entity-transitions` writes `Terminated:` in both Closed/Resolved and Removed paths, with "if not already set" guard
- [ ] `fabric-triage.md` writes `Terminated:` on all request terminal states
- [ ] `member depart` writes `Terminated:`; `member activate` clears it
- [ ] `fabric-core.md` documents the `## Fabric GC` override table with all 12 artifact keys
- [ ] `clean-fabric` command covers all 12 artifact types in the candidate scan
- [ ] Gravestone format defined for all 5 archived types (epic, request, member, stakeholder, product)
- [ ] Epic archiving runs `/rollup-backlog` before generating gravestone
- [ ] Confirmation gate requires user to type "proceed" before any files are touched
- [ ] Final step prompts user to commit rather than committing automatically
- [ ] Example instance has `## Fabric GC` section and at least one `Terminated:` date
