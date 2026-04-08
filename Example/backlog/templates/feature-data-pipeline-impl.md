<!--
Template: Data Pipeline Implementation Feature
Applies To: Feature
Suggest When: Use when creating the implementation feature for a data pipeline epic — covers building the extraction, transformation, and load logic.
Labels: service-type=data-extraction
-->

# [Title] — Implementation

## Properties

- Product: [the data platform or service this pipeline is part of]
- State: New
- Labels: service-type=data-extraction

## Description

[Describe the technical implementation scope: extraction logic, transformation rules, load target, scheduling cadence.]

## Acceptance Criteria

- [ ] Extraction logic handles all documented source schemas including edge cases
- [ ] Transformation rules validated against sample data provided by stakeholder
- [ ] Load target (table/dataset) matches agreed schema
- [ ] Pipeline runs on schedule without manual intervention
- [ ] Failures emit alerts within [X] minutes and are logged with sufficient context to diagnose
- [ ] Unit tests cover transformation logic

## Related Items

[Reference the parent epic and any related design documents.]

## Items this depends on

[List dependencies: source system access, schema agreements, infrastructure provisioning.]

## Definition of Done

<!-- Implicit: all child work items are Closed, Resolved, or Removed. -->
- [ ] Code reviewed and merged
- [ ] Pipeline deployed to production environment
- [ ] End-to-end test run validated by a team member against live source data
