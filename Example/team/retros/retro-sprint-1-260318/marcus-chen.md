# Retro Input — Marcus Chen — retro-sprint-1-260318

Submitted: 2026-03-31

## What went well this period?

- Getting the FHIR resource parser scaffold done and reviewed in the same sprint felt good — we moved faster than I expected on that.
- The design doc approach Dana suggested worked. Writing down the consumer pattern before coding it surfaced two edge cases early.
- Priya looped me into the census stream Kafka setup. Good to align on the topic naming conventions before we have two different patterns in production.

## What didn't go well or felt harder than it should have?

- Epic API rate limiting. We have no internal documentation on the throttling limits for the Clarity extract, and I had to open a support ticket and wait two days for a response. This should be documented somewhere the whole team can find it.
- PR review wait time. I had a ready-to-merge fix for the ADT event type mapping sitting for two full days. I understand Dana is loaded but the wait created a context-switching problem for me — I had started on the next task and had to re-orient when it came back.
- The FHIR validation suite work item is too large. It's sitting in the backlog unsplit and nobody wants to pick it up because it's unclear what "done" looks like. Needs to be broken down before next sprint.

## What should we change or improve going forward?

- Document Epic API constraints — rate limits, known unstable fields, deprecation timeline — in Confluence. Reference it from the relevant work items.
- For PRs with clear scope, a 24-hour review SLA would help keep flow. Could be informal at first.
- Split the FHIR validation suite work item into reviewable chunks before sprint planning.

## Action Items

- Document Epic API rate limits and constraints in Confluence. Owner: Marcus
- Split fhir-validation-suite into smaller work items before next sprint planning. Owner: Marcus
