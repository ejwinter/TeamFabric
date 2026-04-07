# R-102: Readmission Risk Dashboard for Heart Failure Patients

Status: New
Workflow: default
Submitted: 2026-03-27
Requestor: Dr. James Whitfield (j.whitfield@riverdale.org)
Owner: Dana Torres

## Summary

Dr. Whitfield wants a dashboard that shows predicted 30-day readmission risk for heart failure patients at discharge. He envisions something the care coordination team could use to prioritize follow-up calls. He has a data scientist on his team but wants help with the modeling approach and infrastructure.

## Properties

Priority: Not Set
Target Date: None
Effort Estimate: Not Set
Engagement Model: Not Set
External: None

### Requestor Details
Department: Cardiology
Data Scientist Available: Yes
Funding: Unknown
IRB Status: Unknown

### Technical Details
Data Sources: Epic EHR (discharge summaries, prior admissions, medications, comorbidities)
Cohort Description: Heart failure patients discharged from Riverdale Medical Center, unknown volume
AI/ML Goal: Predict 30-day readmission risk at point of discharge. Output a risk score for dashboard display.

## Evaluation

## What's Next

Preparing for L1 screening:
- [ ] Confirm data sources are identified and accessible
- [ ] Clarify the AI/ML goal to a specific, evaluable question
- [ ] Determine IRB status
- [ ] Determine funding status
- [ ] Estimate cohort size — volume of heart failure discharges at Riverdale is currently unknown
- [ ] Clarify funding situation with Dr. Whitfield — departmental vs. grant funding affects prioritization

## Context Log

- 2026-03-27 - Dr. James Whitfield (j.whitfield@riverdale.org) via Slack: Asked in #data-eng about building a readmission risk model. Dana asked him to send details via email.
  Source: [Slack, #data-eng, March 27 thread]
- 2026-03-28 - Dr. James Whitfield (j.whitfield@riverdale.org) via email: Sent detailed request. Mentioned his postdoc (Dr. Anil Mehta) has Python/ML experience and could contribute. Unclear on funding — may be departmental or need to secure grant.
  Source: [Email, subject: "Heart Failure Readmission Prediction - Collaboration Request"]
