# Kafka Consumer Message Gaps

## Properties

- State: New
- Type: Bug
- Iteration:
- External URL:
- Assigned to: marcus.chen@riverdale.org
- Labels: service-type=infrastructure, data-domain=clinical

## Description

Consumer occasionally drops messages under sustained load on the Epic event hub feed — roughly 40 clinical events missing from the output topic during the most recent occurrence, with no consumer error logged. Recurred three times since mid-February; appears correlated with consumer group rebalancing during high-throughput windows, but the root cause hasn't been isolated to a specific code path.

## Acceptance Criteria

- Root cause identified for the dropped-message pattern under sustained load
- Fix or mitigation verified against a load test that reproduces the rebalancing condition
- No further gaps observed in production for one full high-volume batch cycle after the fix ships

## Related Items

Promoted from a Monitoring Log entry (`backlog/monitoring.md`) after three occurrences between 2026-02-18 and 2026-04-01. See that entry for the original sighting history.

## Items this depends on

None.

## Definition of Done

<!-- Implicit: all Acceptance Criteria reviewed as met; all child tasks are Closed or Removed.
- [ ] Additional criterion
-->

## Blockers

<!-- Active and resolved blocks on this entity.
     Set Blocked: Yes in Properties when any entry is Active; clear it when all are resolved.
     ### [YYYY-MM-DD] Brief description of the block
     - **Flagged by:** Name
     - **Cause:** [Open question / Dependency / External / Other — be specific; reference the open question or dependency by name if applicable]
     - **Follow-up:** YYYY-MM-DD — [what will happen on that date] (optional — omit if needs immediate attention)
     - **Status:** Active | Resolved — YYYY-MM-DD ([how it resolved])
-->

## Open Questions

- [ ] Is the rebalancing trigger tied to a specific partition assignment strategy, or is it load-general? *(asked by Marcus Chen, 2026-04-01)*

## Decisions

<!-- Structured record of key decisions made on this entity.
     Agent will propose an entry when decision language is detected during ingestion or conversation.
     ### [YYYY-MM-DD] Decision title
     - **Decided by:** Name
     - **Recorded by:** Name or Claude (ingestion)
     - **Options considered:** Option A (rejected: reason), Option B (rejected: reason), chosen option
     - **Rationale:** Why this option was chosen
-->
