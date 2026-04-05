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
- Epic, Feature, Work Item, Task: `State: Closed` or `State: Removed`
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

Identify all artifacts past their retention threshold.

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
[Build from the final rollup — list all features with their work items and tasks:]
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
[include this line only if no action was taken]
```

Then prompt the user:

> "Cleanup complete. output/cleanup-report.md updated with actions taken. Please review and commit when ready."

Do not commit automatically. The user commits.

---

## Notes

- The `output/` directory is gitignored in deployed instances. The report is ephemeral.
- Never touch: `CLAUDE.md`, `.claude/fabric-*.md`, `team/team.md`, `staging/`, `requests/workflow/`, `backlog/archive/`, `requests/archive/`, `team/archive/`, `products/archive/`, `output/`.
- `discuss-today.md`, `discuss-yesterday.md`, `standup-today.md`, `standup-yesterday.md` are managed by their modules — do not touch.
- If `output/` does not exist, create it. Do not create a `.gitignore` entry — that should already exist in a properly initialized instance.
