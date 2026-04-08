# Design: Default Workflow and Request → Feature Promotion

**Date:** 2026-04-07
**Issue:** ejwinter/TeamFabric#14
**Status:** Approved

## Problem

`Fabric/requests/workflow/default/` ships only `request-template.md`. Teams enabling the Triage module get a skeleton with no working evaluation process. The Example instance has a functioning L1/L2 workflow but it is tailored for a medical AI/ML team (IRB, cohorts, investigator availability) and cannot ship as a framework default.

Additionally, the request → backlog promotion flow only supports epic-level promotion. Many accepted requests are feature-scale — they fit within an existing epic — and the current system forces teams to create unnecessary epics or skip the promotion flow entirely.

## Scope

- Ship a working single-pass default workflow in `Fabric/requests/workflow/default/`
- Genericize `request-template.md` to remove AI/ML-specific fields
- Add `Promotion Target` to the workflow definition to configure what backlog artifact an accepted request produces
- Extend request → backlog promotion to support feature-level promotion
- Clarify `/init` behavior so workflow files are not overwritten on reinit

**Out of scope:** workflow builder skill and `/add-workflow` command (future work).

## Design

### 1. Default Workflow Files

Three files ship in `Fabric/requests/workflow/default/`:

#### `evaluation.md`
Defines the single-stage workflow. Key additions beyond current Example format:

```
Promotion Target: Either
```

Valid values: `Epic` | `Feature` | `Either`

- `Epic` — accepted requests always become epics
- `Feature` — accepted requests always become features (agent prompts for parent epic)
- `Either` — agent asks at acceptance time; proactively loads epic list to help user choose

The framework default ships as `Either`. Teams update this to match their conventions.

#### `rubric.md`
Named `rubric.md` (not `l1-rubric.md`) — the L-prefix implies a multi-stage system. Single-pass, two-section structure:

**Part 1 — Intake** (is this request ready to evaluate?)
Three criteria, assessed before Part 2:
- **Clarity** — Is there an identifiable, specific goal? Assess: Clear / Needs Clarification / Unclear
- **Scope** — Is the scope described well enough to estimate effort? Assess: Scoped / Partially Scoped / Unscoped
- **Requestor Availability** — Will the requestor be available to clarify and validate? Assess: Available / Limited / Unavailable / Unknown

If any Part 1 criterion fails, the recommended outcome is **Needs More Information**. The agent surfaces Part 2 for completeness but flags the hold reason clearly.

**Part 2 — Decision** (should the team take this on?)
Four criteria:
- **Alignment** — Does this fit the team's scope and mandate?
- **Feasibility** — Can the team deliver this with current skills and tools?
- **Capacity** — Can the team absorb this without unacceptable impact to existing commitments?
- **Value** — Does this deliver meaningful value relative to the effort required?

**Outcomes:**
- **Accept** → proceed to promotion flow
- **Needs More Information** → send back to requestor with specific questions; re-evaluate when resolved
- **Decline** → terminal; document reason
- **Defer** → set follow-up date; re-evaluate when conditions change

#### `request-template.md`
Genericized — remove all AI/ML-specific fields. Structure:

- Header: Status, Workflow, Submitted, Requestor, Owner
- Summary (2-3 sentences)
- Properties: Priority, Target Date, Effort Estimate, Effort, Labels, Repository
- Requestor Details: Department, Contact
- Technical Details: Affected Systems/Components, Success Criteria (what does done look like?)
- Evaluation
- What's Next — pre-evaluation checklist:
  - Clarify the goal to a specific, actionable statement
  - Confirm scope is understood well enough to estimate
  - Confirm requestor availability for consultation
- Context Log

### 2. Promotion Target and Feature-Level Promotion

#### `fabric-triage.md` changes

Add `Backlog Feature: <feature-id>` as a cross-reference field on request entities, parallel to the existing `Backlog Epic:` field. Only one is written per request (whichever promotion path is taken).

On Accept, the agent reads `Promotion Target` from the workflow's `evaluation.md` and drives the promotion flow:

- `Epic` → existing epic promotion flow, no change
- `Feature` → feature promotion flow (see below)
- `Either` → agent asks: "Should this become an Epic or a Feature?" If Feature, proceed to feature promotion flow immediately

#### `fabric-backlog.md` changes

Add feature-level promotion flow, parallel to the existing epic promotion flow:

1. Agent scans `backlog/epics/` for active epics and presents the list to the user
2. User selects the parent epic (or indicates none are appropriate, which surfaces Epic as the better path)
3. Agent proposes the new feature: title, description (carried from request), labels, repository, external URL
4. User approves
5. Agent creates the feature under the selected epic
6. Writes `Backlog Feature: <feature-id>` back to the request entity
7. Does not change the request's triage state

The proactive epic list serves a dual purpose: it helps the user place the feature correctly and surfaces what already exists, discouraging unnecessary new epics.

Effort promotion note applies to feature promotion the same as epic promotion:
> "R-NNN has Xh of pre-engagement effort recorded. This stays on the request — it is not transferred to the feature."

### 3. Init Command Update

In the Scaffold Steps for Triage, clarify: copy `Fabric/requests/workflow/default/` contents only if `requests/workflow/default/` does not already exist or is empty in the target. On reinit of an existing instance, skip workflow files — they are team-owned content.

The update command's "Never touch" list already includes `requests/` — no change needed there.

## Files Changed

| File | Change |
|------|--------|
| `Fabric/requests/workflow/default/evaluation.md` | New |
| `Fabric/requests/workflow/default/rubric.md` | New |
| `Fabric/requests/workflow/default/request-template.md` | Update — genericize |
| `Fabric/template/fabric-triage.md` | Update — Promotion Target, Backlog Feature cross-ref, What's Next for Accept |
| `Fabric/template/fabric-backlog.md` | Update — feature-level promotion flow |
| `Example/.claude/fabric-triage.md` | Sync with template |
| `Example/.claude/fabric-backlog.md` | Sync with template |
| `.claude/commands/init.md` | Update — workflow copy behavior on reinit |
