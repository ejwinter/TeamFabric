@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md
@.claude/fabric-backlog.md

# Riverdale Data Engineering

<!--
  Everything below this line is yours. TeamFabric updates will not touch this section.
  The @imports above load framework behavioral rules from .claude/fabric-*.md files.
  Those files ARE updated when you run /update from the TeamFabric repo.
-->

## How We Work

Request intake and triage process: requests/REQUESTS.md
Default workflow and rubrics: requests/workflow/default/

### Labels

- **service-type** — The type of service this work relates to
  - `data-extraction` — Work that pulls or transforms data from source systems (e.g. EHR feeds, ADT events)
  - `reporting` — Work that produces dashboards, reports, or operational metrics
  - `api` — Work that exposes or consumes internal or external APIs
  - `infrastructure` — Work related to pipelines, platform reliability, or DevOps

- **data-domain** — The clinical or operational data domain this work operates in
  - `clinical` — Patient care data (FHIR, ADT, clinical events)
  - `operational` — Non-clinical business data (department KPIs, census, access)
  - `platform` — Cross-domain infrastructure with no single domain owner

- **security-sensitive** — boolean — Set to true when this work involves PHI, PII, or requires IRB/compliance review

## Knowledge Repositories

- Confluence: team wiki and runbooks
- GitHub: source repositories
- Shared Drive: project documentation and reports

## Notification Rules

- New request handoff: notify Marcus Chen
- Data quality issues: notify Priya Patel
- Infrastructure changes: notify Dana Torres

## Constraints

- Do not autonomously create or modify data pipeline configurations.
- All client-facing deliverables require review by Marcus before delivery.

## Enabled Modules

| Module | Status | Notes |
|--------|--------|-------|
| Core | Enabled | Team definition, members, constitution, ingestion, queries |
| Triage | Enabled | Request intake, workflows, rubric evaluation |
| Product | Enabled | Product definitions and context |
| Backlog | Enabled | Hierarchical work tracking — epics, features, work items, tasks |
| Effort Tracking | Enabled | Capture actual hours on close, rollup to parent |
| Scrum | Disabled | Team does not follow scrum practices |

## Decision Log

- 2026-03-28: Adopted Fabric as team working memory system. Context: Growing request volume needs structured triage.
