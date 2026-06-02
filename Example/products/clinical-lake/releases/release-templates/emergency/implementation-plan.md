# Emergency Implementation Plan — [Release Name] [Version]

Product: clinical-lake
Release: [version]
Author: [email]
Last Updated: [YYYY-MM-DD]
Approved by: [Name — required before proceeding]

## Justification

[1-2 sentences: what urgent pipeline failure, data quality incident, or compliance issue requires an emergency release, and why it cannot wait for the standard release cycle.]

## Approvals Required

<!-- Check off each required approval before proceeding. Do not start implementation without all approvals. -->

- [ ] Marcus Chen (Eng Lead) — approved [YYYY-MM-DD] via [channel]
- [ ] [Additional approver if PHI/IRB change] — approved [YYYY-MM-DD] via [channel]

## Critical Steps Only

| Step | Description | Owner | Status |
|------|-------------|-------|--------|
| 1 | Pause affected Airflow DAGs | [Name] | Not Started |
| 2 | Apply targeted fix | [Name] | Not Started |
| 3 | Validate fix in production (spot check only) | [Name] | Not Started |
| 4 | Re-enable DAGs | [Name] | Not Started |
| 5 | Notify Clinical Informatics via Slack | [Name] | Not Started |

## Rollback Trigger Criteria

Roll back immediately if:
- Fix does not resolve the incident within 30 minutes of deployment
- Error rate increases post-fix
- Morning census refresh is now at risk

## Rollback Steps

| Step | Description | Owner |
|------|-------------|-------|
| 1 | Pause affected DAGs | [Name] |
| 2 | Revert change | [Name] |
| 3 | Notify Marcus Chen and Priya Patel immediately | [Name] |

## Incident Log

<!-- Append a line for each significant event during the release window. -->

- [HH:MM] [Name]: [What happened]

## Post-Release Follow-Up

- [ ] Create a proper backlog work item for root cause analysis — Owner: [Name], Due: [YYYY-MM-DD]
- [ ] Update runbook if this failure type is recurring — Owner: [Name], Due: [YYYY-MM-DD]
- [ ] Notify Finance if cost/utilization data was affected — Owner: [Name], Due: [YYYY-MM-DD]
