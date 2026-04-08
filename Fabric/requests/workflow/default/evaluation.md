# Default Workflow — Evaluation Process

## Overview

Requests following the default workflow are evaluated in a single pass: a combined intake and decision screen. The rubric covers both whether the request is ready to evaluate and whether the team should take it on.

## Stage

### Screening
**Purpose:** Combined intake and decision gate. Determines whether the request is clear enough to act on and whether the team should take it on.
**Typically performed by:** Team lead
**Rubric:** rubric.md

**Outcomes and transitions:**
- **Accept** → proceed to backlog promotion (see Promotion Target below)
- **Needs More Information** → send back to requestor with specific questions; re-enter screening when resolved
- **Decline** → terminal; document reason on the request entity
- **Defer** → set a follow-up date; re-enter screening when conditions change

## Promotion Target

```
Promotion Target: Either
```

Controls what backlog artifact is created when a request is accepted. Valid values:

- **Epic** — accepted requests are promoted to a backlog epic
- **Feature** — accepted requests are promoted to a feature under an existing epic
- **Either** — the agent asks at acceptance time; proactively presents the active epic list to help the team choose

The default is `Either`. Teams update this value to match their conventions.

## Workflow-Specific Guidance

- Screening should take 15–20 minutes. If it takes longer, the request likely needs clarification from the requestor first.
- If Part 1 (Intake) criteria are not met, recommend Needs More Information before spending time on Part 2 (Decision). Surface Part 2 for completeness but flag the hold reason clearly.
- When evaluating capacity impact, load `team/team.md` for current allocation and active engagement counts.
