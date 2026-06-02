# Implementation Plan — [Release Name] [Version]

Product: clinical-lake
Release: [version]
Author: [email]
Last Updated: [YYYY-MM-DD]
Status: Draft | In Review | Approved

## Purpose

This document covers the deployment steps, validation checkpoints, and rollback procedure for this Clinical Data Lake release. Primary audience: data engineering team members executing the release and the on-call engineer.

## Scope

[What is included in this release from an implementation perspective. Reference features from the release entity's ## Features section.]

## Out of Scope

[What is explicitly not included, to set expectations.]

## Prerequisites

- All targeted Airflow DAGs have been validated in the staging environment
- dbt models compile without errors against the production schema
- ADLS Gen2 storage permissions verified for new datasets
- Epic EHR feed credentials confirmed valid for any new data sources
- Clinical Informatics sign-off on any schema changes affecting downstream consumers

## Implementation Steps

| Step | Description | Owner | Status | Notes |
|------|-------------|-------|--------|-------|
| 1 | Pause scheduled Airflow DAGs affected by this release | [Name] | Not Started | Use Airflow UI; note DAG IDs here |
| 2 | Deploy updated dbt models to production | [Name] | Not Started | `dbt run --select <model-names>` |
| 3 | Run Airflow DAG: [dag-name] | [Name] | Not Started | Monitor for first successful run |
| 4 | Validate row counts and data quality checks | [Name] | Not Started | See Validation section |
| 5 | Re-enable scheduled DAGs | [Name] | Not Started | Verify schedules restored |
| 6 | Notify Clinical Informatics of release completion | [Name] | Not Started | Use Slack #data-eng channel |

## Rollback Plan

**Trigger criteria:** Any of the following warrant immediate rollback:
- Airflow DAG failure rate exceeds 20% in first 2 hours post-release
- Data quality checks fail for Gold layer tables serving Clinical Informatics
- Morning census refresh is at risk of missing 6:00 AM SLA

**Rollback steps:**
1. Pause affected DAGs immediately
2. Revert dbt models to prior version tag: `dbt run --select <model-names> --vars '{"ref": "prior-tag"}'`
3. Notify Marcus Chen and Priya Patel immediately via Slack DM
4. Create a blocker entry on the release entity

## Validation and Testing

- Row counts for Gold layer tables match pre-release baselines (±5% acceptable for dynamic data)
- No new ERROR entries in Airflow task logs for affected DAGs
- Tableau dashboard refresh completes successfully (verify via Tableau Server admin)
- Morning census dataset populated before 5:45 AM if releasing overnight

## Timeline

| Milestone | Target Date | Owner |
|-----------|-------------|-------|
| Staging validation complete | [YYYY-MM-DD] | [Name] |
| Release execution start | [YYYY-MM-DD] | [Name] |
| Validation complete | [YYYY-MM-DD] | [Name] |
| Clinical Informatics notified | [YYYY-MM-DD] | [Name] |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Epic schema change breaks ingestion | Medium | High | Validate in staging against latest Clarity/Caboodle extract |
| Morning census SLA breach | Low | High | Schedule release after 6:00 AM census refresh completes |
| dbt model compile failure on production schema | Low | Medium | Run `dbt compile` against prod credentials before execute step |

## Open Questions

- [ ] [Question text] *(asked by Name, YYYY-MM-DD)*

## Change Log

| Date | Author | Change |
|------|--------|--------|
| [YYYY-MM-DD] | [Name] | Initial draft |
