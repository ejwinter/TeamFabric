<!--
Template: Reporting Dashboard Feature
Applies To: Feature
Suggest When: Use when creating a feature for a new report, dashboard, or metric output delivered to stakeholders or end users.
Labels: service-type=reporting
-->

# [Title] — Dashboard / Report

## Properties

- Product: [the reporting platform or BI tool this is delivered through]
- State: New
- Labels: service-type=reporting

## Description

[Describe what this report or dashboard shows, who the audience is, and the business question it answers.]

## Acceptance Criteria

- [ ] All metrics defined in stakeholder agreement are present and correctly calculated
- [ ] Data refreshes on agreed schedule (specify: [hourly / daily / on-demand])
- [ ] Filters and drill-downs work as specified
- [ ] Tested against known reference values provided by stakeholder
- [ ] Accessible to all intended users (permissions confirmed)
- [ ] Mobile-friendly layout (if applicable)

## Related Items

[Reference any upstream data pipeline features this report depends on.]

## Items this depends on

[List data pipeline work items or features that must be complete before this report can be built.]

## Definition of Done

<!-- Implicit: all child work items are Closed, Resolved, or Removed. -->
- [ ] Stakeholder has reviewed and signed off on output
- [ ] Published to production environment and confirmed accessible
- [ ] Any known data caveats or limitations documented in report description
