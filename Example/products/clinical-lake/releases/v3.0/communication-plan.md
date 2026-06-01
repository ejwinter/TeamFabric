# Communication Plan — Clinical Data Lake v3.0

Product: clinical-lake
Release: v3.0
Author: priya.patel@riverdale.org
Last Updated: 2026-05-28
Status: Draft

## Purpose

Coordinate stakeholder communications for the v3.0 release, which adds FHIR R4 support and streaming ingestion to the Clinical Data Lake. Ensures downstream consumers have advance notice and know who to contact with questions or issues.

## Stakeholder Groups

| Group | Description | Key Interest | Preferred Channel |
|-------|-------------|-------------|-------------------|
| Clinical Informatics | Primary consumer for quality measures | FHIR data availability, Patient/Encounter/Observation schema | Slack #clinical-informatics, email |
| Research | De-identified data for IRB studies | FHIR completeness, PHI handling, IRB scope | Email (Sarah Okonkwo) |
| Finance | Cost and utilization data | Assurance that existing feeds are unaffected | Email |
| Data Engineering | Team executing the release | Technical details, on-call escalation path | Slack #data-eng |

## Key Messages

1. Clinical Data Lake v3.0 adds FHIR R4 support — Patient, Encounter, and Observation resources are now available in the Gold layer alongside existing HL7v2 data.
2. Streaming ingestion for ADT events reduces lag from batch (hourly) to near-real-time (< 2 minutes). Existing batch feeds remain active as a fallback.
3. No changes to existing Tableau dashboard data sources or field schemas — existing consumers are unaffected.

## Communication Events

| Event | Audience | Channel | Timing | Owner | Status | Notes |
|-------|----------|---------|--------|-------|--------|-------|
| Advance notice | Clinical Informatics, Research, Finance | Email | 2026-06-21 (1 week before) | Priya | Not Started | Include FHIR field mapping summary; note IRB status for Research |
| Release confirmation | Clinical Informatics | Slack #clinical-informatics | 2026-06-28, post-validation | Priya | Not Started | Confirm FHIR tables available and census unaffected |
| Go-live notification | All groups | Email | 2026-06-28 EOD | Priya | Not Started | Final confirmation, support contact, feedback request |
| Post-release follow-up | Clinical Informatics | Slack | 2026-07-02 | Marcus | Not Started | Check for FHIR data quality concerns |

## Escalation Path

- **Data quality or pipeline issue:** Marcus Chen — Slack DM, then #data-eng
- **Morning census SLA concern:** Priya Patel — Slack DM immediately
- **PHI/IRB question:** Marcus Chen + institutional compliance contact per protocol
- **Finance report discrepancy:** Priya Patel — email

## Feedback Collection

Priya will reach out to Sarah Okonkwo (Clinical Informatics) by 2026-07-05 to ask:
1. Are the FHIR Patient, Encounter, and Observation datasets usable for quality measures?
2. Any data quality, completeness, or timeliness issues?
3. What additional FHIR resource types would be highest priority for v3.1?

## Open Questions

- [ ] Research access to FHIR tables — confirm IRB scope before advance notice is sent *(asked by Priya Patel, 2026-05-28)*

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-05-28 | priya.patel@riverdale.org | Initial draft |
