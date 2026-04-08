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
