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

### Repository Linking on Requests

Requests support an optional `Repository:` field in their Properties section. This is the git remote URL of the working repository for the engagement — where the team's implementation work lives. It is a work repository, not a product entity.

```
Repository: https://github.com/org/sepsis-model
```

**Lookup convention:** The repo is expected as a sibling folder next to this Fabric instance, named after the repository slug (e.g. `https://github.com/org/sepsis-model` → `../sepsis-model`). Teams are responsible for keeping that clone present.

**Context surfacing:** When a request has `Repository:` set and someone asks about the request, check whether the sibling folder exists. If it does, the agent may read from it on request — recent commits, file structure, open issues — to provide relevant context. Do not read the repo proactively on every query; surface it when the user asks about implementation status, technical details, or code context for the request.

If the sibling folder is absent, note this clearly rather than failing silently:
> "R-NNN has a linked repository (github.com/org/sepsis-model) but it isn't cloned locally. Clone it as a sibling folder to access code context."

### What's Next Section

Request entities carry a `## What's Next` section between `## Evaluation` and `## Context Log`. It tracks actionable next steps throughout the request lifecycle.

**At request creation:** Populate with the team's pre-screening baseline checklist from `request-template.md`, supplemented by AI-generated items for gaps detected in the specific request content. Omit baseline items already answered by the request's field values.

**During evaluation prep:** As information arrives via ingestion, conversation, or standup, propose checking off resolved items:
- When a checklist item is satisfied, propose: *"Requestor availability is confirmed. Check off 'Confirm requestor availability' on R-NNN?"*
- Do not auto-check items. Always propose and confirm — consistent with entity update rules in fabric-core.
- When all items are checked, suggest running `/evaluate-request`.

**After evaluation:** The section is replaced based on the outcome by the request-evaluation skill. See that skill for outcome-specific behavior.

### Promotion Target

When a request is accepted, the agent reads `Promotion Target` from the workflow's `evaluation.md` to determine what backlog artifact to create:

- **Epic** — proceed with the standard epic promotion flow (see Backlog module)
- **Feature** — proceed with the feature promotion flow (see Backlog module); agent proactively presents active epics for the user to select a parent
- **Either** — agent asks at acceptance time: *"Should this become an Epic or a Feature?"* If Feature is chosen, proceed immediately to the feature promotion flow with the epic list

The `Promotion Target` field is set by the team in their workflow's `evaluation.md`. If the field is absent, treat it as `Either`.

### Blocked Requests

Requests support the same `Blocked:` property flag and `## Blockers` section as backlog entities (see Core module). A request may be blocked during evaluation (waiting on IRB, missing data access, stakeholder unavailable) or during active engagement.

Add `Blocked: Yes` to the request's Properties section and a corresponding `## Blockers` entry when flagged. The `## Blockers` section should be placed after `## What's Next` and before `## Context Log` in the request file.

When a request has a `Backlog Epic:` or `Backlog Feature:` link, a blocker on the request is visible when `/open-questions` is run against either the request or the linked backlog entity — the bridge traversal surfaces both directions.

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

When a request is promoted to a backlog epic or feature, display any recorded pre-engagement effort as context:

> "R-NNN has Xh of pre-engagement effort recorded. This stays on the request — it is not transferred to the epic/feature."

The request's `Effort:` and the linked backlog entity's effort are separate costs representing different phases of the engagement.

### Request–Backlog Cross-Reference

When a request is promoted to a backlog artifact (via the Backlog module's promotion flow), one of the following cross-reference fields is written to the request entity header:

```markdown
Backlog Epic: epic-id-260315
```
```markdown
Backlog Feature: feature-id-260315
```

The value is the entity's ID (folder name under `backlog/epics/` or the feature path). The cross-reference is proposed alongside the new entity and written only after the user approves.

The cross-reference does not change the request's triage state or lifecycle. It exists so that reporting and refinement commands can locate the linked backlog entity without scanning the tree.

Not every request is promoted. Declined, withdrawn, or consultation-only requests have neither field — both are absent.

### Effort Resolution via Linked Backlog Entity

When a request has a `Backlog Epic:` or `Backlog Feature:` link, the linked entity is the authoritative source of effort for that engagement. When reporting or summarizing effort on a request, traverse to the linked entity and apply the backlog's rollup rule — do not look for an effort value on the request itself.

Requests with no backlog cross-reference have no reportable effort unless the team tracks it externally.
