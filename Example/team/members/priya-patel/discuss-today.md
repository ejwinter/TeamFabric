# Standup — Priya Patel — 2026-04-03

## Yesterday
Found and fixed the Airflow timezone bug — `AIRFLOW__CORE__DEFAULT_TIMEZONE` was set to `UTC` but our BigQuery connections expect `America/Chicago`. One environment variable change and all three department pipelines are running on schedule. Leo's census alert cleared as soon as the fix deployed. Spent the rest of the day wiring up four more departments.

## Today
Finish wiring the remaining departments (Finance, Oncology, Surgery). Add data validation checks to each DAG. Targeting a first full end-to-end run by EOD. Scheduling a DAG structure review with Dana tomorrow morning before promoting to prod.

## Blockers
None.

## Needs & Questions
- Dana: can we schedule 30 minutes tomorrow morning for a DAG structure review before I push to prod?
