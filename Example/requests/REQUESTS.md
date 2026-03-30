# Requests Module

<!--
  This file defines the request intake and triage process for the team.
  Workflow rubrics and criteria live in requests/workflows/triage/.
  Individual requests live in requests/<request-id>/.
-->

## Request Intake

Data requests come from clinical and operational stakeholders across the health system. Requests are submitted via Slack (#data-eng) or email to Dana Torres.

Entry point: Stakeholder -> Dana Torres
Dana owns triage and prioritization from the point of submission.

## Request Lifecycle

```
Stakeholder submits request (Slack or email)
  -> Dana reviews and creates request entity in Fabric
  -> Team evaluates feasibility and effort
  -> Decision: Accept / Reject / Defer / Needs More Information
  -> If accepted: Assign to engineer, schedule work
  -> Active development
  -> Delivery and handoff
```

## Prioritization

Requests are prioritized based on:
- Clinical impact (patient safety or care quality)
- Operational urgency (regulatory deadlines, leadership requests)
- Effort estimate vs. available capacity
- Dependencies on other in-flight work

Dana makes final prioritization decisions with input from the team during weekly planning.
