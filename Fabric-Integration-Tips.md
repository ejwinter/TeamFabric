# Fabric Integration Tips

These patterns help engineering teams connect their product repos to a Fabric instance so they can pick up where Fabric's backlog breakdown left off — turning acceptance criteria into implementation plans without bringing Fabric into the product repo's internals.

---

## Pattern 1 — Make your product repo Fabric-aware

Add a convention line to your product repo's `CLAUDE.md` that tells Claude Code where to find the Fabric instance. The recommended convention is a sibling folder:

~~~markdown
## Team Fabric

Our team uses [Fabric](https://github.com/your-org/team-fabric) — a file-based working memory system — to manage our backlog. The Fabric instance is at `../team-fabric`.

Work is organized as:

```
backlog/
  epics/<epic-id>/
    epic.md
    features/<feature-id>/
      feature.md
      workitems/<workitem-id>/
        workitem.md
```

When planning implementation work, read the relevant work item from the Fabric backlog. The `## Acceptance Criteria` section defines scope.
~~~

Any path works, but the sibling convention means every engineer on the team can use the same line verbatim without customization.

This is the only setup required. Claude Code can navigate relative paths and read markdown files across repos.

---

## Pattern 2 — The handoff model

Fabric and your product repo have complementary scopes:

| Layer | Owned by | Contains |
|-------|----------|----------|
| What & Why | Fabric | Epics, features, work items, acceptance criteria, business context |
| How | Product repo | Technical specs, implementation plans, code, tests |

Engineers pick up where Fabric's backlog breakdown ends. A work item's `## Acceptance Criteria` section defines what done looks like — without prescribing how the implementation should work. That boundary is the handoff point.

No changes to Fabric are needed for this model to work.

---

## Pattern 3 — Pull a Fabric story into Backlog.md

**Prerequisite:** [Backlog.md](https://backlog.md) initialized in your product repo (`backlog init`).

Use a single prompt to kick off the workflow:

> "Pull in `../team-fabric/backlog/epics/<epic-id>/features/<feature-id>/workitems/<workitem-id>/workitem.md` as a Backlog.md task and start planning an implementation."

Claude will:

1. Read the Fabric work item — title, description, and acceptance criteria
2. Create a Backlog.md task, mapping fields:
   - Fabric `# Title` → task `title`
   - Fabric `## Description` → task body
   - Fabric `## Acceptance Criteria` → `acceptance criteria` frontmatter list
   - Fabric `External URL` → carried over if present (preserves traceability to ADO, Jira, etc.)
3. Begin implementation planning — using the acceptance criteria as the scope boundary

The Backlog.md task becomes the working document for the engineer. The Fabric work item is the source of truth for scope; the product repo task is the source of truth for how.

---

## Pattern 4 — Keeping Fabric current

Since the Fabric path is reachable from your product repo session, you can edit Fabric work items directly as your understanding evolves — refining acceptance criteria as you learn more during implementation, or closing the work item when the feature ships.

**Remember:** Fabric is its own git repository. Changes made to Fabric files during a product repo session need to be committed there separately:

```bash
cd ../team-fabric
git add backlog/...
git commit -m "close: <work item title>"
```

This keeps the Fabric story current without requiring a separate context switch.

---

## Pattern 5 — Generate management reports from your Fabric data

Fabric's structured markdown is queryable. Once your team is tracking requests, effort, and labels consistently, you can generate rich HTML reports directly from that data — no BI platform, no data pipeline, no export step.

An example of what's possible: an executive engagement portfolio report that reads your requests, follows their linked backlog epics to resolve execution effort, and produces a self-contained HTML file with Chart.js visualizations:

- **KPI cards** — total requests, active engagements, completed, total effort hours
- **Request status by classification** — stacked bar across your label dimensions
- **Effort by service type** — donut chart
- **Monthly effort trend** — stacked bar over the reporting period
- **Classification detail table** — effort per tier with discovery vs. execution breakdown

Invoked as:

~~~
/report executive quarter by=service-tier
~~~

The report is label-driven — the `by=` parameter tells it which label key to use as the classification dimension. The output is a single self-contained HTML file dropped into `output/`.

### What your team needs to configure

Three things in your Fabric `CLAUDE.md` make this work:

**1. A label schema** — define the dimensions that matter to your stakeholders. For example:

~~~markdown
### Labels

- **service-type** — The type of engagement
  - `data-integration` — Data pipeline or ETL work
  - `analytics` — Reporting and dashboard delivery
  - `advisory` — Consultation without a deliverable

- **service-tier** — Engagement size classification
  - `1` — Full study (months, significant scope)
  - `2` — Significant engagement (weeks, defined deliverable)
  - `3` — Focused deliverable (days, narrow scope)
  - `4` — Consultation (hours, advisory only)
~~~

**2. Effort tracking enabled** — turn on the Effort Tracking module so hours are captured as work closes. Once enabled, Fabric prompts for effort on close and rolls it up across the epic → feature → work item hierarchy.

**3. A default classification label** — add an `### Executive Report` subsection to your CLAUDE.md so the report knows which label key to use without requiring `by=` every time:

~~~markdown
### Executive Report
Classification Label: service-tier
~~~

### Why this works

Fabric requests and backlog entities are plain markdown files with consistent field names. The report command traverses `requests/*/request.md`, follows any `Backlog Epic:` links to resolve execution effort, applies the label schema as the classification dimension, and renders everything as Chart.js HTML. There is no schema migration, no ETL, no intermediate store — the working memory *is* the data source.

Teams that log effort consistently and apply labels on intake will find that meaningful reports emerge from normal workflow discipline, not from extra reporting overhead.
