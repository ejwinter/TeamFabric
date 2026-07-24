# Monitoring Log

### [2026-02-18] Kafka consumer occasionally drops messages under load
- **Reported by:** Leo Kim
- **Urgency:** Medium
- **Description:** During high-throughput windows on the Epic event hub feed, a small number of clinical events don't show up in the consumer's downstream output. No consumer error is logged when it happens.
- **Reproduction attempts:** None on the first sighting — noticed during a routine log review, not caught live.
- **Occurrences:**
  - 2026-02-18 — Leo Kim, noticed a gap in downstream event counts during a high-volume ADT batch; no errors logged.
  - 2026-03-10 — Marcus Chen, same pattern recurred during a scheduled load test; consumer group rebalanced mid-run.
  - 2026-04-01 — Marcus Chen, recurred again in production; ~40 events missing from the output topic with no consumer error.
- **Status:** Promoted — 2026-04-01, see `backlog/epics/ehr-pipeline-modernization/features/streaming-ingestion/workitems/kafka-consumer-message-gaps/workitem.md`

### [2026-04-02] Census dashboard briefly showed a stale count after refresh
- **Reported by:** Priya Patel
- **Urgency:** Low
- **Description:** Right after a scheduled refresh, the real-time census dashboard displayed the prior count for about a minute before updating to the current value.
- **Reproduction attempts:** None — could not reproduce on demand; may be a caching or refresh-timing artifact rather than a data issue.
- **Occurrences:**
  - 2026-04-02 — Priya Patel, noticed during the morning dashboard check; corrected itself without intervention.
- **Status:** Watching
