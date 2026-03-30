# L1 Screening Rubric

## Purpose
Initial screening of incoming requests. Typically performed by the team lead at the point of intake. This is a quick feasibility and completeness check, not a deep technical evaluation.

## When Used
When a new request is created and needs initial screening before committing team time to a full consultation.

## Criteria

### 1. Request Clarity
**Question:** Is the request clearly stated with an identifiable AI/ML goal?
**Guidance:** The requestor should be able to articulate what they want to predict, classify, detect, or generate. Vague requests ("we want to use AI") need refinement before proceeding.
**Assess as:** Clear / Needs Clarification / Unclear

### 2. Data Availability
**Question:** Does the requestor have or can they identify the data needed?
**Guidance:** They don't need to have data in hand, but they should know what data they need and have a plausible path to getting it. Requests with no data strategy are premature.
**Assess as:** Available / Identified / Unknown

### 3. Cohort Viability
**Question:** Is the described cohort likely large enough for the proposed approach?
**Guidance:** Rule of thumb: supervised learning typically needs hundreds to thousands of labeled examples. Image modeling may need more. Small cohorts (< 100) are a yellow flag, not an automatic rejection.
**Assess as:** Sufficient / Marginal / Insufficient / Unknown

### 4. Investigator Availability
**Question:** Will the requestor or their team be available to collaborate?
**Guidance:** Even full-service engagements need investigator input for domain questions, labeling, and validation. If the investigator is unavailable for months, the engagement will stall.
**Assess as:** Available / Limited / Unavailable / Unknown

### 5. Funding Status
**Question:** Is there funding to support this work?
**Guidance:** Funded requests get priority. Unfunded requests aren't automatically rejected but need a compelling reason to consume team capacity.
**Assess as:** Funded / Unfunded / Unknown

### 6. IRB Status
**Question:** Is there an approved IRB protocol, or is one in progress?
**Guidance:** An approved IRB is not required at L1, but knowing the status helps estimate timeline. Requests requiring new IRB approval will have longer lead times.
**Assess as:** Approved / Pending / Not Required / Unknown

## Outcome Options

- **Advance to L2** — Request is clear enough and viable enough to warrant a team consultation.
- **Needs More Information** — Request is promising but missing key details. Send back to requestor with specific questions.
- **Reject** — Request is clearly outside team scope, infeasible, or inappropriate. Document the reason.
- **Defer** — Request is valid but timing is wrong (e.g., waiting on IRB, data not yet available). Set a follow-up date.
