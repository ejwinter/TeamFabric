# /check — Instance Health Lint

## Purpose

Scan this Fabric instance for coherence problems. Catches active drift and integrity violations in the living instance — what slipped through cascades, direct file edits, or schema drift.

`/clean-fabric` removes the dead. `/check` keeps the living honest.

---

## Usage

```
/check
/check --fix
/check [entity]
/check --fix [entity]
```

| Form | Behavior |
|---|---|
| `/check` | Scan and report all findings |
| `/check --fix` | Interactive resolution session — propose a fix per finding, confirm or skip |
| `/check [entity]` | Scope scan to one entity (by ID, slug, or title fragment) or subtree |
| `/check --fix [entity]` | Same scope, with interactive resolution |

---

## Step 1: Determine Scope

If an `[entity]` argument is given, locate the entity file (same resolution rules as `/transition`). If the argument is ambiguous, list candidates and ask the user to confirm. Scoped mode runs all applicable checks against that entity and its descendants only.

If no entity argument is given, scan the full instance.

---

## Step 2: Run Checks

Work through each check category. Collect every finding — do not stop at the first. For each finding record:

- **Location** — file path (and the specific field or section)
- **Check name** — the short label from the table below
- **Finding** — one-sentence description of the violation
- **Suggested fix** — a concrete, actionable correction (omit if no safe fix is deterministic)

### Check Catalog

#### Backlog Entity Checks

| Check | Condition |
|---|---|
| `terminal-no-date` | Entity has a terminal `State:` (`Closed`, `Removed`) but no `Terminated:` field |
| `blocked-no-entry` | `Blocked: Yes` in Properties but no `## Blockers` section, or no blocker entry with `Status: Active` |
| `entry-no-blocked` | `## Blockers` section exists with at least one `Status: Active` entry but `Blocked: Yes` is absent from Properties |
| `unchecked-criteria` | Work item or feature has `State: Closed` but `## Acceptance Criteria` contains unchecked items (`- [ ]`) |
| `orphaned-task` | Task file exists under a workitem directory that no longer exists |
| `orphaned-feature` | Feature file exists under an epic directory that no longer exists |
| `invalid-label` | Entity has a `Labels:` field with a key=value pair not present in the team's label schema (only flagged when a `### Labels` schema is defined in CLAUDE.md) |
| `invalid-iteration` | Entity has an `Iteration:` field whose value does not match the current or any valid derived iteration name (only flagged when `### Iterations` config is present in CLAUDE.md) |
| `departed-owner` | `Owners:` or `Assigned to:` field references a member whose profile has `Status: Departed` |

#### Backlog Structural Checks

| Check | Condition |
|---|---|
| `feature-missing-product` | Feature has a `Product:` field referencing a product that has no directory under `products/` |

#### Team Checks

| Check | Condition |
|---|---|
| `member-no-profile` | Member listed in `team.md` member table has no matching directory under `team/members/` |
| `profile-not-in-team` | Directory exists under `team/members/` (excluding `template/`) with no corresponding row in `team.md` |
| `team-member-drift` | A member appears in both `team.md` and as a profile directory, but the `Role:` or `Allocation:` field differs between them |
| `benched-member` | Member profile has `Status: Benched` (deprecated — should be updated to `Departed`) |
| `capacity-overload` | Member's `Allocation:` percentage is less than the sum of active assignments. Active assignments = work items or tasks with `Assigned to: [member]` and `State: Active`. Flag when assignment count × assumed per-item allocation exceeds member capacity. (If no per-item effort estimates are available, flag members with > 5 active assignments at ≤50% allocation or > 10 at 100% — note that these are heuristic thresholds.) |

#### Request Checks

| Check | Condition |
|---|---|
| `request-terminal-no-date` | Request has a terminal `Status:` (`Declined`, `Withdrawn`, `Complete`, or team-defined terminal) but no `Terminated:` field |
| `request-departed-owner` | Request `Owners:` or contact field references a departed member |

---

## Step 3: Write Report

Write findings to `output/check-report.md`. Create the `output/` directory if it doesn't exist.

```markdown
# Fabric Health Report — YYYY-MM-DD

## Summary
N findings across N check categories.
[If scope was limited:] Scoped to: [entity slug or path]

## Findings

### Backlog Entities (N)

| # | Check | Entity | Location | Finding |
|---|-------|--------|----------|---------|
| 1 | `terminal-no-date` | auth-rbac | backlog/epics/auth-rbac/epic.md | State: Closed but no Terminated: field |
| 2 | `blocked-no-entry` | user-import-260315 | backlog/.../workitem.md | Blocked: Yes with no active ## Blockers entry |
| … | | | | |

### Backlog Structure (N)

| # | Check | Entity | Location | Finding |
|---|-------|--------|----------|---------|

### Team (N)

| # | Check | Entity | Location | Finding |
|---|-------|--------|----------|---------|

### Requests (N)

| # | Check | Entity | Location | Finding |
|---|-------|--------|----------|---------|

## No Findings
[Include this section only if the scan produced zero findings:]
No integrity violations found.
```

Omit any section with zero findings except for the summary. If there are zero total findings, output a single "No Findings" section.

---

## Step 4: Present Summary

After writing the report, show a brief summary to the user:

```
Health scan complete. Report written to output/check-report.md.

  N backlog entity findings
  N backlog structure findings
  N team findings
  N request findings

  N total findings
```

If running in `--fix` mode, continue to Step 5. Otherwise stop here.

---

## Step 5: Interactive Resolution (--fix mode only)

Work through each finding sequentially. For each:

1. Display the finding:

   ```
   Finding [#/total]: `<check-name>` — <entity>
   <one-sentence description>
   Location: <file path>

   Proposed fix: <specific change to make>

   Apply fix? [yes / skip / stop]
   ```

2. Wait for the user's response:
   - `yes` — apply the fix, write the file, proceed to next finding
   - `skip` — leave unchanged, proceed to next finding
   - `stop` — halt the session immediately, report how many were resolved vs skipped

3. After all findings are processed (or stopped), report:

   ```
   Resolution complete.
     Applied: N
     Skipped: N
     Remaining: N
   output/check-report.md updated.
   ```

4. Update `output/check-report.md` — append a `## Resolution` section:

   ```markdown
   ## Resolution — YYYY-MM-DD HH:MM
   Applied: N  |  Skipped: N  |  Remaining: N

   ### Applied
   - [#1] `terminal-no-date` — auth-rbac: added Terminated: 2026-03-12

   ### Skipped
   - [#3] `capacity-overload` — alice: left for manual review
   ```

### Fix Heuristics by Check

| Check | Safe auto-fix | Approach |
|---|---|---|
| `terminal-no-date` | Yes | Run `git log --follow -1 --format="%as"` on the file; write `Terminated: <date>` (or today if git returns nothing) |
| `request-terminal-no-date` | Yes | Same as above |
| `blocked-no-entry` | Yes | Remove `Blocked: Yes` from Properties (no active blocker entry means the flag is stale) |
| `entry-no-blocked` | Yes | Add `Blocked: Yes` to Properties |
| `departed-owner` | Propose | Show the departed member name; ask who should replace them or propose clearing the field |
| `request-departed-owner` | Propose | Same as above |
| `benched-member` | Propose | Propose changing `Status: Benched` to `Status: Departed` |
| `team-member-drift` | Propose | Show the differing values; ask which is authoritative (profile or team.md) |
| `unchecked-criteria` | No fix | Report only — resolution requires human judgment |
| `orphaned-task` | No fix | Report only — file may be legitimate or a mistake; user decides |
| `orphaned-feature` | No fix | Report only — same |
| `feature-missing-product` | No fix | Report only — product may need to be created or the reference corrected |
| `member-no-profile` | No fix | Report only — may indicate a profile that needs to be created |
| `profile-not-in-team` | No fix | Report only — may indicate a stale directory or a missing team.md row |
| `invalid-label` | Propose | Show the unrecognized value; offer to remove it or suggest the closest valid label |
| `invalid-iteration` | Propose | Show the value and the current valid iteration name; offer to update |
| `capacity-overload` | No fix | Report only — heuristic threshold; requires human triage |

---

## Notes

- Read-only until a fix is confirmed. No meta mode required.
- The `output/` directory is gitignored in deployed instances. The report is ephemeral.
- `/check` catches what slipped through write-time cascade checks (`/transition`, `/member depart`). It is not a substitute for those — if cascades are running correctly, `/check` should find little.
- Scoped mode (`/check [entity]`) runs only the checks applicable to that entity type and its descendants. Team checks and full structural checks are skipped in scoped mode unless the entity is `team` or `requests`.
- Do not auto-commit. The user commits.
