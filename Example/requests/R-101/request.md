# R-101: Sepsis Prediction Model for ICU Patients

Status: In Evaluation
Workflow: default
Submitted: 2026-03-15
Requestor: Dr. Sarah Okonkwo (s.okonkwo@riverdale.org)
Owner: Dana Torres

## Summary

Dr. Okonkwo's research group wants to develop an early warning model for sepsis onset in ICU patients using EHR vitals and lab data. The goal is a model that provides 4-6 hours of lead time before clinical recognition. They have an approved IRB protocol and NIH R01 funding.

## Properties

Priority: Not Set
Target Date: 2026-09-01
Effort Estimate: Not Set
Engagement Model: Not Set

### Requestor Details
Department: Critical Care Medicine
Data Scientist Available: No
Funding: Funded (NIH R01)
IRB Status: Approved (IRB-2026-0142)

### Technical Details
Data Sources: Epic EHR (vitals, labs, nursing assessments, medication administration)
Cohort Description: ICU admissions at Riverdale Medical Center, 2020-2025, estimated ~12,000 encounters
AI/ML Goal: Binary classification — predict sepsis onset 4-6 hours before clinical recognition using time-series EHR features.

## Evaluation

### L1 Screening
Status: Complete
Date: 2026-03-18
Evaluated by: Dana Torres

| Criterion | Assessment | Notes |
|-----------|-----------|-------|
| Request Clarity | Clear | Well-defined prediction target with specific lead time goal |
| Data Availability | Available | All data sources are in Epic, team has existing extraction pipelines |
| Cohort Viability | Sufficient | ~12,000 encounters is strong for this type of model |
| Investigator Availability | Available | Dr. Okonkwo committed to weekly check-ins |
| Funding Status | Funded | NIH R01 |
| IRB Status | Approved | IRB-2026-0142 |

Outcome: Advance to L2
Notes: Strong request. Clear goal, good data situation, funded, IRB in place. Scheduled L2 consultation for March 25.

## Context Log

- 2026-03-15 - Dr. Sarah Okonkwo (s.okonkwo@riverdale.org) via email: Submitted request for sepsis prediction model. Referenced her lab's prior work on manual sepsis screening protocols. Wants to explore ML-based approach.
  Source: [Email, subject: "AI/ML Collaboration - Sepsis Early Warning"]
- 2026-03-18 10:00 - Dana Torres via internal: L1 screening complete. Advancing to L2. Consultation scheduled for March 25 with Marcus and Dana.
- 2026-03-25 14:00 - Dana Torres, Marcus Chen, Dr. Okonkwo via meeting: L2 consultation held. Marcus confirmed data extraction is feasible via existing Clarity pipelines. Discussed time-series feature engineering approach. Dr. Okonkwo can provide clinical labels from chart review her team already completed. Main risk: defining the sepsis onset timestamp consistently.
  Source: [Confluence, meeting notes: "R-101 L2 Consultation"]
