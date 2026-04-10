# ADT Event Mapping to FHIR Encounter

## Properties

- State: New
- Type: Story
- Iteration: Sprint 2026-09
- External URL:
- Assigned to:

## Description

Lorem ipsum dolor sit amet. Map existing HL7v2 ADT event types (A01, A02, A03, A08) to FHIR Encounter resources with appropriate status transitions. Ut enim ad minim veniam.

## Acceptance Criteria

- Lorem ipsum A01 admit mapped to Encounter.status = in-progress
- Consectetur A03 discharge mapped to Encounter.status = finished
- Sed do eiusmod transfer events update Encounter.location

## Related Items

Depends on: FHIR Resource Parser

## Items this depends on

FHIR Resource Parser must be complete before mapping can be validated.

## Context Log

- 2026-04-01 - Marcus Chen via standup: Discovered FHIR R4 cancelled encounters (status=cancelled) are dropped by current ADT mapper rather than passed through with a flag. Needs handling before validation suite can pass.
