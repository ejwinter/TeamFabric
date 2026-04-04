# Standup — Leo Kim — 2026-04-03

## Yesterday
Finished and shared the schema registry approach doc. Dana gave feedback during the day — she recommends Confluent Schema Registry over AWS Glue given our existing Kafka infrastructure. Makes sense given the ops overhead of Glue at our scale. Marcus hasn't reviewed yet but said he'd get to it today.

## Today
Incorporate Dana's feedback into the approach doc. Wait for Marcus's review — if he approves, I'll start on the schema-registry-integration work item implementation this afternoon. If he has major concerns, will regroup with Dana.

## Blockers
Soft blocker: waiting on Marcus's review. Not urgent — he committed to looking at it today.

## Needs & Questions
- Marcus: schema registry approach doc is in your inbox — Confluent recommendation is Dana-approved, just need your thumbs up on the technical detail.

## Notes
Agent flagged that the Confluent vs. AWS Glue architectural decision is worth capturing on the schema-registry-integration work item for future reference. Added note: `- 2026-04-03 [standup]: Architecture decision — using Confluent Schema Registry over AWS Glue. Rationale: lower ops overhead at current scale given existing Kafka infra. Dana recommended, Marcus to confirm.`
