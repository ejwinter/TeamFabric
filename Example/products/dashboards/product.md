# Operational Dashboards

This is how Fabric will understand the project.  Unless asked to it will not dig into other
code or content to find more.  In that context, this should be a fairly detailed guide.

Status: Active
Owners: priya.patel@riverdale.org
Repository: git@github.com:riverdale-health/dashboard-feeds.git

## Status

Data feeds powering Tableau dashboards for hospital operations. 12 active dashboards in production. Last updated 2026-03-20.

## Description

The Operational Dashboards product encompasses the data pipelines and Tableau data sources that power hospital operations reporting. Pipelines transform data from the Clinical Data Lake and operational databases into dashboard-ready datasets published to Tableau Server. Includes census, throughput, staffing, and department KPI dashboards.

## Interactions

- Upstream: Clinical Data Lake (Gold layer), HR systems (staffing data), Bed Management (ADT feeds)
- Downstream: Tableau Server (published data sources), department leadership (consumers)
- Infrastructure: dbt models, Airflow DAGs, Tableau Server

## Stakeholders

- Hospital Operations — daily census and throughput visibility
- Department Directors — KPI tracking and performance reviews
- CNO Office — nursing staffing and patient acuity dashboards

## Fabric Instructions

Dashboard SLAs are strict — morning census must refresh by 6:00 AM. Prioritize incidents affecting refresh schedules.

## Context Log

<!-- Append-only breadcrumb trail. Format:
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference to original artifact]
-->
