# Communication Plan — [Release Name] [Version]

Product: clinical-lake
Release: [version]
Author: [email]
Last Updated: [YYYY-MM-DD]
Status: Draft | In Review | Approved

## Purpose

Coordinate stakeholder communications for this Clinical Data Lake release. Ensures downstream consumers have advance notice of any schema or data availability changes, and that the team has a clear owner for each touchpoint.

## Stakeholder Groups

| Group | Description | Key Interest | Preferred Channel |
|-------|-------------|-------------|-------------------|
| Clinical Informatics | Primary consumer for quality measures and clinical reporting | Data availability, schema stability | Slack #clinical-informatics, email |
| Research | De-identified data for IRB-approved studies | Data completeness, PHI handling | Email (formal); Slack #research-data |
| Finance | Cost and utilization data | Refresh timing, report accuracy | Email |
| Data Engineering (internal) | Team executing the release | Technical details, rollback criteria | Slack #data-eng |

## Key Messages

1. [Describe what is changing in plain language — what data is new, what changes, what stays the same]
2. When changes take effect and how consumers will know the release is complete
3. Who to contact with questions or to report issues

## Communication Events

| Event | Audience | Channel | Timing | Owner | Status | Notes |
|-------|----------|---------|--------|-------|--------|-------|
| Advance notice | Clinical Informatics, Research, Finance | Email | 5 business days before go-live | [Name] | Not Started | Include schema change summary if applicable |
| Go-live notification | Clinical Informatics, Research, Finance | Slack + Email | Day of release, after validation complete | [Name] | Not Started | Confirm all dashboards refreshing normally |
| Post-release follow-up | Clinical Informatics | Slack | 2 business days after go-live | [Name] | Not Started | Check for any data quality concerns |

## Escalation Path

For urgent issues during or after the release:
- **Data quality or pipeline failure:** Marcus Chen via Slack DM, then #data-eng
- **SLA breach (morning census):** Priya Patel immediately via Slack DM
- **PHI/IRB concern:** Marcus Chen + legal contact per institutional protocol

## Feedback Collection

Reach out to Clinical Informatics 5 business days post-release to ask:
1. Are the new datasets performing as expected?
2. Any issues with data quality, timeliness, or schema?
3. Anything that should be addressed before the next release?

## Open Questions

- [ ] [Question text] *(asked by Name, YYYY-MM-DD)*

## Change Log

| Date | Author | Change |
|------|--------|--------|
| [YYYY-MM-DD] | [Name] | Initial draft |
