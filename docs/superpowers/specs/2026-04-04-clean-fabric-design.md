# clean-fabric — Design Spec

**Date:** 2026-04-04  
**Status:** Approved

## Overview

`/clean-fabric` is a flat slash command that scans a Fabric instance for stale and terminal-state artifacts, produces a browsable report, and waits for user confirmation before making any changes. Git history is the safety net — the command never acts without review.

The command also performs a `Terminated:` date backfill sweep across all terminal-state entities, regardless of cleanup eligibility. This ensures future runs always have a reliable date to work from.

---

## Schema Changes

These changes are shipped to entity templates via `/update-fabric` and applied to the `Fabric/backlog/`, `Fabric/team/`, `Fabric/requests/`, and `Fabric/products/` template files.

### `Terminated: YYYY-MM-DD`

A new property field added to the Properties block of:

| Template | Terminal States |
|---|---|
| `template-epic.md` | `Closed`, `Removed` |
| `template-feature.md` | `Closed`, `Removed` |
| `template-workitem.md` | `Closed`, `Removed` |
| `template-task.md` | `Closed`, `Removed` |
| `template-inbox-item.md` | N/A — age-based only |
| Request (`request.md`) | `Declined`, `Withdrawn`, `Complete` |
| Product (`product.md`) | `Retired`, `Sunset` |
| Member profile (`profile.md`) | `Departed` |
| Stakeholder profile (`profile.md`) | `Departed` — also requires adding `Status:` and `Terminated:` fields to the stakeholder template |

### `Departed` replaces `Benched`

The member profile `Status` field changes from `Active | Benched | Onboarding` to `Active | Departed | Onboarding`. `Departed` covers both permanent departure and temporary leave — the member could return. During the backfill sweep, any profile with `Status: Benched` is flagged in the report as needing manual update to `Departed`.

---

## Terminated: Backfill Sweep

Before evaluating cleanup eligibility, `clean-fabric` scans **all** terminal-state entities in the instance — not just those old enough for cleanup.

For each terminal-state entity missing a `Terminated:` field:

1. Run `git log --follow -1 --format="%as"` on the entity file to find the last commit date.
2. If git returns a clean date, write `Terminated: <git-date>`.
3. If git cannot determine a date (untracked, ambiguous), write `Terminated: <today>` and mark the entity in the report under "Needs Attention."

This sweep runs every time `clean-fabric` is invoked, ensuring the field is always present for future runs. The report summarizes how many entities were backfilled and which date source was used.

---

## Retention Rules

Default retention is 90 days after `Terminated:` for most artifacts, and 1 year for epics and requests. Teams may override defaults in their constitution (see Configuration).

| Artifact | Terminal States | Default Retention | Action |
|---|---|---|---|
| Epic | `Closed`, `Removed` | 1 year | Archive → gravestone |
| Request | `Declined`, `Withdrawn`, `Complete` | 1 year | Archive → gravestone |
| Feature | `Closed`, `Removed` | 90 days | Delete |
| Work Item | `Closed`, `Removed` | 90 days | Delete |
| Task | `Closed`, `Removed` | 90 days | Delete |
| Inbox Item | Any age (no state) | 90 days from file mtime | Delete |
| Standup log | Date in filename | 90 days | Delete |
| Member discuss-log | Date in filename | 90 days | Delete |
| Retro folder | `Status: Closed` + `Closed:` date | 90 days | Delete |
| Member profile | `Status: Departed` + `Terminated:` | 90 days | Archive → gravestone |
| Stakeholder profile | `Status: Departed` + `Terminated:` | 90 days | Archive → gravestone |
| Product | `Retired`, `Sunset` | 90 days | Archive → gravestone |

Deletion removes the entity file or directory entirely. Archive creates a gravestone file and removes the original. Git history remains intact in both cases.

---

## Gravestone Files

Epics and requests are archived rather than deleted. A gravestone is a single markdown file capturing the entity's final state.

### Epic Gravestone — `backlog/archive/<slug>.md`

Before archiving, a final `/rollup-backlog` is run so the gravestone reflects the latest rolled-up state.

```markdown
# [Epic Title] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Closed | Removed

## Properties
[Final properties block, copied verbatim]

## Summary
[Epic description]

## Descendants
- Feature: <slug> (State)
  - Work Item: <slug> (State)
    - Task: <slug> (State)
  - Work Item: <slug> (State)
- Feature: <slug> (State)
  ...

*Full history available via `git log -- backlog/epics/<slug>/`*
```

### Member Gravestone — `team/archive/members/<slug>.md`

```markdown
# [Member Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
Status at archive: Departed

## Properties
[Role, Team Function, Allocation, Email — copied verbatim]

## Summary
[Member summary]

*Full history available via `git log -- team/members/<slug>/`*
```

### Stakeholder Gravestone — `team/archive/stakeholders/<slug>.md`

```markdown
# [Stakeholder Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
Status at archive: Departed

## Summary
[Stakeholder summary]

*Full history available via `git log -- team/stakeholders/<slug>/`*
```

### Product Gravestone — `products/archive/<slug>.md`

```markdown
# [Product Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Retired | Sunset

## Properties
[Status, Owners, Repository — copied verbatim]

## Summary
[Product description]

*Full history available via `git log -- products/<slug>/`*
```

### Request Gravestone — `requests/archive/R-NNN.md`

```markdown
# R-NNN: [Request Title] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
State at archive: Declined | Withdrawn | Complete

## Properties
[Final properties block, copied verbatim]

## Summary
[Request summary]

## Evaluation Outcome
[Final evaluation section or outcome notes, if present]

*Full history available via `git log -- requests/R-NNN/`*
```

---

## Command Flow

1. **Backfill sweep** — scan all terminal-state entities; write missing `Terminated:` fields; note any that needed today's date fallback.
2. **Candidate scan** — identify all entities past their retention threshold.
3. **Write report** — save to `output/cleanup-report.md`.
4. **Present summary** — show counts by artifact type and proposed actions.
5. **Confirm** — ask "Proceed with cleanup?" before touching anything.
6. **Execute** — for each eligible epic: run rollup, write gravestone, delete source tree. For each eligible request, product, member, or stakeholder: write gravestone, delete source directory. For all other artifacts: delete file or directory.
7. **Final report** — update `output/cleanup-report.md` with what was actually done. Prompt the user to commit the changes.

---

## Report Format — `output/cleanup-report.md`

```markdown
# Fabric Cleanup Report — YYYY-MM-DD

## Terminated: Backfill
Scanned N terminal-state entities.
Backfilled Terminated: on N entities (git date: N, today's date: N).

## Summary
N items eligible for cleanup across N artifact types.

## To Be Archived (1 year retention)

### Epics (N)
| Epic | Terminated | Age | Gravestone |
|------|-----------|-----|------------|
| ehr-pipeline-modernization | 2025-01-10 | 449 days | backlog/archive/ehr-pipeline-modernization.md |

### Requests (N)
| Request | Title | Terminated | Age | Gravestone |
|---------|-------|-----------|-----|------------|
| R-042 | Sepsis Prediction Model | 2025-01-03 | 456 days | requests/archive/R-042.md |

## To Be Archived (90 day retention)

### Members (N)
| Member | Terminated | Age | Gravestone |
|--------|-----------|-----|------------|

### Stakeholders (N)
| Stakeholder | Terminated | Age | Gravestone |
|-------------|-----------|-----|------------|

### Products (N)
| Product | State | Terminated | Age | Gravestone |
|---------|-------|-----------|-----|------------|

## To Be Deleted (90 day retention)

### Features (N)
| Feature | Parent Epic | Terminated | Age |
|---------|------------|-----------|-----|

### Work Items (N)
...

### Tasks (N)
...

### Standup Logs (N)
Files: team/standup/standup-log/YYYY-MM-DD.md (N files, oldest: YYYY-MM-DD)

### Member Discuss-Logs (N)
Members affected: Dana Torres (N files), Leo Kim (N files)

### Retros (N)
| Retro | Closed | Age |
|-------|--------|-----|

### Inbox Items (N)
Files older than 90 days: N

## Needs Attention
- `backlog/epics/xyz/epic.md` — State is Closed but Terminated: set to today (git date unavailable). Verify before next run.
- `team/members/alex-smith/profile.md` — Status: Benched should be updated to Departed.
```

---

## Configuration

Teams configure retention overrides in their `CLAUDE.md` or `team/team.md` under a `## Fabric GC` section:

```markdown
## Fabric GC

| Artifact | Retention |
|----------|-----------|
| standup-log | 180 days |
| retro | 1 year |
```

When a team member asks "how do I change retention for standup logs?", the agent explains the `## Fabric GC` table and points to where it lives in the team's constitution.

---

## Out of Scope

- Staging files — no defined lifecycle; teams manage manually.
- Stakeholder profiles — included in GC when `Status: Departed` is set; `Departed` status and `Terminated:` field need to be added to the stakeholder profile template.
- `discuss-today.md` / `discuss-yesterday.md` / `standup-today.md` / `standup-yesterday.md` — transient working files managed by their respective modules, not by `clean-fabric`.
- Automated scheduling — `clean-fabric` is always run manually and always requires confirmation.
