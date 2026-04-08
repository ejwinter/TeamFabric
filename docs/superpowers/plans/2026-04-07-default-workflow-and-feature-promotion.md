# Default Workflow and Request → Feature Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a working generic default workflow in `Fabric/requests/workflow/default/` and extend request promotion to support feature-level backlog artifacts alongside epics.

**Architecture:** All changes are markdown documentation files. Tasks follow a write → verify cross-references → commit pattern. Tasks 5–8 are paired edits (template + Example sync) to keep the deployed instance consistent with the framework source.

**Spec:** `docs/superpowers/specs/2026-04-07-default-workflow-and-feature-promotion-design.md`
**Issue:** ejwinter/TeamFabric#14

---

### Task 1: Move GitHub issue #14 to active

**Files:**
- No file changes — GitHub only

- [ ] **Step 1: Add a comment to issue #14 indicating work is starting**

```bash
gh issue comment 14 --repo ejwinter/TeamFabric --body "Starting implementation. Design spec at docs/superpowers/specs/2026-04-07-default-workflow-and-feature-promotion-design.md"
```

- [ ] **Step 2: Add an `in-progress` label (create it if it doesn't exist)**

```bash
gh label create "in-progress" --repo ejwinter/TeamFabric --color "0075ca" --description "Actively being worked on" 2>/dev/null || true
gh issue edit 14 --repo ejwinter/TeamFabric --add-label "in-progress"
```

---

### Task 2: Create `evaluation.md`

**Files:**
- Create: `Fabric/requests/workflow/default/evaluation.md`

- [ ] **Step 1: Write the file**

```markdown
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
```

Save to `Fabric/requests/workflow/default/evaluation.md`.

- [ ] **Step 2: Verify the file reads correctly**

Read the file back and confirm:
- `Promotion Target:` field is present with value `Either`
- All four outcomes are listed under the Screening stage
- No placeholder text or `[...]` tokens remain

- [ ] **Step 3: Commit**

```bash
git add Fabric/requests/workflow/default/evaluation.md
git commit -m "add default workflow evaluation.md with Promotion Target"
```

---

### Task 3: Create `rubric.md`

**Files:**
- Create: `Fabric/requests/workflow/default/rubric.md`

- [ ] **Step 1: Write the file**

```markdown
# Screening Rubric

## Purpose

Combined intake and decision screen for incoming requests. Evaluates whether a request is ready to act on and whether the team should take it on. Typically performed by the team lead at intake.

## When Used

When a new request is created and needs evaluation before committing team time. Run `/evaluate-request <R-NNN>` to evaluate against this rubric.

## Part 1 — Intake

Is this request ready to evaluate?

### 1. Clarity
**Question:** Is the request clearly stated with an identifiable, specific goal?
**Guidance:** The requestor should be able to describe what they want built, changed, or fixed in concrete terms. Vague requests ("we want better tooling", "improve performance") need refinement before evaluation.
**Assess as:** Clear / Needs Clarification / Unclear

### 2. Scope
**Question:** Is the scope described well enough to estimate effort?
**Guidance:** A precise estimate is not required — just enough to know whether this is a small task, a feature, or a multi-month initiative. Requests with no scope boundary are hard to staff or prioritize.
**Assess as:** Scoped / Partially Scoped / Unscoped

### 3. Requestor Availability
**Question:** Will the requestor be available to clarify requirements, answer questions, and validate the result?
**Guidance:** Even well-described requests need a contact for questions that surface during delivery. A requestor who is unavailable for an extended period is a real delivery risk.
**Assess as:** Available / Limited / Unavailable / Unknown

> **If any Part 1 criterion is Needs Clarification, Unclear, Unscoped, or Unavailable:** recommend Needs More Information before proceeding to Part 2.

## Part 2 — Decision

Should the team take this on?

### 4. Alignment
**Question:** Does this request fall within the team's scope and mandate?
**Guidance:** Consider whether this is the kind of work the team owns. Requests that belong to another team, require expertise outside the team's domain, or conflict with the team's current direction should be declined or redirected.
**Assess as:** Aligned / Borderline / Out of Scope

### 5. Feasibility
**Question:** Can the team deliver this with current skills and tools?
**Guidance:** Technical feasibility — not capacity. Does the team have the expertise and access to do this? Known risks are not automatic rejections if mitigation strategies exist.
**Assess as:** Feasible / Feasible with Risks / Uncertain / Infeasible

### 6. Capacity
**Question:** Can the team absorb this without unacceptable impact to existing commitments?
**Guidance:** Load `team/team.md` for current allocation and active engagements. Consider who would own this and what would need to slip. If capacity is tight, Defer is more appropriate than Decline.
**Assess as:** Absorbable / Tight / Would Require Tradeoffs / No Capacity

### 7. Value
**Question:** Does this deliver meaningful value relative to the effort required?
**Guidance:** Consider the impact on users, the team's goals, or the broader organization. If value is unclear, that is a signal to clarify with the requestor before evaluating further.
**Assess as:** High / Moderate / Low / Unclear

## Outcome Options

- **Accept** — request is clear, aligned, feasible, and the team can absorb it. Proceed to backlog promotion.
- **Needs More Information** — request is promising but incomplete, or Part 1 criteria are not met. Send back to requestor with specific questions.
- **Decline** — request is out of scope, infeasible, or not worth the tradeoff. Document the reason clearly.
- **Defer** — request is valid but timing is wrong (capacity, dependencies, priority). Set a follow-up date.
```

Save to `Fabric/requests/workflow/default/rubric.md`.

- [ ] **Step 2: Verify**

Read back and confirm:
- Part 1 has exactly 3 criteria (Clarity, Scope, Requestor Availability)
- Part 2 has exactly 4 criteria (Alignment, Feasibility, Capacity, Value)
- The blockquote gate instruction is present between Part 1 and Part 2
- All four outcomes are listed
- No AI/ML-specific language (IRB, cohorts, data scientists, funding)

- [ ] **Step 3: Commit**

```bash
git add Fabric/requests/workflow/default/rubric.md
git commit -m "add generic screening rubric for default workflow"
```

---

### Task 4: Update `request-template.md`

**Files:**
- Modify: `Fabric/requests/workflow/default/request-template.md`

- [ ] **Step 1: Read the current file**

Read `Fabric/requests/workflow/default/request-template.md` to confirm current content before editing.

- [ ] **Step 2: Replace the file with the generic version**

```markdown
# R-[ID]: [Request Title]

Status: New
Workflow: default
Submitted: YYYY-MM-DD
Requestor: [Name] ([email])
Owner: [Team member responsible for shepherding this request]

## Summary

[2-3 sentence description of what is being requested and why.]

## Properties

Priority: [Not Set | Low | Medium | High | Critical]
Target Date: [date or "None"]
Effort Estimate: [Not Set | Small (< 1 week) | Medium (1-4 weeks) | Large (> 1 month)]
Effort: [hours of planning/discovery work invested in this request — populated on close]
External: [None | e.g., ADO Epic #1234 — https://dev.azure.com/org/project/_workitems/edit/1234]
Repository: [optional — git remote URL of the working repository for this engagement]
Labels: [optional, comma-separated key=value pairs matching the team's label schema]

### Requestor Details
Department: [Requestor's department]
Contact: [Preferred contact method or availability notes]

### Technical Details
Affected Systems/Components: [What systems, services, or components are involved]
Success Criteria: [What does done look like? How will the requestor know this is complete?]

## Evaluation

## What's Next

Preparing for screening:
- [ ] Clarify the goal to a specific, actionable statement
- [ ] Confirm scope is understood well enough to estimate effort
- [ ] Confirm requestor availability for questions and validation

## Context Log
```

- [ ] **Step 3: Verify**

Confirm removed: `Engagement Model`, `Data Scientist Available`, `Funding`, `IRB Status`, `Data Sources`, `Cohort Description`, `AI/ML Goal`.
Confirm added: `Repository`, `Contact`, `Affected Systems/Components`, `Success Criteria`.
Confirm What's Next checklist has 3 generic items.

- [ ] **Step 4: Commit**

```bash
git add Fabric/requests/workflow/default/request-template.md
git commit -m "genericize request-template.md — remove AI/ML-specific fields"
```

---

### Task 5: Update `Fabric/template/fabric-triage.md`

**Files:**
- Modify: `Fabric/template/fabric-triage.md`

Six targeted edits to this file. Read it first, then apply each edit in order.

- [ ] **Step 1: Read the current file**

Read `Fabric/template/fabric-triage.md` to confirm line positions before editing.

- [ ] **Step 2: Edit 1 — Genericize "What's Next Section" at-creation paragraph**

Find and replace:

Old:
```
**At request creation:** Populate with the team's pre-L1 baseline checklist from `request-template.md`, supplemented by AI-generated items for gaps detected in the specific request content. Omit baseline items already answered by the request's field values (e.g., if `IRB Status: Approved`, skip the IRB item).
```

New:
```
**At request creation:** Populate with the team's pre-screening baseline checklist from `request-template.md`, supplemented by AI-generated items for gaps detected in the specific request content. Omit baseline items already answered by the request's field values.
```

- [ ] **Step 3: Edit 2 — Genericize the checklist item example in "During evaluation prep"**

Find and replace:

Old:
```
- When a checklist item is satisfied, propose: *"IRB status is now confirmed. Check off 'Determine IRB status' on R-NNN?"*
```

New:
```
- When a checklist item is satisfied, propose: *"Requestor availability is confirmed. Check off 'Confirm requestor availability' on R-NNN?"*
```

- [ ] **Step 4: Edit 3 — Add Promotion Target section after "What's Next Section"**

After the closing line of `### What's Next Section` (the line `**After evaluation:** The section is replaced based on the outcome by the request-evaluation skill. See that skill for outcome-specific behavior.`) and before `### Blocked Requests`, insert:

```markdown
### Promotion Target

When a request is accepted, the agent reads `Promotion Target` from the workflow's `evaluation.md` to determine what backlog artifact to create:

- **Epic** — proceed with the standard epic promotion flow (see Backlog module)
- **Feature** — proceed with the feature promotion flow (see Backlog module); agent proactively presents active epics for the user to select a parent
- **Either** — agent asks at acceptance time: *"Should this become an Epic or a Feature?"* If Feature is chosen, proceed immediately to the feature promotion flow with the epic list

The `Promotion Target` field is set by the team in their workflow's `evaluation.md`. If the field is absent, treat it as `Either`.

```

- [ ] **Step 5: Edit 4 — Update Blocked Requests cross-reference mention**

Find and replace:

Old:
```
When a request has a `Backlog Epic:` link, a blocker on the request is visible when `/open-questions` is run against either the request or the linked epic — the bridge traversal surfaces both directions.
```

New:
```
When a request has a `Backlog Epic:` or `Backlog Feature:` link, a blocker on the request is visible when `/open-questions` is run against either the request or the linked backlog entity — the bridge traversal surfaces both directions.
```

- [ ] **Step 6: Edit 5 — Update Effort Tracking promotion note**

Find and replace:

Old:
```
When a request is promoted to a backlog epic, display any recorded pre-engagement effort as context:

> "R-NNN has Xh of pre-engagement effort recorded. This stays on the request — it is not transferred to the epic."

The request's `Effort:` and the linked epic's effort are separate costs representing different phases of the engagement.
```

New:
```
When a request is promoted to a backlog epic or feature, display any recorded pre-engagement effort as context:

> "R-NNN has Xh of pre-engagement effort recorded. This stays on the request — it is not transferred to the epic/feature."

The request's `Effort:` and the linked backlog entity's effort are separate costs representing different phases of the engagement.
```

- [ ] **Step 7: Edit 6 — Update Request–Backlog Cross-Reference and Effort Resolution sections**

Find and replace the entire `### Request–Backlog Cross-Reference` and `### Effort Resolution via Linked Epic` sections:

Old:
```
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
```

New:
```
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
```

- [ ] **Step 8: Verify all six edits**

Read `Fabric/template/fabric-triage.md` and confirm:
- No remaining references to "pre-L1 baseline checklist" or "IRB status is now confirmed"
- `### Promotion Target` section is present and correctly placed between `### What's Next Section` and `### Blocked Requests`
- `Backlog Feature:` appears in Blocked Requests, Cross-Reference, and Effort Resolution sections
- `### Effort Resolution via Linked Epic` heading has been renamed to `### Effort Resolution via Linked Backlog Entity`

- [ ] **Step 9: Commit**

```bash
git add Fabric/template/fabric-triage.md
git commit -m "add Promotion Target, Backlog Feature cross-ref, and feature promotion support to fabric-triage"
```

---

### Task 6: Update `Fabric/template/fabric-backlog.md`

**Files:**
- Modify: `Fabric/template/fabric-backlog.md`

- [ ] **Step 1: Read the Relationship to Triage section**

Read `Fabric/template/fabric-backlog.md` from line 278 onward to confirm current content.

- [ ] **Step 2: Replace the Relationship to Triage section**

Find the entire `## Relationship to Triage` section (from `## Relationship to Triage` through the line ending `...the user can immediately begin refinement, breaking it into features and work items.`) and replace it with:

```markdown
## Relationship to Triage

When both Triage and Backlog modules are enabled, an accepted request can be promoted to a backlog epic or feature. The promotion path is driven by the `Promotion Target` field in the request's workflow `evaluation.md`. This is a conversational action — no special command is needed.

### Promoting a request to an Epic

When promoting a request to an epic:

1. **Create the epic** under `backlog/epics/` using the epic template.
2. **Carry forward** the request's description as the epic's description. It can be refined later during backlog breakdown.
3. **Carry forward the External URL** if the request already has one (e.g. an ADO epic link). The backlog epic inherits this link.
4. **Carry forward the Repository** if the request has a `Repository:` field. Copy the value verbatim to the epic's `Repository:` property.
5. **Carry forward Labels** if the request has a `Labels:` field. Copy the value verbatim to the epic's `Labels:` property. Validate each label value against the backlog label schema; flag any mismatches and offer to reconcile before writing.
6. **Link back to the request** in the epic's Related Items section (e.g. "Originated from request R-044").
7. **Write the cross-reference back to the request.** Add or update the `Backlog Epic:` field in the request's header to point to the new epic ID. Include this in the confirmation proposal in step 9.
8. **Do not change the request's triage state.** The request stays in `requests/` as a historical record. Its evaluation status, lifecycle stage, and evaluation data are independent of the backlog.
9. **Confirm before creating.** Propose the epic (title, description, carried-over fields, and the `Backlog Epic:` update to the request) and wait for the user to approve before writing anything.

After promotion, the epic is a normal backlog item — the user can immediately begin refinement, breaking it into features and work items.

### Promoting a request to a Feature

Use this path when the request is feature-scale — it fits within an existing epic rather than warranting a new one.

1. **Scan `backlog/epics/` for Active epics** and present the list to the user. This is proactive — surface what already exists so the user can place the feature correctly and avoid creating unnecessary epics. If the user indicates that none of the existing epics are appropriate, suggest the epic promotion path instead.
2. **User selects the parent epic.**
3. **Carry forward** the request's description as the feature's description. It can be refined later.
4. **Carry forward the External URL**, **Repository**, and **Labels** from the request using the same rules as epic promotion above.
5. **Link back to the request** in the feature's Related Items section (e.g. "Originated from request R-044").
6. **Write the cross-reference back to the request.** Add or update the `Backlog Feature:` field in the request's header to point to the new feature ID. Include this in the confirmation proposal in step 7.
7. **Do not change the request's triage state.**
8. **Confirm before creating.** Propose the feature (title, parent epic, description, carried-over fields, and the `Backlog Feature:` update to the request) and wait for the user to approve before writing anything.

After promotion, the feature is a normal backlog item under its parent epic — the user can immediately begin refinement, breaking it into work items.
```

- [ ] **Step 3: Verify**

Read the updated section and confirm:
- Both `### Promoting a request to an Epic` and `### Promoting a request to a Feature` subsections are present
- The feature promotion flow includes the proactive epic list step (step 1)
- `Backlog Feature:` is the cross-reference field written in the feature flow
- The intro paragraph mentions `Promotion Target` field

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "add feature-level request promotion flow to fabric-backlog"
```

---

### Task 7: Sync `Example/.claude/fabric-triage.md`

**Files:**
- Modify: `Example/.claude/fabric-triage.md`

The Example's `fabric-triage.md` is a deployed copy of the template. Apply the same six edits from Task 5.

- [ ] **Step 1: Read `Example/.claude/fabric-triage.md`**

Confirm it has the same content as the template before editing.

- [ ] **Step 2: Apply all six edits from Task 5**

Apply edits 1–6 in order (same find-and-replace operations as Task 5, steps 2–7).

- [ ] **Step 3: Verify**

Read the file and confirm the same checklist from Task 5 step 8 passes.

- [ ] **Step 4: Commit**

```bash
git add Example/.claude/fabric-triage.md
git commit -m "sync Example fabric-triage with template changes"
```

---

### Task 8: Sync `Example/.claude/fabric-backlog.md`

**Files:**
- Modify: `Example/.claude/fabric-backlog.md`

Apply the same edit from Task 6 to the Example's deployed copy.

- [ ] **Step 1: Read `Example/.claude/fabric-backlog.md` from line 278**

Confirm it has the same `## Relationship to Triage` section as the template.

- [ ] **Step 2: Apply the Relationship to Triage replacement from Task 6 step 2**

Same find-and-replace as Task 6.

- [ ] **Step 3: Verify**

Read the section and confirm the same checklist from Task 6 step 3 passes.

- [ ] **Step 4: Commit**

```bash
git add Example/.claude/fabric-backlog.md
git commit -m "sync Example fabric-backlog with template changes"
```

---

### Task 9: Update `.claude/commands/init.md`

**Files:**
- Modify: `.claude/commands/init.md`

- [ ] **Step 1: Read the init command**

Read `.claude/commands/init.md` and locate the Triage line in the Module-specific directories section (step 2 of Scaffold Steps).

- [ ] **Step 2: Update the Triage copy instruction**

Find and replace:

Old:
```
- If **Triage** enabled: create `requests/workflow/default/` and copy `Fabric/requests/REQUESTS.md` and contents of `Fabric/requests/workflow/default/` if present
```

New:
```
- If **Triage** enabled: create `requests/workflow/default/` and copy `Fabric/requests/REQUESTS.md` and contents of `Fabric/requests/workflow/default/` if present. **Skip workflow files if `requests/workflow/default/` already contains files** — on reinit of an existing instance, workflow files are team-owned and must not be overwritten.
```

- [ ] **Step 3: Verify**

Read the updated section and confirm the reinit guard condition is clear and unambiguous.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/init.md
git commit -m "guard workflow files from reinit overwrite in /init"
```

---

### Task 10: Close GitHub issue

- [ ] **Step 1: Verify all files are committed**

```bash
git log --oneline -10
```

Expected: 8 recent commits covering tasks 2–9.

- [ ] **Step 2: Close issue #14**

```bash
gh issue close 14 --repo ejwinter/TeamFabric --comment "Implemented. Ships evaluation.md, rubric.md, genericized request-template.md, and feature-level promotion flow."
```
