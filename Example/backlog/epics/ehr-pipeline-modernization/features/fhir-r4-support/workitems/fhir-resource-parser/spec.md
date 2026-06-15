# FHIR R4 Resource Parser

## Properties

- State: Approved
- Created: 2026-04-10
- Author: Marcus Chen
- Approved By: Priya Patel
- Approved On: 2026-04-14
- Work Item: ./workitem.md

## Context

The EHR Pipeline Modernization epic requires R4-compliant FHIR parsing as the first step toward ingesting clinical data from the new EHR system. Currently the pipeline uses a custom HL7v2 parser with hardcoded field mappings — it cannot consume FHIR bundles at all. This work item is the foundational parser that downstream features (ADT event mapping, Observation routing) will depend on.

See also: Epic `ehr-pipeline-modernization` and Feature `fhir-r4-support`.

## Approach

Build a stateless parser class (`FHIRResourceParser`) that accepts a FHIR R4 bundle or a single resource JSON object and emits a normalized intermediate representation (IR) for downstream pipeline stages.

- Use the `fhirclient` Python library (already in dependencies) for schema validation and resource traversal. Do not write raw JSON path extraction — use the library's resource models.
- Three resource types in scope: `Patient`, `Encounter`, `Observation`. Each gets its own mapping function (`parse_patient`, `parse_encounter`, `parse_observation`) to keep the logic independently testable and easy to extend.
- Output IR is a typed dataclass per resource type, serializable to the pipeline's internal format. Do not couple the IR shape to the downstream database schema — the mapping layer is separate.
- Validation errors (missing required fields, unrecognized resource type) raise `FHIRParseError` with the resource id and error detail. They are not silently swallowed.

## Components Affected

- `src/pipeline/parsers/fhir.py` — new file (the parser implementation)
- `src/pipeline/parsers/__init__.py` — export `FHIRResourceParser`
- `src/pipeline/models/fhir_ir.py` — new file (IR dataclasses: `PatientIR`, `EncounterIR`, `ObservationIR`)
- `tests/unit/parsers/test_fhir.py` — new file (unit tests)
- `tests/fixtures/fhir/` — new directory (sample FHIR bundles for testing)

## Schema Changes

None. The parser produces in-memory IR objects; it does not read or write the database. The downstream mapping layer (a separate work item) owns the schema interaction.

## API Changes

None. The parser is an internal pipeline component with no external API surface.

## UI Changes

None.

## Test Plan

Unit tests covering:
- `parse_patient`: valid Patient resource → correct IR fields; missing `name` → `FHIRParseError`
- `parse_encounter`: valid Encounter → IR; unknown encounter class → `FHIRParseError`
- `parse_observation`: valid Observation with value[x] variants (valueQuantity, valueString, valueCodeableConcept)
- Bundle input: bundle containing multiple resource types parsed in one call
- Unrecognized resource type: `FHIRParseError` raised with resource type in message

Fixtures: use de-identified FHIR R4 samples from the HL7 FHIR specification examples (public domain). Store under `tests/fixtures/fhir/`.

Manual verification: parse a real bundle from the staging EHR environment and confirm IR field values match source data. Marcus to run this before marking the work item closed.

## Out of Scope

- FHIR versions other than R4 (STU3, DSTU2)
- Resource types beyond Patient, Encounter, Observation
- Writing parsed IR to the database (separate work item: `fhir-db-mapping`)
- FHIR terminology validation (CodeSystem/ValueSet lookups)
- Streaming / chunked bundle processing

## Open Questions

- [x] Should we validate resource profiles (e.g., US Core) or just base R4? *(asked by Marcus Chen, 2026-04-10 — resolved 2026-04-12)*

## Decisions

### 2026-04-12 Use base R4 validation only; defer profile validation
- **Decided by:** Priya Patel
- **Recorded by:** Marcus Chen
- **Options considered:** Validate against US Core profiles (rejected: adds `fhir.resources` dependency and significant validation overhead for v1), validate against base R4 only (chosen), skip validation entirely (rejected: risks silently accepting invalid data)
- **Rationale:** The EHR system guarantees base R4 compliance per vendor contract. US Core profile validation can be added as a follow-on once we understand which profiles the vendor actually uses.

## Context Log

- 2026-04-10 09:15 - Marcus Chen (marcus.chen@riverdale.org) via conversation: Initial spec drafted during refinement session. Context section pulled from work item description.
  Source: backlog refinement session, 2026-04-10
- 2026-04-12 14:30 - Priya Patel (priya.patel@riverdale.org) via conversation: Resolved open question on profile validation. Decision recorded above.
  Source: async conversation in Fabric
- 2026-04-14 10:00 - Priya Patel (priya.patel@riverdale.org) via /spec approve: Spec approved. Implementation may begin.
  Source: /spec approve fhir-resource-parser
