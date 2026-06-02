# Implementation Plan — Clinical Data Lake v3.0

Product: clinical-lake
Release: v3.0
Author: marcus.chen@riverdale.org
Last Updated: 2026-05-28
Status: Draft

## Purpose

This document covers the deployment steps, validation checkpoints, and rollback procedure for the Clinical Data Lake v3.0 release. Primary audience: data engineering team members executing the release and the on-call engineer.

## Scope

- Deploy FHIR R4 parsing layer alongside existing HL7v2 ingestion (Patient, Encounter, Observation resources)
- Deploy Kafka consumer framework and schema registry integration for streaming ADT events
- Validate Gold layer datasets for new resource types

## Out of Scope

- Full FHIR R4 resource set beyond Patient, Encounter, Observation (deferred to v3.1)
- Deprecation of batch ingestion path (remains active as fallback)
- Updates to Tableau dashboards (no schema changes affecting existing feeds)

## Prerequisites

- FHIR R4 parser dbt models validated in staging against latest Clarity extract
- Kafka topics provisioned in Azure Event Hubs (clinical-lake-adm-events)
- Schema Registry populated with ADT event schema v2
- Clinical Informatics sign-off on Patient/Encounter/Observation field mappings
- IRB approval scope confirmed for Research consumers (open question pending)

## Implementation Steps

| Step | Description | Owner | Status | Notes |
|------|-------------|-------|--------|-------|
| 1 | Pause scheduled DAGs: clinical_lake_hl7_ingest, clinical_lake_dbt_gold | Marcus | Not Started | Airflow UI → pause; record pause time |
| 2 | Deploy FHIR dbt models to production | Marcus | Not Started | `dbt run --select fhir_r4_*` |
| 3 | Start Kafka consumer framework (kafka-consumer-clinical-lake) | Dana | Not Started | Docker service on clinical-data-lake-worker-01 |
| 4 | Run validation DAG: clinical_lake_v3_validation | Marcus | Not Started | Monitor for PASSED status on all checks |
| 5 | Re-enable scheduled DAGs | Marcus | Not Started | Verify schedules restored; check first run completes |
| 6 | Validate FHIR Gold layer row counts | Marcus | Not Started | See Validation section |
| 7 | Notify Clinical Informatics | Priya | Not Started | Slack #clinical-informatics; email to Sarah Okonkwo |

## Rollback Plan

**Trigger criteria — roll back immediately if:**
- Kafka consumer error rate exceeds 5% within first hour
- FHIR Gold layer tables show row count deviation > 10% from expected baseline
- Morning census dashboard fails to refresh by 6:00 AM (Priya owns this SLA)

**Rollback steps:**
1. Stop Kafka consumer service on clinical-data-lake-worker-01
2. Pause clinical_lake_dbt_gold DAG
3. Revert FHIR dbt models: `dbt run --select fhir_r4_* --vars '{"rollback": true}'`
4. Re-enable clinical_lake_dbt_gold with prior model version
5. Notify Marcus Chen and Priya Patel immediately via Slack DM
6. Create a blocker entry on `v3.0.md`

## Validation and Testing

- FHIR Patient, Encounter, Observation Gold tables contain records after first Kafka consumer run
- ADT event lag < 2 minutes from Epic feed to Gold layer (check Azure Monitor)
- Row counts for existing HL7v2-based Gold tables unchanged from pre-release baseline
- Tableau dashboard refresh completes (morning census dataset populated before 5:45 AM)
- No ERROR entries in Airflow task logs for clinical_lake_dbt_gold after re-enable

## Timeline

| Milestone | Target Date | Owner |
|-----------|-------------|-------|
| Staging validation complete | 2026-06-20 | Marcus |
| Release execution | 2026-06-28 (Saturday AM) | Marcus, Dana |
| Validation sign-off | 2026-06-28 | Marcus |
| Clinical Informatics notified | 2026-06-28 | Priya |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Kafka consumer throughput insufficient for ADT event volume | Medium | High | Load test in staging with 3× expected event rate before release |
| Epic schema change in Clarity extract breaks FHIR parser | Medium | High | Run full parser validation against latest Clarity snapshot 48h before release |
| IRB approval not confirmed before release date | Medium | Medium | Restrict Research access to FHIR tables until IRB confirmed (feature flag in dbt) |
| Morning census SLA breach if release runs long | Low | High | Schedule release start at 9:00 AM Saturday; census has already refreshed |

## Open Questions

- [ ] IRB approval scope confirmed for Research consumers? *(asked by Marcus Chen, 2026-05-15)*

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-05-28 | marcus.chen@riverdale.org | Initial draft |
