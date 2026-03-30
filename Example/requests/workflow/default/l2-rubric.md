# L2 Consultation Rubric

## Purpose
In-depth technical evaluation after L1 screening. Performed by the team (or a subset) during or after a consultation with the requestor. This determines whether to accept the engagement and how to staff it.

## When Used
After a request advances past L1 screening. The team meets with the requestor to discuss the request in detail, then evaluates against this rubric.

## Criteria

### 1. Data Quality and Access
**Question:** Can the team access the required data, and is it of sufficient quality?
**Guidance:** Consider: Is the data in a system the team can reach (EHR, data lake, external)? Has anyone reviewed a sample? Are there known quality issues (missingness, inconsistency, labeling problems)? Data access blockers are the #1 cause of engagement delays.
**Assess as:** Good / Acceptable / Concerning / Blocking

### 2. Technical Feasibility
**Question:** Is the proposed AI/ML approach technically feasible given the data and goal?
**Guidance:** Consider: Is the problem well-defined enough for ML? Is the proposed approach (or an alternative) reasonable? Are there known technical risks (class imbalance, temporal leakage, small sample)? It's okay to accept with known risks if the team has mitigation strategies.
**Assess as:** Feasible / Feasible with Risks / Uncertain / Infeasible

### 3. Alignment with Team Capabilities
**Question:** Does the team have the skills and tools to deliver this?
**Guidance:** Consider: Does this require expertise the team has (or can acquire quickly)? Does it need infrastructure the team doesn't have? Is there a team member who could own this? Stretch assignments are fine if there's mentorship capacity.
**Assess as:** Strong Fit / Moderate Fit / Stretch / Outside Capabilities

### 4. Effort Estimate
**Question:** How much team effort will this engagement require?
**Guidance:** Estimate in person-weeks. Consider data preparation, modeling iterations, validation, and handoff. Compare against current capacity. Be honest about uncertainty — a wide range is better than a false precise number.
**Assess as:** [person-weeks estimate or range]

### 5. Capacity Impact
**Question:** Can the team absorb this engagement without unacceptable impact to existing commitments?
**Guidance:** Load current team allocation and active engagements. Consider: Who would be assigned? What would slip? Is the requestor's timeline compatible with realistic availability?
**Assess as:** Absorbable / Tight / Would Require Tradeoffs / No Capacity

### 6. Engagement Model
**Question:** What engagement model is appropriate?
**Guidance:**
- **Full-Service:** Team does the work, investigator provides domain input. Higher team effort.
- **Collaborative:** Investigator has a data scientist; team partners on approach, review, infrastructure. Moderate effort.
- **Advisory:** Team provides guidance, code review, or consultation. Low effort.
The investigator's available resources (from L1) inform this, but the team's assessment of the work's complexity is the deciding factor.
**Assess as:** Full-Service / Collaborative / Advisory

## Outcome Options

- **Accept** — Engagement is feasible, valuable, and the team can staff it. Proceed to staffing and planning.
- **Accept with Conditions** — Engagement is viable but depends on resolving specific issues first (data access, IRB approval, scope reduction). Document the conditions.
- **Needs More Information** — Consultation raised new questions. Schedule follow-up with requestor.
- **Reject** — Engagement is infeasible, outside scope, or cannot be staffed without unacceptable tradeoffs. Document the reason clearly and kindly.
- **Defer** — Engagement is viable but the team can't absorb it now. Set a re-evaluation date.
