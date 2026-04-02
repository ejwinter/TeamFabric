# Labels Design Spec

**Date:** 2026-04-01  
**Status:** Approved

## Overview

Add a labels system to Fabric that lets teams annotate backlog entities (Epic, Feature, Work Item, Task) and triage requests with structured key=value metadata. Labels support both enumerated values and boolean (tag-style) keys. The team defines valid keys and values in their constitution with descriptions to guide consistent application. Labels roll up through the backlog hierarchy with occurrence counts.

## Label Schema (Constitution)

Teams define their label registry in CLAUDE.md under "How We Work" using a nested list structure. Each key has a description; each enumerated value has its own description. Boolean keys carry their description on the key line — no value sub-items needed.

```markdown
### Labels

- **service-type** — The type of service this work relates to
  - `data-extraction` — Work that pulls data from source systems
  - `reporting` — Work that produces dashboards, reports, or metric outputs
  - `api` — Work that exposes or consumes APIs
  - `infrastructure` — Work related to pipelines, platform, or DevOps

- **security-sensitive** — boolean — Set to true when this work touches sensitive data or has security implications

- **priority-tier** — Business priority separate from numeric priority score
  - `high` — Must ship this quarter
  - `medium` — Important but deferrable
  - `low` — Nice to have
```

`boolean` is a sentinel type — the AI treats those keys as tags and only accepts `true` or `false` as values.

The constitution is the authoritative registry. If a label key or value is not defined there, the AI flags it and suggests the nearest valid option before writing.

## Entity Storage

A `Labels` property is added to all five entity types: Epic, Feature, Work Item, Task, and Request. It appears in the Properties section as a single comma-separated line:

```markdown
- Labels: service-type=data-extraction, security-sensitive=true
```

The property is optional. If no labels are applied, the line is omitted entirely — it is not left as a placeholder. Values are validated against the constitution schema on write.

## AI-Assisted Label Suggestion

After any operation that writes or updates a description or acceptance criteria section (create, refine, ingest), the AI reads those sections, cross-references against the label schema key and value descriptions, and proactively offers specific suggestions:

> "Based on the description, would you like me to add `service-type=data-extraction`?"

One suggestion per label key, offered only when the AI has reasonable confidence from the content. The user confirms or declines each suggestion individually.

## Rollup Behavior

`/rollup-backlog` aggregates labels from all descendants (not just direct children) as part of its standard scan. The result is written as a new line in the Child Summary section:

```markdown
## Child Summary

- Features: 3 (Active: 2, New: 1)
- Labels (rolled up): service-type: data-extraction (5), reporting (2); security-sensitive: true (3)
```

Rules:

- Label rollup is always all-descendants regardless of whether `--deep` is passed — there is no shallow label rollup
- Boolean keys show only the `true` count — `false` occurrences are not reported
- Keys with only a single occurrence still appear (count shown as 1)
- If no descendants have labels, the `Labels (rolled up)` line is omitted

## Files Affected

| File | Change |
| ---- | ------ |
| `Fabric/template/fabric-backlog.md` | Document Labels property, schema format, AI suggestion behavior, rollup behavior |
| `Fabric/template/fabric-triage.md` | Document Labels property on requests |
| `Fabric/backlog/template-epic.md` | Add `Labels:` property |
| `Fabric/backlog/template-feature.md` | Add `Labels:` property |
| `Fabric/backlog/template-workitem.md` | Add `Labels:` property |
| `Fabric/backlog/template-task.md` | Add `Labels:` property |
| `Fabric/.claude/commands/rollup-backlog.md` | Add label aggregation to scan and write steps |
| `Example/.claude/fabric-backlog.md` | Sync copy from template |
| `Example/CLAUDE.md` | Add example label schema under How We Work |
| `Example` backlog entities | Optionally add example labels to illustrate the feature |
