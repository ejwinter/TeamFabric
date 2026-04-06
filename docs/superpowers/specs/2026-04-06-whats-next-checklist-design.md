# Design: Replace Pre-Filled Rubrics with Progressive "What's Next" Checklist

**Date:** 2026-04-06
**Issue:** https://github.com/ejwinter/TeamFabric/issues/4
**Approach:** What's Next as a lifecycle section on requests only (Approach A)

## Problem

The current request template includes an empty `## Evaluation` section with a placeholder comment before any evaluation has occurred. This confuses users — it presents scoring scaffolding for work that hasn't started. Additionally, pre-filled rubric structures risk going stale if the rubric is updated after the request was created.

## Solution

Add a `## What's Next` section to request entities that reflects where the request actually is in the workflow and what concrete steps are needed to move it forward. The `## Evaluation` section starts empty and is populated only when `/evaluate-request` runs, using the current rubric at evaluation time.

## What's Next Section

### Placement

`## What's Next` sits between `## Evaluation` and `## Context Log` in the request entity file. It is a top-level section, not a subsection of Evaluation.

### Generation at Request Creation

When a new request is created, the What's Next section is populated with two layers:

1. **Static baseline** — a standard checklist shipped in the request template, derived from common pre-L1 screening dimensions. Teams customize this list in their `request-template.md`. Example:

```markdown
## What's Next

Preparing for L1 screening:
- [ ] Confirm data sources are identified and accessible
- [ ] Clarify the AI/ML goal to a specific, evaluable question
- [ ] Determine IRB status
- [ ] Determine funding status
- [ ] Confirm investigator availability for consultation
```

2. **AI-generated items** — appended to the same checklist (not visually separated), based on gaps detected in the request content at creation time. For example, if the cohort size is "unknown," the agent adds `- [ ] Estimate cohort size for feasibility assessment`. The combined list reads as a single unified checklist.

The agent omits baseline items that are already satisfied by the request content (e.g., if IRB status is "Approved," the IRB checklist item is not included).

### Agent-Assisted Resolution

As information arrives — via `/ingest`, conversation, standup, or direct edits — the agent proposes checking off relevant What's Next items.

- When the agent detects that a checklist item has been satisfied (e.g., IRB status updated from "Unknown" to "Approved"), it proposes checking it off.
- The agent does not auto-check items. Always proposes and waits for confirmation, consistent with existing entity update rules in fabric-core.
- When all items are checked, the agent notes that the request appears ready for the next evaluation stage and suggests running `/evaluate-request`.

No new command or skill is needed for this. It is behavioral guidance for the existing ingestion and entity-maintenance skills to recognize What's Next items as resolution targets.

### Evaluation Stage Transitions

When `/evaluate-request` runs, the completed rubric is written into `## Evaluation` (no change to current format). The `## What's Next` section is then replaced based on the evaluation outcome:

| Outcome | What's Next becomes |
|---------|-------------------|
| **Advance to next stage** (e.g., L1 → L2) | Fresh checklist: static baseline for the next stage + AI-generated items based on evaluation notes and identified gaps |
| **Needs More Information** | Checklist of the specific questions/gaps the evaluator identified during the rubric walkthrough |
| **Defer** | Note of conditions that need to change, plus a follow-up date if provided |
| **Accept** (terminal) | Post-decision items (e.g., "Assign owner," "Schedule kickoff," "Promote to backlog epic") |
| **Reject** (terminal) | Post-decision items (e.g., "Notify requestor with rationale") |

Static baselines for post-stage checklists are not hardcoded in the framework. The evaluation skill generates them by reading the next stage's rubric criteria and the evaluation notes from the stage just completed.

## Files Changed

| File | Change |
|------|--------|
| `Fabric/template/request-template.md` | Add `## What's Next` section with static pre-L1 baseline. Remove the evaluation placeholder comment. |
| `Fabric/.claude/skills/request-evaluation.md` | Add behavioral rules: (1) on evaluation start, replace What's Next with the completed rubric in Evaluation; (2) on non-terminal outcomes, generate a new What's Next; (3) on terminal outcomes, generate post-decision items. |
| `Fabric/.claude/commands/evaluate-request.md` | Update step 5 ("After evaluation") to include What's Next generation as part of the post-evaluation write. |
| `Fabric/template/fabric-triage.md` | Add a section documenting What's Next as a request lifecycle pattern — agent-assisted resolution behavior, interaction with ingestion and entity-maintenance. |
| `Example/requests/R-101/request.md` | Update to demonstrate post-L1 What's Next (preparing for L2 consultation). |
| `Example/requests/R-102/request.md` | Update to demonstrate pre-L1 What's Next with AI-generated items based on request gaps. |

## What's Not Changing

- **Rubric files** (`l1-rubric.md`, `l2-rubric.md`) — untouched. Loaded fresh at evaluation time.
- **Evaluation format** — the rubric table written into `## Evaluation` stays exactly as-is.
- **`evaluation.md`** (workflow process definition) — untouched. Stage sequence, outcomes, transitions stay the same.
- **fabric-core.md** — no changes. What's Next is a Triage-module concern for now.
- **Request creation flow** — What's Next generation happens as part of the existing creation step. No new command or separate step.
