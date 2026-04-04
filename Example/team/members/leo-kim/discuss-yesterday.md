# Standup — Leo Kim — 2026-04-02

## Yesterday
Compared notes with Priya on the census alert — her Airflow DAG was firing an hour late due to a timezone mismatch. Once she deployed the fix, the census data freshness restored and the alert cleared. Closed the incident. Spent the rest of the day finishing the first draft of the schema registry research document — comparing Confluent Schema Registry vs. AWS Glue Schema Registry for our Kafka setup.

## Today
Clean up the schema registry approach doc and share it with Marcus and Dana for review. Want their sign-off on the architectural direction before I start writing code.

## Blockers
None.

## Needs & Questions
- Marcus: review my schema registry approach doc once I share it — need your sign-off before starting implementation.
- Dana: quick architectural gut-check would also be appreciated if you have 10 minutes.
