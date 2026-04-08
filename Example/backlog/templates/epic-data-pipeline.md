<!--
Template: Data Pipeline Epic
Applies To: Epic
Suggest When: Use when creating an epic focused on data pipelines, ETL processes, data extraction, data ingestion, or data movement between systems.
Labels: service-type=data-extraction
-->

# [Title]

## Properties

- State: New
- Labels: service-type=data-extraction

## Description

[Describe the pipeline: what data is being moved, from which source systems, to which targets, and why.]

## Related Items

[If this pipeline supports or is driven by another initiative, name it here.]

## Items this depends on

[List any upstream data dependencies, access grants, or platform work required before this can start.]

## Definition of Done

<!-- Implicit: all child features are Closed, Resolved, or Removed.
     Standard completion criteria for data pipeline epics:
-->
- [ ] Pipeline runs cleanly in production for 5+ consecutive days without intervention
- [ ] Data validation checks pass (< 0.1% error rate on record counts and schema conformance)
- [ ] Runbook documented in team wiki (setup, common failure modes, restart procedure)
- [ ] Monitoring and alerting configured (pipeline health, lag, failure notifications)
- [ ] Stakeholder sign-off on data accuracy

## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
- Feature: Validation & Cutover
