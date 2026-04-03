# Spec: Executive Engagement Portfolio Report

**Status:** Shelved — ready to implement  
**Motivation:** Dr. Klee (RAIS Director) needs a report showing engagement portfolio health across service types and tier classifications. Example output: `Example/output/executive-report-example.html`

---

## What the Report Produces

A single-file HTML report (placed in `output/`) covering a specified date range. Sections:

1. **KPI cards** — total requests, completed, active engagements, total effort hours
2. **Request status by tier** — horizontal stacked bar; statuses × tiers
3. **Effort by service type** — donut chart; all tiers combined
4. **Monthly effort trend** — stacked bar by service type over the date range
5. **Tier detail table** — requests, active, complete, in-eval, on-hold/declined, total effort, avg effort/request, effort share bar
6. **Service type × tier** — grouped bar showing where effort concentrates by type and engagement size

Invoked as: `/report executive` or `/report executive quarter` (default = last quarter; accepts `month`, `quarter`, `year`, or `YYYY-MM-DD:YYYY-MM-DD`)

---

## Gaps to Close Before Building

Three gaps must be addressed in order. They are independent and can be done in any order.

### Gap 1 — `tier` label schema

Add `tier` to the RAIS label schema in `CLAUDE.md` (team instance) and document it in `request-template.md`.

```markdown
- **tier** — Engagement scope classification
  - `1` — Full study: multi-month, dedicated team effort, formal deliverable
  - `2` — Significant engagement: weeks to months, defined scope
  - `3` — Focused deliverable: days to weeks, bounded output
  - `4` — Consultation: advisory, no artifact deliverable
```

Note: Tier 5 (existing product use) is out of scope for Fabric reporting. If ingested, it can carry the label but the report should filter or footnote it.

AI suggestion behavior: after creating or updating any request, cross-reference description content and offer a `tier=N` suggestion the same way `service-type` is suggested.

### Gap 2 — Label carry-forward on request promotion

When a request is promoted to a backlog epic, the current flow carries forward description and External URL. Extend it to also copy the `Labels:` field from the request entity to the epic.

Change location: `fabric-backlog.md`, section "When promoting a request to an epic", step 3.

Add:
> **Carry forward Labels** if the request has a `Labels:` field. Copy the value verbatim to the epic. Note any labels that are not valid backlog label schema values and offer to reconcile.

### Gap 3 — Effort field on request entities

Requests need an optional `Effort:` field in their Properties section so preliminary evaluation work (triage, L1/L2 consultation before a project is accepted and promoted) can be tracked without requiring a backlog epic.

**Why:** A tier-1 study may consume 20–40h in evaluation before the team decides to take it on. That effort belongs to the request, not the backlog.

**Mechanics:**
- Add `Effort: [Not Set | Nh]` to the request template Properties section (between `Effort Estimate` and `Engagement Model`).
- When a request is closed (declined, withdrawn, or superseded without promotion), prompt for effort the same way the backlog module does on entity close.
- When a request is promoted to an epic, display the request's `Effort:` value and ask whether to roll it into the epic's effort or leave it on the request as pre-engagement cost.

Change location: `Fabric/template/fabric-triage.md` (new behavioral rule block) and `Fabric/backlog/` request template.

---

## Report Data Query Logic

The reporting skill must traverse two data sources and join them on `tier` and `service-type` labels.

### Source 1: Requests

Scan `requests/*/request.md`. For each request, read:
- `Status:` (header field)
- `Submitted:` (header field — use for date range filter)
- `Labels:` (Properties section — extract `tier=N` and `service-type=X`)
- `Effort:` (Properties section — may be absent; treat as 0h for aggregation)

### Source 2: Backlog Epics

Scan `backlog/epics/*/epic.md`. For each epic, read:
- `State:` — map to report status vocabulary (Active → Active, Closed → Complete, etc.)
- `Start Date:` or `Submitted:` — use for date range filter
- `Labels:` — extract `tier=N` and `service-type=X`
- `Effort:` — use short-circuit rollup rule (if epic has Effort, use it; otherwise sum children recursively)

**Deduplication:** If an epic has a linked request (`Backlog Epic:` field on the request entity), the request's pre-engagement effort counts separately; the epic's effort is the execution cost. Do not double-count.

### Status Vocabulary Mapping

| Request status | Report status |
|---------------|---------------|
| New | New |
| In Evaluation | In Evaluation |
| Active / Accepted | Active |
| On Hold | On Hold |
| Complete / Closed | Complete |
| Declined / Withdrawn | Declined |

Backlog epic states map similarly: New → New, Active → Active, Resolved/Closed → Complete, Removed → Declined.

### Monthly Trend

Group effort by calendar month within the date range. For each entity, attribute effort to the month it was closed (or the current month if still active and partially tracked). If no closed date, attribute to submission month as a proxy. This is an approximation — note it in the report footer.

---

## Output File

- Location: `output/executive-report-YYYY-MM-DD.html`
- Self-contained: all CSS and JS inline or from CDN (Chart.js)
- Footer must note: generated by Fabric, data range, date generated, "data sourced from requests/ and backlog/"

Reference implementation: `Example/output/executive-report-example.html`  
That file was hand-crafted with fabricated data to demonstrate the layout and visualizations. Use it as the template when building the real renderer.

---

## Command Definition

Add to `Fabric/.claude/commands/` as `report-executive.md` (or extend the existing `report` command with an `executive` subcommand — prefer extension for consistency with existing `/report` pattern).

**Signature:**
```
/report executive [period]
```

**Period values:**
- `month` — current calendar month
- `quarter` — current calendar quarter
- `year` — current calendar year (default)
- `YYYY-MM-DD:YYYY-MM-DD` — explicit range

**Behavior:**
1. Identify date range from period argument.
2. Scan requests/ and backlog/epics/ as described above.
3. Filter entities by date range using Submitted / Start Date.
4. Compute all aggregations (counts by tier×status, effort by service-type, monthly breakdown, tier totals).
5. Render HTML using the reference layout.
6. Write to `output/executive-report-YYYY-MM-DD.html`.
7. Confirm to user with file path.

---

## Out of Scope (for this spec)

- Tier 5 (existing product use) — no Fabric tracking needed; footnote if label appears
- Per-investigator or per-department breakdowns — future follow-on
- PDF export — browser print handles this adequately
- Push to Confluence / SharePoint — future follow-on
- Real-time / live data — Fabric is a working-memory system, not a BI platform
