# TeamFabric Module: Retrospective

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Retrospective module supports periodic team retrospectives with a defined lifecycle. A lead or PM creates a retro, team members contribute their input individually, and the lead closes it to produce a team-level summary with action items.

Each retrospective lives in its own folder under `team/retros/`. A retro is either **Open** (accepting input) or **Closed** (summary generated). There is typically one open retro at a time, though the module supports multiple.

## Directory Structure

```
team/retros/
  <retro-id>/
    retro.md             # Retro definition: status, period, questions, participant tracking
    <member-slug>.md     # One file per member who has submitted input
    summary.md           # Written on close; not present on open retros

output/
  retro-<retro-id>.md   # Annotated draft (local only, gitignored) — working artifact for close
```

The `output/` directory is gitignored. The draft in `output/` is a local working artifact; the finalized `summary.md` committed to `team/retros/` is the permanent record.

### Retro IDs

Default format: `retro-YYMMDD` (e.g. `retro-260404`). If the PM provides a name or the retro is tied to an iteration, include it: `retro-sprint-5-260404`. Any valid directory name is accepted.

## Commands

| Command | Description |
|---------|-------------|
| `/retro create` | Create a new retrospective. Sets the period, optional questions, and opens it for member input. |
| `/retro` | Run the retro input conversation for the current member. Detects the open retro automatically. |
| `/retro review [retro-id]` | Show the status of a retro: participation, and optionally the inputs submitted so far. Defaults to the open retro. |
| `/retro report [retro-id]` | Synthesize member inputs into an annotated draft at `output/retro-<id>.md` for the team review meeting. |
| `/retro close [retro-id]` | Finalize from the annotated draft; write `summary.md` and mark the retro closed. |

## Skills

| Skill | Description |
|-------|-------------|
| `retro-report` | Synthesizes member inputs into a team retro summary. Invoked by `/retro close`. |

## Behavioral Rules

### Retro Definition File

`retro.md` is written on `/retro create` and updated as members submit input.

```markdown
# Retrospective — [Title] — YYYY-MM-DD

Status: Open
Period: YYYY-MM-DD to YYYY-MM-DD
Created by: [Member Name]
Iteration: [optional — iteration name if tied to a sprint]

## Questions

[Either "default" or a numbered list of custom questions]

## Participants

| Member | Status |
|--------|--------|
| [Name] | Pending |

## Notes
[Optional context from the lead — goals for this retro, anything to focus on]
```

When a member submits input, their row in `## Participants` is updated from `Pending` to `Submitted`.

When the retro is closed, `Status: Open` changes to `Status: Closed`.

### Default Retro Questions

When questions are set to `default`, the agent uses this standard set during member input conversations:

1. What went well this period?
2. What didn't go well or felt harder than it should have?
3. What should we change or improve going forward?
4. Any action items — specific, owned things to do differently?

Teams can override the default question set in their CLAUDE.md constitution:

```markdown
### Retrospective
Default questions:
1. [Custom question 1]
2. [Custom question 2]
...
```

When a team-defined set is present, it replaces the framework default. Custom per-retro questions (set at `/retro create`) override both.

### Member Input Files

Each member's input is stored as `<member-slug>.md` in the retro folder:

```markdown
# Retro Input — [Member Name] — [Retro ID]

Submitted: YYYY-MM-DD

## [Question text]
[Answer — bullet list or freeform]

## [Question text]
[Answer]

...

## Action Items
[Specific things to do — include a proposed owner if known. Omit section if none.]
```

Member inputs are written only after explicit confirmation from the member. The agent previews the file before writing.

### Open Retro Detection

When a member runs `/retro` with no arguments, the agent scans `team/retros/*/retro.md` for `Status: Open`. 

- **One open retro**: proceed with that retro automatically.
- **Multiple open retros**: list them and ask which one the member is contributing to.
- **No open retro**: inform the member and suggest asking the lead to run `/retro create`.

### Participant Tracking

`retro.md` is the canonical source of participation state. After each member submits, the agent updates the participant table. This allows anyone to run `/retro review` to see who has and hasn't contributed.

### Scope and Tone

- The agent should encourage specificity. Vague inputs ("things were chaotic") should be probed for root causes.
- The agent does not assign blame or speculate about interpersonal dynamics.
- Action items should be specific, achievable, and owned. The agent will suggest an owner if the member mentions one or if the work falls clearly in someone's domain.
- `/retro create` and `/retro close` are typically run by the lead or PM, but the module does not enforce role restrictions — any member can run them.
