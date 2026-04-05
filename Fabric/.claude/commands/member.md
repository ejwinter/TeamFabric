# /member - Member Management

## Purpose
Unified member lifecycle and capacity management.

## Usage

```
/member <subcommand> [args]
```

With no subcommand, list the available subcommands and one-line descriptions.

## Subcommands

| Subcommand | Description |
|---|---|
| add | Guided creation of a new member profile |
| depart [name] | Set a member's status to Departed |
| activate [name] | Restore a departed member to Active |
| timeoff [name] | Record a capacity adjustment |

---

## /member add

### Purpose
Guided creation of a new member profile.

### Prerequisites
- Meta mode must be active. If not, prompt the user to enter meta mode first.

### Behavior

1. Collect member information:
   - Name
   - Role / title
   - Team function (one-line summary of what they do for this team)
   - Allocation (% of 1 FTE dedicated to this team)
   - Email (must match their `git config user.email` for identity resolution)
   - Responsibilities (list)
   - Expertise / specialties (list)

2. Generate the profile:
   - Create directory: team/members/<name-slug>/
   - Create profile.md with Status: Active and an empty `## Capacity Adjustments` section

3. Update team/team.md:
   - Add row to Members table
   - Recalculate Total Effective Capacity

4. Present changes for confirmation before writing.

### Template
Use team/members/template/profile.md as the starting point for new profiles. The template directory is not a real member and should be excluded from member scans, capacity calculations, and identity resolution.

### Slug Convention
Member directory names use lowercase hyphenated full names: `jag-balan`, `eric-winter`.

### Valid Status Values
- Active: contributing member, included in capacity calculations
- Departed: inactive but preserved, excluded from capacity calculations
- Onboarding: new member in setup, included in capacity at stated allocation

---

## /member depart

### Purpose
Set a member's status to Departed. The profile and all context log references are preserved. The member is removed from active capacity calculations and staffing suggestions.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a member name (fuzzy match against existing profiles).

2. Confirm the action: "Mark [name] as Departed? They will be excluded from capacity calculations and staffing suggestions. Their profile and all context references will be preserved."

3. Update the member's profile:
   - Set Status: Departed
   - Also write `Terminated: <today's date>` to the Properties block.
   - Append to their context log: "[date] - Status changed to Departed. [reason if provided]"

4. Update team/team.md:
   - Mark the member's row or move to a Departed section
   - Recalculate Total Effective Capacity

5. Present changes for confirmation before writing.

### Notes
- Departure is reversible via `/member activate`.
- The AI should never suggest removing or deleting a member. `/member depart` is the correct action.
- Context log entries that reference a departed member remain valid and unchanged.

---

## /member activate

### Purpose
Restore a departed member to Active status.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a member name (fuzzy match, filtered to Departed members).
   - If no departed members exist, inform the user.

2. Optionally update allocation if it has changed since departure.

3. Update the member's profile:
   - Set Status: Active
   - Remove the `Terminated:` line entirely from the Properties block.
   - Update Allocation if changed
   - Append to context log: "[date] - Status changed to Active. [allocation note if changed]"

4. Update team/team.md:
   - Restore the member's row to the active members table
   - Recalculate Total Effective Capacity

5. Present changes for confirmation before writing.

---

## /member timeoff

### Purpose
Record a temporary capacity adjustment for a member — full time off or a period of reduced availability.

### Prerequisites
- No meta mode required when recording your own time off (resolved via `git config user.email`).
- Meta mode required when recording on behalf of another member. Prompt to enter meta mode if not already active.

### Behavior

1. **Identify target member:**
   - If no name argument is given, resolve the current user via `git config user.email`.
   - If a name argument is given and does not match the current user, require meta mode before proceeding.

2. **Collect adjustment details** (conversationally):
   - Start date (YYYY-MM-DD)
   - End date (YYYY-MM-DD)
   - Capacity during the period — `0%` for fully out, or a percentage for partial availability. This is an absolute FTE percentage, not relative to the member's baseline Allocation.
   - Reason (freeform, brief — e.g. PTO, Conference, Loaned to Platform team)

3. **Overlap check:** Before presenting the confirmation, scan the member's existing `## Capacity Adjustments` rows for date overlaps with the new period. If overlaps are found, surface them and ask whether to:
   - **Replace** the overlapping row(s) with the new adjustment.
   - **Add alongside** the existing rows.

4. **Confirm before writing:**
   > "Set [Name] to [X]% from [start] to [end] ([reason]). Append to context log. Proceed?"

5. **Write changes:**
   - Add a row to `## Capacity Adjustments` in the member's profile. If the section does not exist, create it before `## Summary`.
   - Append to the member's context log:
     - Self-recorded: `- YYYY-MM-DD - /member timeoff: [Reason] [start] to [end], [X]% capacity.`
     - Delegated: `- YYYY-MM-DD - /member timeoff (recorded by [Recorder Name] on behalf of [Member Name]): [Reason] [start] to [end], [X]% capacity.`

### Capacity Adjustments Section Format

```markdown
## Capacity Adjustments

<!-- Current and upcoming periods of reduced or zero capacity. Cleared by GC. -->
| Start | End | Capacity | Reason |
|-------|-----|----------|--------|
| 2026-04-07 | 2026-04-11 | 0% | PTO |
```

When no adjustments are present, omit the section entirely from the profile.

### Surfacing Capacity Adjustments

Commands that assess member availability must check each active member's `## Capacity Adjustments` for rows that overlap the relevant date or planning window:

- **`/status`** — show inline per member when an adjustment is active or upcoming:
  `Leo Kim — 100% (out 2026-04-07 to 2026-04-11)`
  `Dana Torres — 100% (50% 2026-04-14 to 2026-04-18, conference)`

- **Standup summary (`standup-report` skill)** — open the team summary with a brief capacity note when anyone is out or reduced today:
  > "Leo is out today. Dana is at 50% (conference) through Friday."
  Omit this note entirely when all members are at full capacity.

- **Staffing suggestions** — exclude members at `0%` today from assignment suggestions. Flag partially-reduced members with their effective capacity. Note upcoming adjustments within the planning window as context.

The `Total Effective Capacity` in `team.md` reflects baseline allocation only. It is not modified when capacity adjustments are recorded.
