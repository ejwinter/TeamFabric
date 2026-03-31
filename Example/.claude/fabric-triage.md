# TeamFabric Module: Triage

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Triage module manages request intake, evaluation workflows, and rubric-based assessment. Teams customize the specific rubrics and workflow definitions in `requests/workflow/`.

## Request Lifecycle

Requests flow through a configurable workflow. The default workflow provides a two-level evaluation (L1 screening, L2 consultation) but teams can define their own stages.

```
Intake → L1 Screening → L2 Consultation → Decision (Accept / Reject / Needs More Info)
  → If accepted: Staffing and approach planning → Active engagement
```

## Directory Structure

```
requests/
  REQUESTS.md                    # Module definition (team-customized)
  workflow/
    default/                     # Default workflow (team-customized)
      request-template.md        # Template for new request entities
      l1-rubric.md               # L1 evaluation rubric
      l2-rubric.md               # L2 evaluation rubric
      evaluation.md              # Evaluation process definition
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
