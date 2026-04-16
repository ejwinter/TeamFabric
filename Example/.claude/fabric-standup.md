# TeamFabric Module: Standup

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Standup module supports asynchronous standups on a team-defined cadence. Each team member runs a brief conversation with the agent to share progress, surface blockers, and flag questions or needs. The agent collates these into a per-member record and a team-level summary.

## Configuration

Teams may configure the standup schedule in the `### Standup` subsection of "How We Work" in their CLAUDE.md:

```markdown
### Standup
Schedule: Tuesday, Thursday
```

Valid day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Comma-separated for multi-day schedules. Omit the subsection entirely to leave the schedule open — the module will accept standups on any day.

When `Schedule:` is set, the `standup-report` skill uses it to determine which members are expected to have checked in for the current cycle, rather than treating any gap as a missing update.

## Directory Structure

```
team/members/<name-slug>/
  discuss-today.md        # Current standup cycle record (overwritten each run)
  discuss-yesterday.md    # Prior cycle record (rolled over when a new standup begins)
  discuss-log/            # Archived member records
    YYYY-MM-DD.md         # Named by the date of that standup

team/standup/
  standup-today.md        # Current team-wide summary
  standup-yesterday.md    # Prior team-wide summary
  standup-log/            # Archived team summaries
    YYYY-MM-DD.md
```

## Commands

| Command | Description |
|---------|-------------|
| `/standup-discussion` | Interactive standup conversation (Q&A mode). |
| `/standup-discussion narrative` | Narrative-first standup — member provides a stream-of-consciousness summary, agent follows up only on gaps. |

## Skills

| Skill | Description |
|-------|-------------|
| `standup-context` | Enriches standup context: loads assigned work, scans engagement and product repos for contributions, runs assignment hygiene checks, reads team standup for follow-up items. Invoked by `/standup-discussion` before conversation begins. |
| `standup-report` | Reads all members' standup records, produces a team-wide summary with sync opportunities and breakout suggestions. Handles team-level rollover on generation. Add `weekly` to aggregate across multiple check-ins within the current week — supplemental for teams with 2+ standups per week. |

## Behavioral Rules

### Defining "Yesterday"

"Yesterday" is relative, not literal. For each member, yesterday means their most recent prior `discuss-today.md` — regardless of how many calendar days have passed. For the team, yesterday means the period covered by `team/standup/standup-today.md` before the current report was generated.

Members who have not run `/standup-discussion` since the last team standup are noted as having no update for this cycle. Their prior record remains in place and is not re-rolled.

When a `Schedule:` is configured, a member is only considered missing for a cycle if at least one scheduled standup day has passed since the last team standup. A gap that falls entirely between scheduled days is expected, not a missing update.

### Member File Lifecycle

- `discuss-today.md` is created or overwritten each time a member completes `/standup-discussion`.
- When a standup begins and `discuss-today.md` exists from a prior date: roll it over to `discuss-yesterday.md`, archive it to `discuss-log/YYYY-MM-DD.md` (named by the date in its header), then proceed.
- `discuss-yesterday.md` is always the single most-recent prior record and is overwritten on each rollover.
- `discuss-log/` is append-only. A future cleanup command will manage culling.

### Team Standup File Lifecycle

- `team/standup/standup-today.md` is written by the `standup-report` skill each time it runs.
- Before writing a new team summary, the skill rolls over `standup-today.md` → `standup-yesterday.md` → `standup-log/YYYY-MM-DD.md`.
- The date in `standup-today.md`'s header is the authoritative "last team standup" date used to detect stale member records.

### Standup Record Format

Each `discuss-today.md` uses this structure:

```markdown
# Standup — [Member Name] — YYYY-MM-DD

## Yesterday
[What the member worked on / accomplished]

## Today
[What the member plans to work on]

## Blockers
[Blockers raised; "None" if clear]

## Needs & Questions
[Items the member needs from others, or open questions]

## Resolved in Standup
[Questions or blockers the agent resolved during the conversation — omit section if none]

## Notes
[Any additional context from the conversation — omit section if none]
```

### Backlog Notes from Standup

During standup, a member may mention something worth capturing on a backlog item — a discovery, a risk, a decision made, a dependency identified, or a blocker. At the end of the conversation, the agent reviews the discussion for such items and offers to route each one to the appropriate section of the relevant entity file.

**Routing by type:**

| What was mentioned | Route to |
|--------------------|----------|
| Blocker ("I'm blocked on X", "can't proceed until Y") | `## Blockers` entry + set `Blocked: Yes` in Properties |
| Open question ("we need to figure out X", "TBD") | `## Open Questions` checkbox item |
| Decision made ("we decided to...", "going with X") | `## Decisions` entry |
| General discovery, risk, or context | `## Context Log` entry |

For blockers specifically: ask who flagged it (defaults to the standup member), what the cause is (open question, dependency, external, other), and whether it relates to an existing open question or dependency on that entity. Propose the full Blockers entry for confirmation before writing.

- The agent offers once per item, does not write without confirmation.
- If the member cannot identify the entity, the agent may search `backlog/` or `requests/` by keyword and propose the best match for confirmation.
- Assigned items already in context are matched directly without a search.
- General notes use format: `- YYYY-MM-DD - [Member Name] via standup: [note text]`

### Untracked Work Scan

After the backlog note pass for existing entities, the agent scans the full conversation for work mentioned that has no backlog home — tasks done or planned, problems worth tracking, ideas surfaced — that don't map to any assigned item or entity identified during the note pass.

For each untracked item, the agent recommends one action:

| Mention type | Recommended action |
|--------------|--------------------|
| Concrete task or piece of work | Create a work item |
| Broader theme or new capability | Create a feature |
| Needs more thought or context | Log to `backlog/inbox/` for later refinement |

Same discipline as the note pass: offer once per item, do not create without explicit confirmation. Recommendations must be specific and named — vague mentions that aren't clearly actionable are not flagged.

### Post-Standup Action Checklist

After the standup record is written, the agent produces a short markdown checkbox list of items the member still needs to act on: deferred or declined backlog gaps from the untracked work scan, follow-up actions surfaced during the conversation, and manual backlog updates the member indicated they'd handle themselves. The checklist is omitted entirely if there are no outstanding items.

### Engagement Repository Detection

The `standup-context` skill checks each directly assigned epic and request for a `Repository:` field. For each one found, it resolves the local clone using the sibling-directory convention (last path segment of the URL, relative to the Fabric instance root) and runs `git log --author --since` to detect commits since the member's last standup. Results appear in the context bundle as `engagement_contributions` and are surfaced in the conversation alongside product contributions.

This addresses the common pattern where initiative work lives in per-engagement repositories that are not registered as products. Without this check, a member actively committing to an engagement repo would appear to have no contributions.

### Assignment Hygiene Check

After loading assigned items, the `standup-context` skill scans for three gap types and surfaces them as specific questions during the conversation:

| Gap type | Signal | Suggested question style |
|----------|--------|--------------------------|
| `context_log_stale` | Most recent `## Context Log` entry predates last team standup | "Anything worth capturing on [Entity] from the past week?" |
| `repository_gap` | `Repository:` is set but no commits found for this member since last standup | "I didn't see commits in [repo] — is that paused, or happening elsewhere?" |
| `state_lag` | Prior standup described item as complete, but `State:` is still Active or New | "Last standup you said [Entity] was wrapping up — still Active, did you want to transition it?" |

Hygiene gaps are surfaced once per item, conversationally, and only if the member's answers haven't already resolved them.

### Scope of Agent Assistance

- The agent uses the `standup-context` skill to arrive at the conversation informed. It does not recite context back — it uses it to ask specific questions.
- During the conversation, the agent may resolve questions by checking the repo before deciding whether to log them. Items resolved in-conversation go under "Resolved in Standup" rather than "Needs & Questions".
- The agent should encourage specific, named blockers and asks. Vague blockers ("things are slow") should be gently probed.
- The agent does not make commitments on behalf of other team members.

### Identity Resolution

The member is identified at the start of `/standup-discussion` by matching the user's git email against `Email:` fields in member profiles, or by asking directly if no match is found.

### Narrative Mode

`/standup-discussion narrative` accepts a stream-of-consciousness summary (typically via OS dictation) as the starting point. The agent digests the narrative and asks follow-up questions only for genuine gaps — it does not re-run the full Q&A if the narrative is sufficient. The end-of-conversation backlog note pass still applies.
