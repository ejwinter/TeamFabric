# `/member` Command & Capacity Adjustments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate member lifecycle commands under a single `/member` parent and add a `timeoff` subcommand for recording temporary capacity adjustments.

**Architecture:** Replace three flat command files (`add-member.md`, `bench-member.md`, `activate-member.md`) with a single `member.md` covering all subcommands. Add a `## Capacity Adjustments` table to the member profile template and all existing Example profiles. Update the command tables in both `fabric-core.md` files. No new runtime logic — this is a behavioral rules change in markdown.

**Tech Stack:** Markdown, git

---

## File Map

| File | Action | Notes |
|------|--------|-------|
| `Fabric/.claude/commands/member.md` | Create | New unified command — all subcommands here |
| `Fabric/.claude/commands/add-member.md` | Delete | Replaced by `/member add` |
| `Fabric/.claude/commands/bench-member.md` | Delete | Replaced by `/member bench` |
| `Fabric/.claude/commands/activate-member.md` | Delete | Replaced by `/member activate` |
| `Fabric/template/fabric-core.md` | Modify | Update command table |
| `Fabric/team/members/template/profile.md` | Modify | Add `## Capacity Adjustments` section |
| `Example/.claude/fabric-core.md` | Modify | Update command table (deployed copy) |
| `Example/team/members/dana-torres/profile.md` | Modify | Add `## Capacity Adjustments` section |
| `Example/team/members/leo-kim/profile.md` | Modify | Add `## Capacity Adjustments` section |
| `Example/team/members/marcus-chen/profile.md` | Modify | Add `## Capacity Adjustments` section |
| `Example/team/members/priya-patel/profile.md` | Modify | Add `## Capacity Adjustments` section |
| `Fabric/.claude/commands/status.md` | Modify | Show capacity adjustments inline per member |
| `Fabric/.claude/skills/standup-report.md` | Modify | Add capacity note to team summary |

---

## Task 1: Create `Fabric/.claude/commands/member.md`

**Files:**
- Create: `Fabric/.claude/commands/member.md`

- [ ] **Step 1: Write the file**

Create `Fabric/.claude/commands/member.md` with the following content:

```markdown
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
| bench [name] | Set a member's status to Benched |
| activate [name] | Restore a benched member to Active |
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
- Benched: inactive but preserved, excluded from capacity calculations
- Onboarding: new member in setup, included in capacity at stated allocation

---

## /member bench

### Purpose
Set a member's status to Benched. The profile and all context log references are preserved. The member is removed from active capacity calculations and staffing suggestions.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a member name (fuzzy match against existing profiles).

2. Confirm the action: "Bench [name]? They will be excluded from capacity calculations and staffing suggestions. Their profile and all context references will be preserved."

3. Update the member's profile:
   - Set Status: Benched
   - Append to their context log: "[date] - Status changed to Benched. [reason if provided]"

4. Update team/team.md:
   - Mark the member's row or move to a Benched section
   - Recalculate Total Effective Capacity

5. Present changes for confirmation before writing.

### Notes
- Benching is reversible via `/member activate`.
- The AI should never suggest removing or deleting a member. Benching is the correct action.
- Context log entries that reference a benched member remain valid and unchanged.

---

## /member activate

### Purpose
Restore a benched member to Active status.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a member name (fuzzy match, filtered to Benched members).
   - If no benched members exist, inform the user.

2. Optionally update allocation if it has changed since benching.

3. Update the member's profile:
   - Set Status: Active
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
```

- [ ] **Step 2: Verify the file exists and looks correct**

Read `Fabric/.claude/commands/member.md` and confirm:
- All four subcommands are present (`add`, `bench`, `activate`, `timeoff`)
- `timeoff` section includes authorization, overlap check, confirmation, writes, and surfacing rules
- No placeholder text or TBDs

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/member.md
git commit -m "add /member unified command with timeoff subcommand"
```

---

## Task 2: Delete the three flat command files

**Files:**
- Delete: `Fabric/.claude/commands/add-member.md`
- Delete: `Fabric/.claude/commands/bench-member.md`
- Delete: `Fabric/.claude/commands/activate-member.md`

- [ ] **Step 1: Delete the files**

```bash
rm Fabric/.claude/commands/add-member.md
rm Fabric/.claude/commands/bench-member.md
rm Fabric/.claude/commands/activate-member.md
```

- [ ] **Step 2: Verify they are gone**

```bash
ls Fabric/.claude/commands/
```

Expected: `add-member.md`, `bench-member.md`, `activate-member.md` are absent. `member.md` is present.

- [ ] **Step 3: Commit**

```bash
git add -A Fabric/.claude/commands/
git commit -m "remove flat member commands replaced by /member"
```

---

## Task 3: Update command tables in both `fabric-core.md` files

**Files:**
- Modify: `Fabric/template/fabric-core.md` (lines 153–157)
- Modify: `Example/.claude/fabric-core.md` (same section)

- [ ] **Step 1: Update `Fabric/template/fabric-core.md`**

Replace these three rows in the `## Core Commands` table:

```markdown
| /add-member | Guided creation of a new member profile. Requires meta mode. |
| /bench-member | Set a member's status to Benched. Preserves profile and context log references but removes from active capacity. Requires meta mode. |
| /activate-member | Restore a benched member to Active status. Requires meta mode. |
```

With this single row:

```markdown
| /member | Member lifecycle and capacity management. Subcommands: `add` (requires meta mode), `bench` (requires meta mode), `activate` (requires meta mode), `timeoff` (meta mode required only when recording for another member). |
```

- [ ] **Step 2: Update `Example/.claude/fabric-core.md`**

Apply the identical replacement to `Example/.claude/fabric-core.md`.

- [ ] **Step 3: Verify both files**

Read the `## Core Commands` table in each file and confirm:
- No mention of `/add-member`, `/bench-member`, or `/activate-member`
- `/member` row is present with subcommand descriptions

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-core.md Example/.claude/fabric-core.md
git commit -m "update fabric-core command table to reference /member"
```

---

## Task 4: Add `## Capacity Adjustments` section to the member profile template

**Files:**
- Modify: `Fabric/team/members/template/profile.md`

- [ ] **Step 1: Update the template**

The current template has this structure after the header fields:

```markdown
Status: [Active | Benched | Onboarding]

## Summary
```

Insert the `## Capacity Adjustments` section between `Status:` and `## Summary`:

```markdown
Status: [Active | Benched | Onboarding]

## Capacity Adjustments

<!-- Current and upcoming periods of reduced or zero capacity. Cleared by GC. -->
<!-- Omit this section entirely when no adjustments are present. -->

## Summary
```

- [ ] **Step 2: Verify**

Read `Fabric/team/members/template/profile.md` and confirm:
- `## Capacity Adjustments` appears between `Status:` and `## Summary`
- The comment explains the omit-when-empty rule
- No table rows are present (it's a template — the section is empty by default)

- [ ] **Step 3: Commit**

```bash
git add Fabric/team/members/template/profile.md
git commit -m "add Capacity Adjustments section to member profile template"
```

---

## Task 5: Add `## Capacity Adjustments` section to all four Example member profiles

**Files:**
- Modify: `Example/team/members/dana-torres/profile.md`
- Modify: `Example/team/members/leo-kim/profile.md`
- Modify: `Example/team/members/marcus-chen/profile.md`
- Modify: `Example/team/members/priya-patel/profile.md`

All four profiles currently have `Status: Active` followed by a blank line then `## Summary`. The same insertion applies to each.

- [ ] **Step 1: Update `dana-torres/profile.md`**

After:
```markdown
Status: Active
```

Insert:
```markdown

## Capacity Adjustments

<!-- Current and upcoming periods of reduced or zero capacity. Cleared by GC. -->
<!-- Omit this section entirely when no adjustments are present. -->
```

So `## Summary` immediately follows the comment.

- [ ] **Step 2: Update `leo-kim/profile.md`**

Apply the identical insertion after `Status: Active`.

- [ ] **Step 3: Update `marcus-chen/profile.md`**

Apply the identical insertion after `Status: Active`.

- [ ] **Step 4: Update `priya-patel/profile.md`**

Apply the identical insertion after `Status: Active`.

- [ ] **Step 5: Verify all four profiles**

Read each profile and confirm:
- `## Capacity Adjustments` appears between `Status:` and `## Summary`
- The comment block is present
- No table rows exist (no active adjustments for any member)

- [ ] **Step 6: Commit**

```bash
git add Example/team/members/
git commit -m "add Capacity Adjustments section to Example member profiles"
```

---

## Task 6: Update `/status` to surface capacity adjustments

**Files:**
- Modify: `Fabric/.claude/commands/status.md`

- [ ] **Step 1: Update the output format in `status.md`**

The current output template has:

```markdown
Active Members:
  [name] - [role] - [allocation]%
  ...
```

Replace it with:

```markdown
Active Members:
  [name] - [role] - [allocation]%
  [name] - [role] - [allocation]% (out YYYY-MM-DD to YYYY-MM-DD)
  [name] - [role] - [allocation]% ([X]% YYYY-MM-DD to YYYY-MM-DD, [reason])
  ...
```

Also add a note to the behavior section. After step 1 ("Load:"), update the bullet that reads `Active member profiles (status, allocation)` to:

```markdown
- Active member profiles (status, allocation, and `## Capacity Adjustments` for current or upcoming periods)
```

And add to the `## Notes` section:

```markdown
- When displaying active members, check each member's `## Capacity Adjustments` for rows whose date range includes today or falls within the next 14 days. Show the adjustment inline in the member line. A member fully out today is noted as `(out [start] to [end])`; a member at reduced capacity is noted as `([X]% [start] to [end], [reason])`. Members with no current or upcoming adjustments show baseline allocation only.
```

- [ ] **Step 2: Verify**

Read `Fabric/.claude/commands/status.md` and confirm:
- The output format shows the inline adjustment annotation syntax
- The load step references `## Capacity Adjustments`
- The notes section describes the 14-day lookahead and both annotation formats

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/status.md
git commit -m "update /status to surface capacity adjustments inline"
```

---

## Task 7: Update `standup-report` skill to open with a capacity note

**Files:**
- Modify: `Fabric/.claude/skills/standup-report.md`

- [ ] **Step 1: Add a new step between Step 3 and Step 4**

The current skill has steps: 1 (Roll Over), 2 (Determine Yesterday), 3 (Collect Member Records), 4 (Run Sync Detection), 5 (Write the Team Summary), 6 (Confirm Output).

Insert a new **Step 4: Check Capacity** between the existing Step 3 and Step 4 (which becomes Step 5), and renumber accordingly:

```markdown
### 4. Check Capacity

For each active member, read their `## Capacity Adjustments` section and identify any rows whose date range includes today. Collect:

- Members who are fully out today (`Capacity: 0%`)
- Members with reduced capacity today (any non-zero percentage below their baseline)

This list is used in Step 5 to prepend a capacity note to the team summary.
```

- [ ] **Step 2: Update the team summary format in (now) Step 5**

In the `Write the Team Summary` step, the current summary template starts with:

```markdown
# Team Standup Summary — YYYY-MM-DD

> Covers activity since last team standup: YYYY-MM-DD
> Members with no update this cycle: [names, or "All members checked in"]
```

Update it to include an optional capacity line:

```markdown
# Team Standup Summary — YYYY-MM-DD

> Covers activity since last team standup: YYYY-MM-DD
> Members with no update this cycle: [names, or "All members checked in"]
> Capacity today: [e.g. "Leo is out. Dana is at 50% (conference) through Friday."] ← omit line entirely if all members are at full capacity
```

- [ ] **Step 3: Verify**

Read `Fabric/.claude/skills/standup-report.md` and confirm:
- A "Check Capacity" step exists between Collect Member Records and Sync Detection
- The team summary format includes the optional capacity line with an omit instruction
- Step numbers are sequential and correct

- [ ] **Step 4: Commit**

```bash
git add Fabric/.claude/skills/standup-report.md
git commit -m "add capacity note to standup report summary"
```
