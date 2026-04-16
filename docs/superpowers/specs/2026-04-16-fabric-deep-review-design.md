# fabric-deep-review Command — Design Spec

**Date:** 2026-04-16
**Status:** Approved

---

## Overview

`/fabric-deep-review` is a top-level command that audits the TeamFabric framework repo itself — not deployed instances. It sweeps `Fabric/` and `Example/` for technical debt, inconsistencies, Example drift, and token load opportunities, then produces a structured report with diff-format proposals.

The command runs from the TeamFabric root and lives at `.claude/commands/fabric-deep-review.md` alongside `init`, `update`, and `submit-idea`. It is intended to be run periodically by the framework maintainer to keep the repo lean and internally consistent.

---

## Command Interface

```
/fabric-deep-review                      # full review, all 5 categories
/fabric-deep-review --focus=drift        # Example drift only
/fabric-deep-review --focus=consistency  # naming/structure consistency only
/fabric-deep-review --focus=tokens       # token load only
/fabric-deep-review --focus=debt         # technical debt only
/fabric-deep-review --focus=completeness # schema/coverage completeness only
```

No argument is required. When `--focus` is omitted, all five steps run in order.

---

## Review Categories (Steps)

Each step is a discrete named block in the command file with its own scope, enumerated checks, and skip condition.

### Step 1 — `drift`

**Scope:** `Fabric/template/*.md`, `Fabric/backlog/template-*.md` vs `Example/`

**Checks:**
- Each template section present in Example counterpart (by heading name)
- Field names and schema structure match between template and Example entities
- Structural order consistent (sections in same sequence)
- No Example-only sections absent from templates

**Output:** One finding block per gap, diff-format showing template state vs Example state.

---

### Step 2 — `consistency`

**Scope:** All files in `Fabric/.claude/commands/`, `Fabric/.claude/skills/`, `Fabric/template/`

**Checks:**
- Command file naming convention (`kebab-case.md`)
- Skill file naming convention (`kebab-case.md`)
- Heading structure: commands should open with purpose statement, skills with trigger conditions
- `@import` paths in `Fabric/template/CLAUDE.md` resolve to actual files
- Skill registrations listed in `fabric-core.md` match actual skill files present in `Fabric/.claude/skills/`
- Cross-references between commands and skills use consistent names

**Output:** One finding block per violation, diff-format showing current vs proposed correction.

---

### Step 3 — `tokens`

**Scope:** All files in `Fabric/.claude/commands/`, `Fabric/.claude/skills/`, `Fabric/template/`

**Checks:**
- Files exceeding 200 lines — flag and propose trimming candidates within the file
- Prose rules that appear in both a command and the skill it invokes (redundant overlap) — propose removing from the command and deferring to the skill
- Extended worked examples or illustrations that could be shortened without loss of meaning
- Boilerplate preamble sections repeated across multiple files (e.g. identical "how to use this skill" blocks)
- Narrative explanation of behavior that could be expressed as a concise rule

**Output:** One finding block per opportunity, diff-format showing current section vs proposed trimmed version. Each block includes an estimated line reduction.

---

### Step 4 — `debt`

**Scope:** All files in `Fabric/`, `Example/`, `.claude/commands/`

**Checks:**
- Commands that reference a skill by name where no matching file exists in `Fabric/.claude/skills/`
- Skills present in `Fabric/.claude/skills/` but not registered in `fabric-core.md`
- Files in `Fabric/` with no inbound references from any command, skill, or template
- Schema fields defined in `Fabric/backlog/template-*.md` that are absent from `entity-maintenance.md` or `entity-transitions.md`
- Top-level `.claude/commands/` files that reference paths or patterns inconsistent with current repo structure

**Output:** One finding block per issue, diff-format proposal where a fix is mechanical; description-only where human judgment is required.

---

### Step 5 — `completeness`

**Scope:** `Fabric/template/`, `Fabric/.claude/commands/`, `fabric-design-summary.md`, `Example/`

**Checks:**
- Every command that performs multi-step entity work has a corresponding skill
- `fabric-design-summary.md` directory tree reflects the actual current file structure of `Fabric/` and `Example/`
- `Example/` contains no data patterns, fields, or structural features absent from the framework templates
- `Fabric/template/CLAUDE.md` imports list matches the set of `fabric-*.md` template files actually present

**Output:** One finding block per gap, diff-format where the fix is clear, description-only where structural decisions are needed.

---

## Output

### Conversation Summary

Printed at the end of the run, structured as one section per category:

```
## Deep Review Summary — YYYY-MM-DD

### Drift        — N issues (H high, M medium, L low)
- <top finding 1>
- <top finding 2>

### Consistency  — N issues
...

Full report: output/deep-review-YYYY-MM-DD.md
```

### Report File

Written to `output/deep-review-YYYY-MM-DD.md` in the TeamFabric root (`.gitignored`).

```markdown
# Fabric Deep Review — YYYY-MM-DD

## Summary

| Category      | Issues | High | Medium | Low |
|---------------|--------|------|--------|-----|
| Drift         |        |      |        |     |
| Consistency   |        |      |        |     |
| Tokens        |        |      |        |     |
| Debt          |        |      |        |     |
| Completeness  |        |      |        |     |

## Step 1: Drift

### <file-pair label>
**Severity:** high | medium | low
**Issue:** <description>
**Proposal:**
```diff
- before
+ after
```

## Step 2: Consistency
...

## Skipped
<categories not run when --focus was used>
```

Each finding includes a severity tag:
- **high** — likely causes confusion, token waste, or broken behavior
- **medium** — inconsistency or inefficiency that should be addressed
- **low** — polish, minor naming, or style

---

## Command File Structure

The command file uses the existing framework convention of numbered steps. Internal layout:

1. **Preamble** — purpose statement, scope declaration, `--focus` parsing instructions
2. **Step blocks** — one per category, each with: scope, enumerated checks, output format instruction, skip condition
3. **Consolidation step** — write report file to `output/`, print conversation summary

The command is self-contained — it does not invoke any skill. All review logic lives in the command file itself.

---

## What This Command Does Not Do

- It does not modify any files (report + propose only; no auto-fix)
- It does not review deployed instances or team data
- It does not evaluate the quality or correctness of framework *rules* — only structure, consistency, and token efficiency
