# Design: `/member` Command & Capacity Adjustments

**Date:** 2026-04-04  
**Status:** Approved  

---

## Overview

Introduce a `/member` parent command that consolidates all member lifecycle operations under a single namespace, and adds a new `timeoff` subcommand for recording temporary capacity adjustments. This replaces the existing flat commands `/add-member`, `/bench-member`, and `/activate-member`.

---

## Command Structure

A single `/member` command file covers all member operations. The three existing flat command files are deleted.

| Subcommand | Description |
|---|---|
| `/member add` | Guided creation of a new member profile |
| `/member bench` | Set a member's status to Benched, remove from capacity |
| `/member activate` | Restore a benched member to Active status |
| `/member timeoff` | Record a capacity adjustment (date range, reduced allocation, reason) |

`/member` with no subcommand prints a brief help listing the available subcommands.

`fabric-core.md`'s command table is updated to reference `/member` in place of the three retired commands.

---

## Profile Data Model

The member profile gains a `## Capacity Adjustments` section, inserted between the `Status` header field and `## Summary`.

```markdown
## Capacity Adjustments

<!-- Current and upcoming periods of reduced or zero capacity. Cleared by GC. -->
| Start | End | Capacity | Reason |
|-------|-----|----------|--------|
| 2026-04-07 | 2026-04-11 | 0% | PTO |
| 2026-04-14 | 2026-04-18 | 50% | Conference |
```

**Field semantics:**

- `Start` / `End` — inclusive date range in `YYYY-MM-DD` format.
- `Capacity` — the member's effective availability as a percentage of full FTE *during* the period. `0%` means fully out; `50%` means half an FTE available. This is an absolute value, not relative to their baseline `Allocation`.
- `Reason` — freeform, brief (e.g. PTO, Conference, Loaned to Platform team).

**Lifecycle:**

- The section is omitted entirely when there are no current or upcoming adjustments.
- Past adjustments are not retained in this section; they are captured passively in the context log.
- A future GC (garbage collection) command owned by team leads is responsible for culling expired rows.

**Context log entry format:**

```
- YYYY-MM-DD - /member timeoff [recorded by <Name> on behalf of <Name>]: <Reason> <start> to <end>, <capacity> capacity.
```

The "on behalf of" clause is included only when a lead recorded the adjustment for another member.

---

## `/member timeoff` Command Flow

### Authorization

- **Self-service:** No meta mode required when setting your own time off (resolved via git email).
- **Delegated:** Setting time off for another member requires meta mode. If not active, the command prompts the user to enter meta mode before proceeding.

### Collection

The command collects the following conversationally:

1. **Target member** — defaults to the current user; accepts a name argument for delegation.
2. **Start date** — required.
3. **End date** — required.
4. **Capacity during the period** — required. `0%` for fully out; a percentage for partial availability.
5. **Reason** — required, freeform, brief.

### Overlap Check

Before presenting the confirmation, scan the member's existing `## Capacity Adjustments` rows for date overlaps. If overlaps are found, surface them and ask whether to:

- **Replace** the overlapping row(s) with the new adjustment.
- **Add alongside** (useful when the periods are distinct enough in reason).

### Confirmation

Present a summary before writing:

> "Set Leo Kim to 0% from 2026-04-07 to 2026-04-11 (PTO). Append to context log. Proceed?"

Write only after the user confirms.

### Writes

1. Add a row to `## Capacity Adjustments` in the member's profile (create the section if absent).
2. Append a context log entry with date, capacity, reason, and recorder attribution if delegated.

---

## Capacity Surface Points

Capacity adjustments are evaluated at query time — they are not written back to `team.md`. The `Total Effective Capacity` in `team.md` reflects baseline allocation only.

### `/status`

Active and upcoming adjustments are shown inline per member:

```
Leo Kim — 100% (out 2026-04-07 to 2026-04-11)
Dana Torres — 100% (50% 2026-04-14 to 2026-04-18, conference)
```

### Standup Summary (`standup-report` skill)

The team summary opens with a brief capacity note when anyone is out or reduced today:

> "Matt is out today. Dana is at 50% (conference) through Friday."

The note is omitted when all members are at full capacity.

### Staffing Suggestions

When the AI recommends assignment or assesses available capacity:

- Members at `0%` today are excluded from suggestions.
- Members at partial capacity are flagged with their effective availability (e.g. "Dana Torres — 50% available this week").
- Upcoming adjustments within the planning window are noted as context.

---

## Member Profile Template Update

The `Fabric/team/members/template/profile.md` template is updated to include the `## Capacity Adjustments` section (empty, with comment) so new profiles generated by `/member add` include the section from the start.

---

## Files Changed

| File | Action |
|---|---|
| `Fabric/.claude/commands/member.md` | Create — new unified command file |
| `Fabric/.claude/commands/add-member.md` | Delete |
| `Fabric/.claude/commands/bench-member.md` | Delete |
| `Fabric/.claude/commands/activate-member.md` | Delete |
| `Fabric/template/fabric-core.md` | Update command table |
| `Fabric/team/members/template/profile.md` | Add `## Capacity Adjustments` section |
| `Example/.claude/fabric-core.md` | Update command table (deployed instance copy) |
| `Example/team/members/*/profile.md` | Add `## Capacity Adjustments` section to each |
