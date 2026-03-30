# Requests Module

<!-- 
  This file defines the request intake and triage process for the team.
  Workflow definitions live in requests/workflow/. The default workflow is in requests/workflow/default/.
  Individual requests live in requests/<request-id>/.
-->

## Request Intake

Requests enter through the Atlas Concierge Service, which performs an initial Level 1 screening before handing off to the team. The concierge team does not interact with Fabric directly.

Entry point: Atlas Concierge Service -> Jag Balan
Jag owns the triage process from the point of handoff onward.

## Request Lifecycle

```
Atlas Concierge (L1 Screening)
  -> Jag receives handoff
  -> L2 Consultation (team evaluates with rubric)
  -> Decision: Accept / Reject / Needs More Information
  -> If accepted: Staffing and approach planning
  -> Active engagement
```

## Triage Checkpoints

### L1 Screening (Concierge, upstream of Fabric)

Results are captured on the request entity when Jag creates it in Fabric.
Key L1 data points:
- Estimated cohort size
- Does the investigator have a data scientist (collaborative vs. full-service)
- Investigator availability for the team
- Funding status
- Description of the AI/ML goal
- Existing IRB project (yes/no, protocol number if available)

### L2 Consultation (Team, Fabric-managed)

Jag schedules a consultation with the investigator. The team evaluates using the L2 rubric.
Rubric definition: requests/workflow/default/l2-rubric.md
Key L2 data points:
- Data availability and quality assessment
- Technical feasibility
- Alignment with team capabilities and capacity
- Estimated effort and timeline
- Recommended engagement model (full-service, collaborative, advisory)

### Acceptance Decision

After L2 consultation, Jag makes the accept/reject/defer decision.
Acceptance criteria: requests/workflow/default/acceptance-criteria.md

## Prioritization

<!-- TODO: Define prioritization approach. Current state: informal. -->
No formal prioritization framework is in place. Jag manages prioritization based on team capacity, investigator timelines, and strategic alignment. This is a known gap to address.
