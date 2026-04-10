@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md
@.claude/fabric-backlog.md
@.claude/fabric-standup.md
@.claude/fabric-retro.md

# Riverdale Data Engineering

<!--
  Everything below this line is yours. TeamFabric updates will not touch this section.
  The @imports above load framework behavioral rules from .claude/fabric-*.md files.
  Those files ARE updated when you run /update from the TeamFabric repo.
-->

## How We Work

Request intake and triage process: requests/REQUESTS.md
Default workflow and rubrics: requests/workflow/default/

### Iterations
Iteration Start: 2026-04-01
Iteration Duration: 14 days

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

### Confluence
URL: https://riverdale.atlassian.net/wiki
Team wiki and runbooks. Nudge when ingested content is a reusable procedure,
onboarding step, or operational runbook. Nudge when a retro action item results
in a documented process change.

### GitHub
URL: https://github.com/riverdale-de
Source repositories. Reference only — no local read needed beyond linked repos
on individual requests and epics.

### Internal Docs
Readable: Yes
Writable: Yes
Expect-Local: Yes
URL: https://github.com/riverdale-de/internal-docs
MkDocs site for internal engineering documentation. Read existing pages before
suggesting new ones to avoid duplication. Write draft pages to docs/drafts/ —
team reviews and commits from that repository. Nudge when ingested content
describes environment setup, cross-product patterns, or recurring operational steps.

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
| Standup | Enabled | Daily standup conversations and team summary |
| Retrospective | Enabled | Periodic retros with team summary and action item routing |
