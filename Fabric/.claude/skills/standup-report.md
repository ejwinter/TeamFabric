# Skill: Standup Report

## Purpose

Generate a team-wide standup summary from all members' current standup records. Identifies sync opportunities, suggests breakout conversations, and produces both a team digest and per-member summaries. Handles team-level rollover before writing.

## Invocation

Invoked explicitly by the user (e.g., "run the standup report", "generate today's standup summary"). May also be invoked implicitly when the user asks for a team standup digest.

Add `weekly` to produce a week-spanning digest (e.g., "run the weekly standup report", "standup-report weekly"). See the Weekly Mode section for details.

## Steps

### 1. Roll Over the Prior Team Summary

Before reading any member records, check `team/standup/standup-today.md`:

- If it exists and is from a prior date: copy it to `standup-yesterday.md`, archive it to `standup-log/YYYY-MM-DD.md` (named by the date in its header). Note this date — it is the "last team standup" date used in staleness detection below.
- If it is from today (report is being re-run): overwrite in place without rollover.
- If it does not exist: proceed. No prior team standup date is known; treat all member records as current.

Ensure `team/standup/` and `team/standup/standup-log/` exist. Create them if absent.

### 2. Determine "Yesterday" for the Team

The team's "yesterday" is the period from the last team standup date to now. Use the date extracted from the rollover step. If no prior team summary existed, "yesterday" covers all available member standup history.

### 3. Collect Member Records

Read the team's standup schedule from the `### Standup` → `Schedule:` field in the team's CLAUDE.md "How We Work" section, if present. This governs staleness detection below.

For each active member in `team/members/` (excluding `template/`):

- Read `discuss-today.md` — primary input.
- If `discuss-today.md` does not exist or its date predates the last team standup: determine whether the member is **missing** or **not yet due**:
  - **No schedule configured**: member has no update this cycle. Note this explicitly.
  - **Schedule configured**: member is missing only if at least one scheduled standup day has passed since the last team standup date. If no scheduled day has passed, the member is simply not yet due — omit them from the "no update" list without comment.
- Do not use `discuss-yesterday.md` as a substitute for current input.
- The date in each member's `discuss-today.md` header is their personal standup date. Record it for the per-member summary.

### 4. Check Capacity

For each active member, read their `## Capacity Adjustments` section and identify any rows whose date range includes today. Collect:

- Members who are fully out today (`Capacity: 0%`)
- Members with reduced capacity today (any non-zero percentage below their baseline)

This list is used in Step 5 to prepend a capacity note to the team summary.

### 5. Run Sync Detection

Scan across all member records and flag pairings when:

1. **Shared dependency** — two members both reference the same backlog item, product, or external dependency.
2. **Complementary need** — one member's "Needs & Questions" matches another member's listed expertise (from `profile.md`) or their current assigned work.
3. **Parallel risk** — two members appear to be working on overlapping areas without apparent coordination.
4. **Blocker owner** — a member's blocker names another specific member as the dependency.

For each flagged pairing, record: both member names, the type of sync, and the specific reason (item name, question text, or overlapping area). Do not surface vague suggestions.

### 6. Write the Team Summary

Write to `team/standup/standup-today.md`. Include today's date in the header.

```markdown
# Team Standup Summary — YYYY-MM-DD

> Covers activity since last team standup: YYYY-MM-DD
> Members with no update this cycle: [names, or "All members checked in"]
> Capacity today: [e.g. "Leo is out. Dana is at 50% (conference) through Friday."] ← omit this line entirely if all members are at full capacity

## Big Events Yesterday
[2–5 bullets: notable completions, decisions, milestones across the team since the last team standup.
 If nothing notable, write: "No significant events to report."]

## Big Goals Today
[2–5 bullets: the most significant things the team is driving toward today across all members]

## Blockers & Needs
[Actionable blockers and open asks only — those with no follow-up date, or whose follow-up date is today or past.
 Format: "**[Member]**: [blocker or need] — needs: [who or what]"
 If parked blockers exist but none are actionable: "No actionable blockers. [N] parked (next follow-up: YYYY-MM-DD)."
 If none at all: "No blockers reported."]

## Suggested Syncs & Breakouts
[Flagged pairings from sync detection.
 Format: "**[Name] ↔ [Name]**: [specific reason — item name, question text, or overlapping work]"
 Omit this section entirely if no syncs were identified.]

## Per-Member Summary

### [Member Name] *(standup: YYYY-MM-DD)*
**Yesterday:** [1–2 sentence summary]
**Today:** [1–2 sentence summary]
**Blockers:** [inline summary, or "None"]
**Needs/Questions:** [inline summary, or "None"]

*(Repeat for each member. For members with no update: "No standup this cycle.")*

---
*Generated by Fabric standup-report — YYYY-MM-DD HH:MM*
```

### 7. Confirm Output

Report the output path to the user: `team/standup/standup-today.md`.

Note any members who had no update this cycle and suggest they run `/standup-discussion` if appropriate.

## Tone and Length

- Per-member summaries: 1–2 sentences per section. Preserve specifics (item names, question text) over generic paraphrasing.
- Team sections: prioritize signal. Do not inflate if little happened.
- Blocked members and unresolved needs should be prominent, not buried at the end.
- Apply follow-up date filtering consistently: actionable = no follow-up date or follow-up date ≤ today. Parked = follow-up date > today. Never surface parked items as if they need immediate action.

## Weekly Mode

When invoked with `weekly`, the skill produces a week-spanning digest that aggregates across multiple standup check-ins within the current week. This is useful for teams that standup 2+ times per week and want a consolidated view for reporting or planning at the end of the week.

**Teams that standup once per week should run the standard report** — that is their weekly artifact, and the rollover behavior there is intentional. Weekly mode is supplemental, not a substitute for the regular report flow. A team that does both runs the standard report after each standup and runs the weekly digest at the end of the week to aggregate across them.

### Week Window

Monday of the current week through today. If today is Monday, use the prior week (Monday–Sunday). The window is always full calendar weeks — do not use a rolling 7-day window.

### Data Sources

For each active member:
- `discuss-log/YYYY-MM-DD.md` entries whose date falls within the week window
- Current `discuss-today.md` if its date falls within the window

For team context:
- `standup-log/YYYY-MM-DD.md` entries within the window (background reference only — not re-summarized)

### Steps

1. Determine the week window.
2. For each active member, collect all standup records within the window. If a member has no records in the window, note them as having no check-ins this week.
3. Aggregate each member's records across the week: merge Yesterday/Today entries into a week-level narrative of what they worked on and where they're heading, carry forward any unresolved blockers or needs (dedup if repeated across check-ins).
4. Run sync detection across the aggregated weekly view.
5. Write to `team/standup/standup-weekly.md`. This file is overwritten each time weekly mode runs — no rollover.

### Format

```markdown
# Team Weekly Summary — Week of YYYY-MM-DD

> Covers: YYYY-MM-DD to YYYY-MM-DD
> Check-ins this week: [Member: N, Member: N, ...] (or "No check-ins" for members with none)

## Big Events This Week
[3–5 bullets: notable completions, decisions, or milestones across the team this week.
 If nothing notable: "No significant events to report."]

## Blockers & Needs
[Actionable unresolved blockers and open asks across the week.
 Format: "**[Member]**: [blocker or need] — needs: [who or what]"
 If none: "No open blockers or needs."]

## Suggested Syncs & Breakouts
[Flagged pairings from sync detection — same format as standard report.
 Omit section entirely if none.]

## Per-Member Weekly Summary

### [Member Name] *(N check-ins: YYYY-MM-DD, YYYY-MM-DD)*
**This week:** [2–3 sentence aggregate narrative of what they worked on]
**Heading into next week:** [What they're continuing or starting next]
**Blockers:** [inline summary, or "None"]
**Needs/Questions:** [inline summary, or "None"]

*(Repeat for each member. For members with no check-ins: "No standups this week.")*

---
*Generated by Fabric standup-report weekly — YYYY-MM-DD HH:MM*
```

### Behavior Notes

- Weekly mode does **not** trigger rollover of daily standup files or the team standup file — the standard report handles that. Run the standard report after each standup cycle; run weekly mode at the end of the week to aggregate.
- Capacity adjustments that overlap the week window are included in the per-member summary where relevant.
- If fewer than two members have records in the window, generate the report but note low participation prominently at the top.

## Notes

- Read-only on member files. Writes only to `team/standup/`.
- No meta mode required.
- If fewer than two members have records this cycle, generate the report but note low participation prominently at the top.
