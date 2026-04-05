# TeamFabric Module: Triage

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Triage module manages request intake, evaluation workflows, and rubric-based assessment. Teams customize the specific rubrics and workflow definitions in `requests/workflow/`.

## Request Lifecycle

Requests flow through a team-defined workflow. The number of stages, their names, rubrics, and outcome options are all configured by the team in `requests/workflow/`. There is no prescribed stage structure — some teams use a single screening pass, others use multiple staged reviews.

```
Intake → [Team-defined evaluation stages] → Decision → If accepted: Staffing and planning → Active engagement
```

## Directory Structure

```
requests/
  REQUESTS.md                    # Module definition (team-customized)
  workflow/
    default/                     # Default workflow (team-customized)
      request-template.md        # Template for new request entities
      evaluation.md              # Defines stages, stage order, rubric references, and outcomes
      <stage>-rubric.md          # One rubric file per stage (named by the team)
  <request-id>/                  # Per-request folder
    request.md                   # Request entity file
    [supporting documents]
```

## Commands

| Command | Description |
|---------|-------------|
| /evaluate-request | Evaluate a request against its workflow rubric. Accepts a request ID and optional stage (e.g., `/evaluate-request R-42 L2`). |

## Skills

| Skill | Description |
|-------|-------------|
| request-evaluation | Evaluate a request against its workflow's rubric. Workflow-agnostic: reads the rubric from the request's assigned workflow. |

## Behavioral Rules

- New requests are created in `requests/<request-id>/request.md` using the workflow's request template.
- Request IDs follow the pattern `R-NNN` (sequential, zero-padded to 3 digits minimum).
- Evaluations are appended to the request entity's evaluation section, not stored separately.
- When evaluating, always load the full rubric from the workflow definition. Do not evaluate from memory.
- After evaluation, surface the recommendation clearly but do not make the accept/reject decision — that belongs to the designated decision-maker.
- Request entities support a `Labels:` property in their Properties section, using the same key=value format as backlog entities. The team's label schema in CLAUDE.md applies. After ingesting or updating a request description, offer label suggestions the same way as for backlog entities.

### Blocked Requests

Requests support the same `Blocked:` property flag and `## Blockers` section as backlog entities (see Core module). A request may be blocked during evaluation (waiting on IRB, missing data access, stakeholder unavailable) or during active engagement.

Add `Blocked: Yes` to the request's Properties section and a corresponding `## Blockers` entry when flagged. The `## Blockers` section should be placed after `## Evaluation` and before `## Context Log` in the request file.

When a request has a `Backlog Epic:` link, a blocker on the request is visible when `/open-questions` is run against either the request or the linked epic — the bridge traversal surfaces both directions.

### Effort Tracking on Requests

Requests support an optional `Effort:` property representing hours spent on planning or discovery work — evaluation, stakeholder consultation, scoping — before the team decides to pursue or decline the engagement. This is pre-engagement effort, distinct from execution effort tracked in the backlog.

#### Incremental logging

Effort can be logged at any time, not just on close. When a user mentions time spent on a request in natural language (e.g. "I spent 2 hours today analyzing R-012", "logged 3h to R-012"), recognize this as an effort entry and propose updating the field:

- If `Effort:` is absent or not set: propose setting it to the logged amount.
  > "Logging 2h to R-012. Set Effort to 2h? (confirm or skip)"
- If `Effort:` already has a value: propose incrementing it.
  > "Logging 2h to R-012. Current effort is 8h — update to 10h? (confirm, enter different total, or skip)"

Always present the running total, not just the increment. The user confirms or adjusts before anything is written. Skipping is always valid.

#### Close prompt

When a request reaches a terminal state (Declined, Withdrawn, Complete, or any team-defined equivalent), prompt for effort before writing the status change. If effort has already been accumulated, offer the current total as the default:

> "Closing R-NNN. Current effort is 8h — confirm, adjust, or skip?"

If no effort has been recorded:

> "Closing R-NNN. How many hours of planning or discovery work went into this? (Enter a number or skip)"

The `Effort:` field is omitted from the file entirely when no effort has been recorded.

When writing a terminal state to a request, also write `Terminated: <today's date>` to the request's Properties block if not already set. This applies to all terminal states: Declined, Withdrawn, Complete, and any team-defined equivalents.

#### Promotion

When a request is promoted to a backlog epic, display any recorded pre-engagement effort as context:

> "R-NNN has Xh of pre-engagement effort recorded. This stays on the request — it is not transferred to the epic."

The request's `Effort:` and the linked epic's effort are separate costs representing different phases of the engagement.

### Request–Backlog Cross-Reference

When a request is promoted to a backlog epic (via the Backlog module's promotion flow), a `Backlog Epic` field is written to the request entity header:

```markdown
Backlog Epic: sepsis-prediction-260315
```

The value is the epic's ID (folder name under `backlog/epics/`). This cross-reference is written as part of the promotion confirmation — it is proposed alongside the new epic and written only after the user approves.

The cross-reference does not change the request's triage state or lifecycle. It exists so that reporting and refinement commands can locate the linked epic without scanning the backlog tree.

Not every request is promoted. Declined, withdrawn, or consultation-only requests may have no linked epic — the field is simply absent.

### Effort Resolution via Linked Epic

When a request has a `Backlog Epic:` link, the linked epic is the authoritative source of effort for that engagement. When reporting or summarizing effort on a request, traverse to the linked epic and apply the backlog's short-circuit rollup rule — do not look for an effort value on the request entity itself.

Requests with no `Backlog Epic:` link have no reportable effort unless the team tracks it externally.
