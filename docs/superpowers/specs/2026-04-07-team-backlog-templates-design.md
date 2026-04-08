# Team-Defined Backlog Item Templates — Design Spec

**Date:** 2026-04-07
**Issue:** ejwinter/TeamFabric#17
**Status:** Approved

## Overview

Teams frequently create the same types of backlog items — a data pipeline epic always needs the same Definition of Done, a reporting feature always needs the same acceptance criteria structure, an onboarding epic always spawns the same three child features. This feature lets teams define reusable templates for backlog entities that the agent applies automatically when context matches, or on explicit request.

## Storage & File Format

Templates live in `backlog/templates/` in the team's Fabric instance. This is team-owned data — never touched by `/update-fabric`. The `/init` command creates the empty directory when the Backlog module is enabled. No starter templates are shipped with the framework.

### Naming Convention

```
backlog/templates/<level>-<name>.md
```

Where `<level>` is one of: `epic`, `feature`, `workitem`, `task`. Examples: `epic-data-pipeline.md`, `feature-reporting-dashboard.md`, `workitem-bug-fix.md`.

### File Format

Each template is a single markdown file. A comment block at the top carries metadata; everything below is the pre-filled entity content.

```markdown
<!--
Template: Data Pipeline Epic
Applies To: Epic
Suggest When: Use when creating an epic focused on data pipelines, ETL processes, data extraction, or data movement between systems.
Labels: service-type=data-extraction
-->

# [Title]

## Properties
- State: New
- Priority: [optional]
- Labels: service-type=data-extraction

## Description

[Describe the pipeline's purpose and source/target systems.]

## Definition of Done

- [ ] Pipeline runs cleanly in production for 5+ consecutive days
- [ ] Data validation checks pass (< 0.1% error rate)
- [ ] Runbook documented in team wiki
- [ ] Monitoring and alerting configured

## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
- Feature: Validation & Cutover [template: feature-validation]
```

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `Template:` | Yes | Display name shown to the user when suggesting |
| `Applies To:` | Yes | Entity level: `Epic`, `Feature`, `Work Item`, or `Task` |
| `Suggest When:` | Yes | Natural language description the agent uses to assess contextual fit |
| `Labels:` | No | Comma-separated `key=value` pairs; entity or parent must have a matching label for label-based suggestion to trigger |

### Child Stubs

The `## Child Stubs` section is optional. When present, each line defines a child entity to draft alongside the parent:

```markdown
## Child Stubs

- Feature: Discovery & Requirements
- Feature: Implementation [template: feature-data-pipeline-impl]
```

The `[template: <name>]` suffix is optional. When present, the agent loads that template from `backlog/templates/` and uses it as the base for that child entity. If the referenced template does not exist, the agent warns and falls back to the base framework template for that level — creation is not blocked.

Templates compose: an epic template can reference feature templates, which can themselves reference workitem templates. Recursion is bounded by the normal propose-and-confirm flow — no silent deep-tree expansion.

## Matching & Suggestion Behavior

### When It Triggers

Whenever the user initiates creation of a backlog entity, the agent scans `backlog/templates/` for files at the matching entity level. If the directory does not exist or contains no matching files, the agent proceeds silently with the base framework template.

### Matching Logic

For each candidate template, the agent assesses fit using two signals:

1. **Natural language match** — the agent reads `Suggest When:` and evaluates it against the current context: entity title/description provided by the user, parent entity context (parent epic or feature title/description), and any relevant details from the conversation.

2. **Label match** — if the entity being created or its parent already has a label value that appears in the template's `Labels:` field, that counts as a positive signal. Label match amplifies confidence but is not required on its own.

### Suggestion Output

- **One confident match** → offer it directly:
  > "This looks like it might fit the 'Data Pipeline' epic template — it includes a standard Definition of Done and three standard child features. Use it, or start from scratch?"

- **Multiple matches** → list them, let the user choose:
  > "I have two templates that could fit: 'Data Pipeline' and 'ETL Migration'. Which would you like to use, or start from scratch?"

- **No confident match** → proceed with base framework template, no mention of templates.

### Explicit Use

At any point the user can name a template directly ("use the data-pipeline template", "create an epic from the reporting template") and the agent applies it without the matching step.

### Discoverability

If the user asks "what templates do we have?" or "what epic templates are available?", the agent lists the contents of `backlog/templates/` with each template's display name and `Suggest When:` summary.

## Application Flow

1. The agent reads the template file and strips the comment metadata block — only the entity content below it is used.
2. Any details already provided by the user (title, description, properties) are layered on top of the template content — user-provided values win over template placeholders.
3. The agent proposes the composed entity (title, ID, full content) following the normal backlog creation confirmation flow. Child stubs are listed in the proposal as items that will also be created.
4. User approves. The agent writes the parent entity file first, then processes child stubs in order. Each stub that references a template repeats steps 1–3 for that child.
5. Child stubs without a template reference are created using the base framework template for that level.

### Label Pre-fill

If the template's metadata includes a `Labels:` field, those labels are pre-populated in the entity's Properties section. The agent still validates them against the team's label schema and still runs the normal post-write label suggestion pass — template labels are a starting point, not a bypass of normal label rules.

### ID Generation

Template application does not change ID generation — the agent derives the slug from the user-provided title and proposes it before writing, as normal.

### What Templates Don't Override

Normal behavioral rules still apply in full: entity-transitions skill for state changes, meta mode protection, DoR gap surfacing during refinement. Templates affect only the initial content of the new file.

## Framework Changes Required

### `Fabric/template/fabric-backlog.md`

Add a `## Team Templates` section covering:
- Storage location and naming convention
- Template format (metadata fields, entity content, child stub syntax with optional template references)
- Matching logic (natural language + label signals)
- Suggestion behavior (one match, multiple matches, no match, explicit use, discoverability)
- Application flow

Add one bullet to `## Behavioral Rules`:
> "When creating a backlog entity, check `backlog/templates/` for applicable team templates before drafting. See the Team Templates section for matching, suggestion, and application rules."

### `Fabric/.claude/commands/init.md`

Add `backlog/templates/` to the Backlog module scaffold step. Directory is created empty — no files copied into it.

### `Example/backlog/templates/`

Create 2–3 example templates for Riverdale Data Engineering demonstrating:
- At least one template with child stubs (including a stub with a template reference)
- At least one template with a `Labels:` field for label-based suggestion
- The full range of metadata fields

These serve as living documentation of the feature for framework adopters.

### No Changes To

- `Fabric/backlog/template-*.md` — base framework templates are unchanged
- Existing commands or skills — template logic lives entirely in `fabric-backlog.md` behavioral rules, consistent with how the rest of the module system works
