# Riverdale Data Engineering

Name: Riverdale Data Engineering
Parent Organization: Riverdale Health System
Department: Information Services
Mission: Build and maintain data pipelines that make clinical and operational data accessible, reliable, and timely for downstream consumers across the health system.

## Members

<!-- Member details live in team/members/<name>/profile.md -->
<!-- Active user identified by: git config user.email -> match against Email field in member profiles -->

| Name | Role | Allocation | Key Function |
|------|------|-----------|-------------|
| Dana Torres | Tech Lead | 100% | Pipeline architecture, team coordination, code review |
| Marcus Chen | Senior Engineer | 100% | EHR integration pipelines, data quality frameworks |
| Priya Patel | Engineer | 100% | Reporting pipelines, dashboard data feeds |
| Leo Kim | Junior Engineer | 100% | Maintenance, monitoring, on-call rotation |

Total Effective Capacity: 4.0 FTE

Primary Contact: Dana Torres (tech lead, owns intake and prioritization)
On-Call Contact: Leo Kim (primary), Marcus Chen (escalation)

## Products

<!-- Product definitions live in products/<product>/. This is a reference index only. -->

| Product | Path | Status | Description |
|---------|------|--------|-------------|
| Clinical Data Lake | products/clinical-lake/ | Active | Central repository of clinical data sourced from Epic EHR |
| Operational Dashboards | products/dashboards/ | Active | Data feeds powering Tableau dashboards for hospital operations |
| Data Quality Monitor | products/dq-monitor/ | In Development | Automated data quality checks and alerting |

## Knowledge Repositories

| Repository | Location | Purpose |
|------------|----------|---------|
| Team Wiki | Confluence (Data Engineering space) | Runbooks, architecture docs, onboarding |
| Code | GitHub (riverdale-health/data-pipelines) | Pipeline code, dbt models, Airflow DAGs |
| Incident Log | PagerDuty | On-call incidents and postmortems |
| Fabric Repository | This repo | Team working memory, request tracking, context |

## Communication

Meeting Cadence: Daily standup (15 min), weekly planning (1 hr)
Primary Channel: Slack (#data-eng)
Secondary Channel: Email
On-Call Channel: PagerDuty -> Slack (#data-eng-alerts)

## Current State

Active pipeline projects: 2
Requests pending triage: 5
Current incident: None

## Context Log
