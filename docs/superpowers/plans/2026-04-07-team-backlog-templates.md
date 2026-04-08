# Team-Defined Backlog Item Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow teams to define reusable backlog item templates that the agent applies automatically when context matches or on explicit request.

**Architecture:** Behavioral rules are added to `fabric-backlog.md` (the authoritative source for all backlog behavior). The `/init` command scaffold gains one new directory. Example templates demonstrate the feature for Riverdale Data Engineering. No new commands or skills — the entire feature is driven by prose rules in `fabric-backlog.md`.

**Tech Stack:** Markdown files only. No code, no executable tests. Verification steps confirm file content by reading.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `Fabric/template/fabric-backlog.md` | Add `## Team Templates` section + Behavioral Rules bullet |
| Modify | `Example/.claude/fabric-backlog.md` | Sync deployed copy with template changes |
| Modify | `.claude/commands/init.md` | Add `backlog/templates/` to Backlog scaffold step |
| Create | `Example/backlog/templates/epic-data-pipeline.md` | Example epic template with child stubs + label matching |
| Create | `Example/backlog/templates/feature-data-pipeline-impl.md` | Example feature template referenced by epic child stub |
| Create | `Example/backlog/templates/feature-reporting-dashboard.md` | Example feature template for reporting work |

---

### Task 1: Add `## Team Templates` section to `Fabric/template/fabric-backlog.md`

**Files:**
- Modify: `Fabric/template/fabric-backlog.md` (insert before `## Behavioral Rules`, around line 216)

- [ ] **Step 1: Insert the `## Team Templates` section**

Find the line `## Behavioral Rules` in `Fabric/template/fabric-backlog.md`. Insert the following block immediately before it (preserving the blank line between sections):

````markdown
## Team Templates

Teams can define custom backlog item templates for recurring patterns — epics or features they create regularly with common structure, pre-set Definition of Done criteria, or standard child items.

### Storage

Team templates live in `backlog/templates/`. Each template is a markdown file following the naming convention `<level>-<name>.md`:

- `epic-<name>.md`
- `feature-<name>.md`
- `workitem-<name>.md`
- `task-<name>.md`

### Template Format

Each template file begins with a metadata comment block, followed by the entity content:

```markdown
<!--
Template: [Display Name]
Applies To: Epic | Feature | Work Item | Task
Suggest When: [Natural language description of when this template fits — used to assess contextual fit]
Labels: [optional — comma-separated key=value pairs]
-->

# [Entity title — replace with actual title]

## Properties
...
```

The content below the comment block is the pre-filled entity. Use the standard entity structure with team-specific defaults already filled in. Leave context-specific fields as `[placeholders]`.

#### Child Stubs

The `## Child Stubs` section is optional. When present, each line defines a child entity to create alongside the parent:

```markdown
## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
- Feature: Validation & Cutover
```

The `[template: <name>]` suffix is optional. When present, the agent loads that template from `backlog/templates/` and uses it as the base for that child. If the referenced template does not exist, warn and fall back to the base framework template for that level — do not block creation. Templates compose: a stub can reference another template that itself has child stubs; the normal propose-and-confirm flow bounds the recursion.

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `Template:` | Yes | Display name shown to the user when suggesting |
| `Applies To:` | Yes | Entity level: `Epic`, `Feature`, `Work Item`, or `Task` |
| `Suggest When:` | Yes | Natural language description the agent uses to assess contextual fit |
| `Labels:` | No | Comma-separated `key=value` pairs; entity or parent must have a matching label for label-based suggestion to trigger |

### Matching & Suggestion

When the user initiates creation of a backlog entity, scan `backlog/templates/` for files at the matching entity level. If the directory does not exist or has no matching files, proceed silently with the base framework template.

For each candidate template, assess fit using two signals:

1. **Natural language match** — read `Suggest When:` and evaluate against the current context: entity title/description, parent entity context (title/description), and conversation details.
2. **Label match** — if the entity being created or its parent already has a label value appearing in the template's `Labels:` field, that amplifies confidence. Label match is a positive signal, not a standalone requirement.

A match is confident when the agent would naturally reach for the template given the context — err toward not suggesting rather than offering weak matches.

**One confident match:**
> "This looks like it might fit the 'Data Pipeline' epic template — it includes a standard Definition of Done and three standard child features. Use it, or start from scratch?"

**Multiple matches:** List them briefly and let the user choose.

**No confident match:** Proceed with base framework template, no mention of templates.

**Explicit use:** If the user names a template directly ("use the data-pipeline template", "create an epic from the reporting template"), apply it without the matching step.

**Discoverability:** If the user asks "what templates do we have?" or "what epic templates are available?", list `backlog/templates/` with each template's display name and `Suggest When:` summary.

### Application

1. Read the template file and strip the comment metadata block — use only the entity content below it.
2. Layer user-provided details (title, description, properties) on top of template content — user-provided values win over `[placeholders]`.
3. Propose the composed entity using the normal backlog creation confirmation flow. List any child stubs in the proposal as items that will also be created.
4. On approval: write the parent entity file first, then process child stubs in order. For stubs with a `[template: <name>]` reference, repeat this application flow for that child.
5. For stubs without a template reference, use the base framework template for that level.

**Label pre-fill:** If the template metadata includes `Labels:`, pre-populate those labels in the entity's Properties section. Still validate against the team's label schema and run the normal post-write label suggestion pass.

**ID generation:** Unchanged — derive slug from user-provided title and propose before writing.

**Scope:** Templates affect only the initial content of the new file. All normal behavioral rules still apply: entity-transitions for state changes, meta mode protection, DoR gap surfacing during refinement.

````

- [ ] **Step 2: Add template-check bullet to `## Behavioral Rules`**

In `Fabric/template/fabric-backlog.md`, find this existing bullet in `## Behavioral Rules`:

```
- When creating any backlog entity (epic, feature, work item, task), generate an ID following the convention in the Entity IDs section above (or the team's custom convention if defined). Propose the generated ID to the user before writing so it can be adjusted.
```

Insert the following new bullet immediately after it:

```
- When creating a backlog entity, check `backlog/templates/` for applicable team templates before drafting. See the Team Templates section for matching, suggestion, and application rules.
```

- [ ] **Step 3: Verify**

Read `Fabric/template/fabric-backlog.md`. Confirm:
- `## Team Templates` section appears between the Labels Rollup paragraph and `## Behavioral Rules`
- The new bullet appears as the second bullet under `## Behavioral Rules`
- The section contains all subsections: Storage, Template Format, Metadata Fields, Matching & Suggestion, Application

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "add Team Templates section to fabric-backlog module"
```

---

### Task 2: Sync changes to `Example/.claude/fabric-backlog.md`

**Files:**
- Modify: `Example/.claude/fabric-backlog.md` (deployed copy of the template — must match)

- [ ] **Step 1: Apply identical changes to the Example copy**

`Example/.claude/fabric-backlog.md` is a copy of `Fabric/template/fabric-backlog.md`. Apply the exact same two changes made in Task 1:

1. Insert the full `## Team Templates` section block (identical text) immediately before `## Behavioral Rules`
2. Add the template-check bullet after the ID-generation bullet in `## Behavioral Rules`:
   ```
   - When creating a backlog entity, check `backlog/templates/` for applicable team templates before drafting. See the Team Templates section for matching, suggestion, and application rules.
   ```

- [ ] **Step 2: Verify**

Read `Example/.claude/fabric-backlog.md`. Confirm the `## Team Templates` section and new bullet are present and match `Fabric/template/fabric-backlog.md` exactly.

- [ ] **Step 3: Commit**

```bash
git add Example/.claude/fabric-backlog.md
git commit -m "sync Example fabric-backlog with Team Templates changes"
```

---

### Task 3: Update `/init` to scaffold `backlog/templates/`

**Files:**
- Modify: `.claude/commands/init.md` (around line 85–89)

- [ ] **Step 1: Add `backlog/templates/` to the Backlog scaffold step**

In `.claude/commands/init.md`, find this block:

```markdown
- If **Backlog** enabled:
  - Create `backlog/epics/`
  - Create `backlog/inbox/` and copy `Fabric/backlog/template-inbox-README.md` as `backlog/inbox/README.md`
  - Copy all `Fabric/backlog/template-*.md` files into `backlog/` (entity templates for new epics, features, work items, tasks, and inbox items)
  - Create `output/.gitkeep` (report output directory — created but gitignored via `.gitignore`)
```

Replace it with:

```markdown
- If **Backlog** enabled:
  - Create `backlog/epics/`
  - Create `backlog/inbox/` and copy `Fabric/backlog/template-inbox-README.md` as `backlog/inbox/README.md`
  - Copy all `Fabric/backlog/template-*.md` files into `backlog/` (entity templates for new epics, features, work items, tasks, and inbox items)
  - Create `backlog/templates/` (empty — team-defined item templates live here; see fabric-backlog.md Team Templates section)
  - Create `output/.gitkeep` (report output directory — created but gitignored via `.gitignore`)
```

- [ ] **Step 2: Verify**

Read `.claude/commands/init.md`. Confirm `backlog/templates/` appears in the Backlog scaffold step between the `template-*.md` copy step and the `output/.gitkeep` step.

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/init.md
git commit -m "add backlog/templates/ to /init Backlog scaffold step"
```

---

### Task 4: Create example templates for Riverdale Data Engineering

**Files:**
- Create: `Example/backlog/templates/epic-data-pipeline.md`
- Create: `Example/backlog/templates/feature-data-pipeline-impl.md`
- Create: `Example/backlog/templates/feature-reporting-dashboard.md`

- [ ] **Step 1: Create the templates directory**

```bash
mkdir -p Example/backlog/templates
```

- [ ] **Step 2: Create `epic-data-pipeline.md`**

Write the following to `Example/backlog/templates/epic-data-pipeline.md`:

```markdown
<!--
Template: Data Pipeline Epic
Applies To: Epic
Suggest When: Use when creating an epic focused on data pipelines, ETL processes, data extraction, data ingestion, or data movement between systems.
Labels: service-type=data-extraction
-->

# [Title]

## Properties

- State: New
- Labels: service-type=data-extraction

## Description

[Describe the pipeline: what data is being moved, from which source systems, to which targets, and why.]

## Related Items

[If this pipeline supports or is driven by another initiative, name it here.]

## Items this depends on

[List any upstream data dependencies, access grants, or platform work required before this can start.]

## Definition of Done

<!-- Implicit: all child features are Closed, Resolved, or Removed.
     Standard completion criteria for data pipeline epics:
-->
- [ ] Pipeline runs cleanly in production for 5+ consecutive days without intervention
- [ ] Data validation checks pass (< 0.1% error rate on record counts and schema conformance)
- [ ] Runbook documented in team wiki (setup, common failure modes, restart procedure)
- [ ] Monitoring and alerting configured (pipeline health, lag, failure notifications)
- [ ] Stakeholder sign-off on data accuracy

## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
- Feature: Validation & Cutover
```

- [ ] **Step 3: Create `feature-data-pipeline-impl.md`**

Write the following to `Example/backlog/templates/feature-data-pipeline-impl.md`:

```markdown
<!--
Template: Data Pipeline Implementation Feature
Applies To: Feature
Suggest When: Use when creating the implementation feature for a data pipeline epic — covers building the extraction, transformation, and load logic.
Labels: service-type=data-extraction
-->

# [Title] — Implementation

## Properties

- Product: [the data platform or service this pipeline is part of]
- State: New
- Labels: service-type=data-extraction

## Description

[Describe the technical implementation scope: extraction logic, transformation rules, load target, scheduling cadence.]

## Acceptance Criteria

- [ ] Extraction logic handles all documented source schemas including edge cases
- [ ] Transformation rules validated against sample data provided by stakeholder
- [ ] Load target (table/dataset) matches agreed schema
- [ ] Pipeline runs on schedule without manual intervention
- [ ] Failures emit alerts within [X] minutes and are logged with sufficient context to diagnose
- [ ] Unit tests cover transformation logic

## Related Items

[Reference the parent epic and any related design documents.]

## Items this depends on

[List dependencies: source system access, schema agreements, infrastructure provisioning.]

## Definition of Done

<!-- Implicit: all child work items are Closed, Resolved, or Removed. -->
- [ ] Code reviewed and merged
- [ ] Pipeline deployed to production environment
- [ ] End-to-end test run validated by a team member against live source data
```

- [ ] **Step 4: Create `feature-reporting-dashboard.md`**

Write the following to `Example/backlog/templates/feature-reporting-dashboard.md`:

```markdown
<!--
Template: Reporting Dashboard Feature
Applies To: Feature
Suggest When: Use when creating a feature for a new report, dashboard, or metric output delivered to stakeholders or end users.
Labels: service-type=reporting
-->

# [Title] — Dashboard / Report

## Properties

- Product: [the reporting platform or BI tool this is delivered through]
- State: New
- Labels: service-type=reporting

## Description

[Describe what this report or dashboard shows, who the audience is, and the business question it answers.]

## Acceptance Criteria

- [ ] All metrics defined in stakeholder agreement are present and correctly calculated
- [ ] Data refreshes on agreed schedule (specify: [hourly / daily / on-demand])
- [ ] Filters and drill-downs work as specified
- [ ] Tested against known reference values provided by stakeholder
- [ ] Accessible to all intended users (permissions confirmed)
- [ ] Mobile-friendly layout (if applicable)

## Related Items

[Reference any upstream data pipeline features this report depends on.]

## Items this depends on

[List data pipeline work items or features that must be complete before this report can be built.]

## Definition of Done

<!-- Implicit: all child work items are Closed, Resolved, or Removed. -->
- [ ] Stakeholder has reviewed and signed off on output
- [ ] Published to production environment and confirmed accessible
- [ ] Any known data caveats or limitations documented in report description
```

- [ ] **Step 5: Verify**

```bash
ls Example/backlog/templates/
```

Expected output:
```
epic-data-pipeline.md
feature-data-pipeline-impl.md
feature-reporting-dashboard.md
```

Read each file and confirm: metadata comment block is present at the top, `Applies To:` matches the entity level, `Suggest When:` is meaningful, `Labels:` is set appropriately, entity content follows the standard framework structure.

Confirm `epic-data-pipeline.md` has a `## Child Stubs` section referencing `feature-data-pipeline-impl` by template name.

- [ ] **Step 6: Commit**

```bash
git add Example/backlog/templates/
git commit -m "add example team backlog templates for Riverdale Data Engineering"
```

---

### Task 5: Final verification

- [ ] **Step 1: Confirm full file map is complete**

```bash
git log --oneline -4
```

Expected: four commits from Tasks 1–4, each scoped to its change.

- [ ] **Step 2: Confirm cross-references are consistent**

Read `Fabric/template/fabric-backlog.md` — confirm `## Team Templates` section is present and the Behavioral Rules bullet references it.

Read `Example/.claude/fabric-backlog.md` — confirm it matches the template version.

Read `.claude/commands/init.md` — confirm `backlog/templates/` appears in the Backlog scaffold step.

Read `Example/backlog/templates/epic-data-pipeline.md` — confirm the child stub references `feature-data-pipeline-impl` and that file exists.

- [ ] **Step 3: Done**

No additional commit needed. All changes are in place.
