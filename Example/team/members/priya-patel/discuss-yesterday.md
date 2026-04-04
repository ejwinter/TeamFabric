# Standup — Priya Patel — 2026-04-02

## Yesterday
ED, ICU, and Radiology pipeline logic is scaffolded. Hit a frustrating issue: Airflow DAGs are running but offset by one hour — runs that should fire at 08:00 are executing at 09:00. Suspect a timezone mismatch somewhere in the Airflow environment. Leo also flagged a stale-data alert on the census feed — possibly related.

## Today
Track down the Airflow timezone bug. Leo and I are going to compare notes — his alert might point to the same root cause.

## Blockers
Airflow DAG scheduling offset — suspect `AIRFLOW__CORE__DEFAULT_TIMEZONE` is set to UTC while BigQuery connections expect `America/Chicago`. Need to confirm and fix.

## Needs & Questions
- Marcus or Dana: have either of you seen this Airflow timezone offset before? A quick pointer would save a lot of digging.
