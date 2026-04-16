# TeamFabric Module: Backlog

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Backlog module provides a hierarchical work tracking structure: Epic > Feature > Work Item > Task. This is for teams that break work into structured deliverables. Teams that manage work informally or through external tools do not need this module.

## Directory Structure

```
backlog/
  inbox/
    <item>.md
  epics/
    <epic-id>/
      epic.md
      features/
        <feature-id>/
          feature.md
          workitems/
            <workitem-id>/
              workitem.md
              tasks/
                <task-id>.md
```

Parent-child relationships are implicit via folder nesting. Each entity level contains a markdown file describing the item and a subfolder for its children.

## Entity IDs

Entity IDs are the folder names (or file stems for tasks) used in the backlog directory structure. The default convention is:

```
<2-3-word-slug>-<YYMMDD>
```

- **Slug**: 2–3 lowercase words derived from the entity title, joined by hyphens
- **Date**: creation date in `YYMMDD` format (e.g. `260402` for April 2, 2026)

Examples: `ehr-pipeline-260101`, `fhir-parser-260315`, `access-workflow-260402`

The slug provides enough context to identify the item at a glance; the date suffix makes the ID unique without a central counter. The combination is treated as stable once created — renaming an ID is not required if the title later changes.

When generating an ID, derive the slug from the entity's title (not its parent's). Choose the most distinctive words — avoid filler words like "the", "a", "for". If the title is "Add FHIR R4 Parser", the slug is `fhir-r4-parser` (3 words is fine) and the ID is `fhir-r4-parser-260315`.

The user can always override the generated ID — either by specifying a full ID upfront (e.g. "create a work item with id `auth-token-260402`") or by adjusting the proposed ID before it is written. Accept any valid directory name the user provides.

Teams can override the default convention in the `### Backlog IDs` subsection of "How We Work" in their constitution (CLAUDE.md). Any format is valid as long as it produces valid directory names. When a custom convention is defined there, use it instead of the default.

### Inbox

The `backlog/inbox/` directory is a drop zone for rough work ideas that haven't been classified or placed in the hierarchy yet. Similar to how `staging/` holds raw content for ingestion, inbox holds raw work items for refinement. Inbox items are lightweight — a title, description, and optionally a suggested level (Epic, Feature, Work Item).

Inbox contents are local and transient — they are .gitignored (except the README). Items are removed from the inbox once placed into the hierarchy.

## Entity Hierarchy

Each level represents a different scale of work. The defaults below describe typical usage — teams can refine these definitions, statuses, and properties in the "How We Work" section of their constitution (CLAUDE.md).

### Epic
High-level initiative that can span multiple products and run for months. May originate from an accepted request (Triage module) or be created directly.

Properties:
- State: New | Active | Resolved | Removed | Closed
- External URL: [optional link to an external representation such as ADO url]
- Repository: [optional — git remote URL of the working repository for this engagement, e.g. https://github.com/org/repo]
- Repository Path: [optional — subfolder within the repository where this epic's work lives, relative to repo root without a leading slash, e.g. initiatives/project-name]
- Start Date: [optional]
- Target Date: [optional]
- Duration: [optional]
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
- Effort: [optional, direct hours at the epic level — planning, analysis, or coordination work not captured in child features]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]

Sections: Description, Related Items, Items this depends on, Child Summary

### Feature
Breakdown of an epic into business-facing capabilities, scoped to a single primary product. A feature is generally tied to a product release (though the release may not be known yet) and is on the scale of weeks.

Properties:
- Product: [the product this feature impacts]
- Product Target Release: [optional]
- State: New | Active | Resolved | Removed | Closed
- External URL: [optional link to an external representation such as ADO url]
- Start Date: [optional]
- Target Date: [optional]
- Duration: [optional]
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
- Effort: [optional, direct hours at the feature level — refinement, design, or coordination work not captured in child work items; also used by teams that track at the feature level without breaking down further]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]

Sections: Description, Acceptance Criteria, Related Items, Items this depends on, Child Summary

### Work Item
Breakdown of a feature into assignable implementation work. A work item should take roughly a day to a week to complete.

Work item types:
- **Story** — a user-facing capability or behavior change
- **Request** — work originating from a formal request (e.g. promoted from Triage)
- **Bug** — a defect or unintended behavior that needs to be corrected
- **Support** — planning, coordination, or enabling work that does not directly deliver a product change (e.g. research spike, architecture decision, process definition)

Properties:
- State: New | Active | Resolved | Removed | Closed
- Type: Story | Request | Bug | Support
- Iteration: [optional, named iteration or iteration path]
- External URL: [optional link to an external representation such as ADO url]
- Assigned to: [optional]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Effort: [optional, direct hours at the work item level — review, coordination, or work not captured in child tasks; also used by teams that track at the work item level without breaking down further]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]

Sections: Description, Acceptance Criteria, Related Items, Items this depends on

### Task
Finest-grained unit of work. Each task is its own file under its parent work item. Tasks are measured in hours (typically 0.5–20 hours).

Properties:
- State: New | Active | Closed | Removed
- External URL: [optional link to an external representation such as ADO url]
- Assigned to: [optional]
- Estimated Hours: [optional]
- Remaining Hours: [optional]
- Effort: [optional, direct hours spent on this task]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]

Sections: Description

## External System Linking

Backlog entities can be linked to external work tracking systems (e.g. Azure DevOps) via the External URL property. This provides a reference point for future sync capabilities. The external system is not authoritative — the Fabric backlog files are the working copy.

## Iterations

An iteration is a named time block used to schedule work items. Iterations are referenced by name on work items via the `Iteration:` property — they are not tracked as separate entities in the backlog hierarchy.

Work items may be moved between iterations as priorities shift. This is normal and expected. The `Iteration:` property simply reflects the current plan, not a commitment.

### Configuration

If the team's "How We Work" section in CLAUDE.md contains an `### Iterations` subsection with `Iteration Start` and `Iteration Duration`, iterations are derived automatically:

```markdown
### Iterations
Iteration Start: 2026-04-01
Iteration Duration: 14 days
```

Given those two values and today's date, the current iteration is computed as:

```
n             = floor((today − Iteration Start) / Iteration Duration)
current_start = Iteration Start + n × Iteration Duration
current_end   = current_start + Iteration Duration − 1
name          = YYMMDD-YYMMDD  (e.g. 260401-260414)
```

**Absence of the `### Iterations` subsection means the team does not use fixed iterations.** Do not infer, suggest, or prompt for iteration assignment when the subsection is missing.

### Behavioral Rules

- When the user says "add to current sprint/iteration", compute the current iteration name from today's date and write it to `Iteration:`.
- When the user says "add to next sprint/iteration", compute iteration n+1 and write that name.
- When displaying or suggesting iteration names, always derive them on the fly — never hard-code or cache names.
- During backlog refinement, if an iteration config is present and a work item has no `Iteration:` set, offer to assign it to the current or next iteration as appropriate.

Note: If the Scrum module is enabled, it may extend iterations with ceremonies, velocity tracking, and sprint-level reporting. The Backlog module treats iterations only as a scheduling label.

## Labels

Labels are key=value metadata applied to backlog entities. They let teams classify and filter work by custom dimensions (e.g. service type, domain, priority tier). Teams define their label schema in the `### Labels` subsection of "How We Work" in CLAUDE.md.

### Schema Format

Each key and each enumerated value has a description to guide consistent usage. Boolean keys (value type `boolean`) act as tags — only `true` or `false` are valid values.

```markdown
### Labels

- **service-type** — The type of service this work relates to
  - `data-extraction` — Work that pulls data from source systems
  - `reporting` — Work that produces dashboards, reports, or metric outputs

- **security-sensitive** — boolean — Set to true when this work touches sensitive data
```

### Storage

Labels are stored on an entity as a single property line:

```
- Labels: service-type=data-extraction, security-sensitive=true
```

The line is omitted when no labels are applied — do not leave it blank or as a placeholder.

### AI-Assisted Suggestion

After any operation that writes or updates a description or acceptance criteria section (create, refine, ingest), read those sections and cross-reference against the label schema key and value descriptions. Offer specific suggestions proactively:

> "Based on the description, would you like me to add `service-type=data-extraction`?"

One suggestion per label key. Only suggest when confident from the content. The user confirms or declines each suggestion individually.

### Rollup

`/rollup-backlog` aggregates labels from all descendants (not just direct children) and writes a `Labels (rolled up)` line to the Child Summary section. See the `/rollup-backlog` command definition for aggregation details.

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

````markdown
<!--
Template: [Display Name]
Applies To: Epic | Feature | Work Item | Task
Suggest When: [Natural language description of when this template fits — used to assess contextual fit]
Labels: [optional — comma-separated key=value pairs]
-->

# [Entity title — replace with actual title]

## Properties
...
````

The content below the comment block is the pre-filled entity. Use the standard entity structure with team-specific defaults already filled in. Leave context-specific fields as `[placeholders]`.

#### Child Stubs

The `## Child Stubs` section is optional. When present, each line defines a child entity to create alongside the parent:

````markdown
## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
- Feature: Validation & Cutover
````

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

## Behavioral Rules

- The statuses, types, and scoping definitions above are defaults. Teams can override any of these in the "How We Work" section of their constitution (CLAUDE.md). When custom values are defined there, use those instead of the defaults.
- When creating any backlog entity (epic, feature, work item, task), generate an ID following the convention in the Entity IDs section above (or the team's custom convention if defined). Propose the generated ID to the user before writing so it can be adjusted.
- When creating a backlog entity, check `backlog/templates/` for applicable team templates before drafting. See the Team Templates section for matching, suggestion, and application rules.
- Backlog entity **structure** is protected by meta mode: removing, renaming, or re-scoping epics and features requires meta mode. Creating new backlog entities, state transitions on features, and Child Summary section updates are **not** structural — they do not require meta mode, consistent with how `/transition` already treats work items.
- When creating a new feature, check if it should reference an existing product (if Product module is enabled).
- Status rollup: when all child entities are complete, suggest updating the parent's status.
- Do not create backlog entities autonomously. Propose the entity and wait for confirmation.
- State changes on backlog entities should invoke the `entity-transitions` skill. Do not directly update `State:` without running the appropriate transition path (blocker/question checks for activation; acceptance criteria review for close; dependent scan for removal).
- When `entity-transitions` writes a terminal state (Closed or Removed), it also writes `Terminated: <today>` to the entity's Properties block. This date is used by `/clean-fabric` to calculate retention eligibility.
- Children inherit context from their parent through folder nesting. A work item inherits the scope of its parent feature, which inherits from its parent epic.
- When writing a label value, validate it against the team's label schema in CLAUDE.md. If the value is not listed, flag it and suggest the nearest valid option before writing. If no schema is defined, accept any key=value pair.
- After writing or updating a description or acceptance criteria, cross-reference the content against the label schema descriptions and proactively offer label suggestions. One suggestion per key, only when confident.
- `Size:` is a relative estimate for backlog prioritization. Do not infer or suggest values — only set it when the user provides one.
- When an epic has `Repository:` set, the repo is expected as a sibling folder next to the Fabric instance, named after the repository slug (e.g. `https://github.com/org/sepsis-model` → `../sepsis-model`). When the user asks about implementation status, code structure, recent commits, or technical details for that epic, check whether the sibling folder exists and read from it on request. Do not read the repo proactively on every query. If the folder is absent, surface this clearly: "This epic has a linked repository (github.com/org/repo) but it isn't cloned locally." When `Repository Path:` is also set, scope all repo reads to `<sibling-folder>/<repository-path>` and filter git log operations with `-- <repository-path>` to limit commits to those touching that path.

Classification, inbox refinement, assignment recommendations, and reclassification guidance are in the backlog-refinement skill.

## Effort Tracking

Effort tracking captures actual hours spent on backlog work. It is distinct from `Estimated Hours` and `Remaining Hours` (task-only planning fields) and represents a historical record of work done. Teams opt in via the `Effort Tracking` module flag in their constitution.

When Effort Tracking is **disabled** (or absent): no effort prompts on close, `Effort:` field not added to new entities, effort column omitted from Child Summary.

When Effort Tracking is **enabled**: effort can be logged at any time during an entity's lifecycle, not only on close. The `Effort:` field is omitted from the file entirely when no effort has been recorded — same convention as `Labels`.

Effort is **additive across all levels**. The `Effort:` field on any entity records only the direct hours at that level — work done at the epic, feature, work item, or task level respectively. Total effort for a subtree is the sum of all `Effort:` values across the entity and every descendant. No level's effort is a substitute for its children's effort; they represent different phases or types of work.

### Incremental Logging

When a user mentions time spent on a backlog entity in natural language (e.g. "I spent 3 hours on the FHIR parser today", "log 1.5h to the auth work item"), recognize this as an effort entry and propose updating the entity's `Effort:` field:

- If `Effort:` is absent or not set: propose setting it to the logged amount.
  > "Logging 3h to 'fhir-r4-parser-260315'. Set Effort to 3h? (confirm or skip)"
- If `Effort:` already has a value: propose incrementing it.
  > "Logging 3h to 'fhir-r4-parser-260315'. Current effort is 12h — update to 15h? (confirm, enter different total, or skip)"

Always present the running total, not just the increment. The user confirms or adjusts before anything is written. Skipping is always valid.

The entity does not need to be active or open to receive an effort log. Effort can be added after the fact if the user forgot to record it at the time.

### Close Prompts

On close, ask about direct effort at this level — work the person did that is not captured in child entities. Always show children's effort total as context so the user can see the full picture.

**Direct effort already accumulated at this level:**
> "Closing '[title].' Direct effort at this level: Xh. Children total: Yh. Confirm direct effort, adjust, or skip?"

**No direct effort at this level, children have effort:**
> "Closing '[title].' Children total: Xh. Any direct effort at this level (planning, coordination, review)? (Enter hours or skip)"

**No direct effort at this level, no children have effort:**
> "Closing '[title].' How many hours? (Enter a number or skip)"

Children total shown in the prompt is computed by summing `Effort:` values across all descendants recursively. Skipping is always valid — effort is never required.

### Effort Rollup Rule

Total effort for any entity = its own `Effort:` value (if set) + the sum of `Effort:` values across all descendants recursively.

Every level's effort is additive. An epic with 8h of direct planning effort and features totaling 40h has 48h total. No level's effort overrides or replaces its children's — they represent work done at different stages of the engagement.

## Relationship to Triage

When both Triage and Backlog modules are enabled, an accepted request can be promoted to a backlog epic or feature. The promotion path is driven by the `Promotion Target` field in the request's workflow `evaluation.md`. This is a conversational action — no special command is needed.

### Promoting a request to an Epic

When promoting a request to an epic:

1. **Create the epic** under `backlog/epics/` using the epic template.
2. **Carry forward** the request's description as the epic's description. It can be refined later during backlog breakdown.
3. **Carry forward the External URL** if the request already has one (e.g. an ADO epic link). The backlog epic inherits this link.
4. **Carry forward the Repository** if the request has a `Repository:` field. Copy the value verbatim to the epic's `Repository:` property. If the request also has a `Repository Path:` field, carry that forward as well.
5. **Carry forward Labels** if the request has a `Labels:` field. Copy the value verbatim to the epic's `Labels:` property. Validate each label value against the backlog label schema; flag any mismatches and offer to reconcile before writing.
6. **Link back to the request** in the epic's Related Items section (e.g. "Originated from request R-044").
7. **Write the cross-reference back to the request.** Add or update the `Backlog Epic:` field in the request's header to point to the new epic ID. Include this in the confirmation proposal in step 9.
8. **Do not change the request's triage state.** The request stays in `requests/` as a historical record. Its evaluation status, lifecycle stage, and evaluation data are independent of the backlog.
9. **Confirm before creating.** Propose the epic (title, description, carried-over fields, and the `Backlog Epic:` update to the request) and wait for the user to approve before writing anything.

After promotion, the epic is a normal backlog item — the user can immediately begin refinement, breaking it into features and work items.

### Promoting a request to a Feature

Use this path when the request is feature-scale — it fits within an existing epic rather than warranting a new one.

1. **Scan `backlog/epics/` for Active epics** and present the list to the user. This is proactive — surface what already exists so the user can place the feature correctly and avoid creating unnecessary epics. If the user indicates that none of the existing epics are appropriate, suggest the epic promotion path instead.
2. **User selects the parent epic.**
3. **Carry forward** the request's description as the feature's description. It can be refined later.
4. **Carry forward the External URL**, **Repository**, **Repository Path**, and **Labels** from the request using the same rules as epic promotion above.
5. **Link back to the request** in the feature's Related Items section (e.g. "Originated from request R-044").
6. **Write the cross-reference back to the request.** Add or update the `Backlog Feature:` field in the request's header to point to the new feature ID. Include this in the confirmation proposal in step 8.
7. **Do not change the request's triage state.**
8. **Confirm before creating.** Propose the feature (title, parent epic, description, carried-over fields, and the `Backlog Feature:` update to the request) and wait for the user to approve before writing anything.

After promotion, the feature is a normal backlog item under its parent epic — the user can immediately begin refinement, breaking it into work items.

## Commands

| Command | Description |
|---------|-------------|
| /refine | Enter a backlog refinement conversation. Accepts an entity target, inbox item, or request ID. |
| /rollup-backlog | Refresh Child Summary sections on epics and features. |

## Skills

| Skill | Description |
|-------|-------------|
| backlog-refinement | Progressive refinement of backlog items using DEEP principles. Classification, elaboration, splitting, perspective checks, estimation, dependency scanning, assignment, readiness. |
