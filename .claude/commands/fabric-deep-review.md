# /fabric-deep-review — Framework Repository Audit

## Purpose

Audit the TeamFabric framework repository for technical debt, inconsistencies, Example drift, and token load opportunities. Operates on the TeamFabric repo itself — not deployed instances. Produces a structured report with diff-format proposals.

Run periodically to keep the framework lean and internally consistent.

---

## Usage

```
/fabric-deep-review                      # full review, all 5 categories
/fabric-deep-review --focus=drift        # Example drift only
/fabric-deep-review --focus=consistency  # naming/structure consistency only
/fabric-deep-review --focus=tokens       # token load only
/fabric-deep-review --focus=debt         # technical debt only
/fabric-deep-review --focus=completeness # schema/coverage completeness only
```

All steps run by default. With `--focus`, only the named step runs; all others are recorded as skipped in the report.

---

## Before You Begin

Confirm you are in the TeamFabric root (look for `Fabric/`, `Example/`, `.claude/commands/`). This command must not be run from inside `Example/` or any deployed instance.

Parse the `--focus` flag if present. Store the value as `FOCUS` (or `all` if absent). For each step below, skip it if `FOCUS` is set and does not match the step's name — record it in the report's `## Skipped` section.

---

## Step 1: Drift (`drift`)

**Scope:** `Fabric/template/*.md`, `Fabric/backlog/template-*.md` vs `Example/`

Identify gaps where Example does not reflect the current framework templates.

### Template module files

For each file in `Fabric/template/` that has a counterpart in `Example/.claude/`:

| Template source | Example counterpart |
|----------------|-------------------|
| `Fabric/template/fabric-core.md` | `Example/.claude/fabric-core.md` |
| `Fabric/template/fabric-triage.md` | `Example/.claude/fabric-triage.md` |
| `Fabric/template/fabric-product.md` | `Example/.claude/fabric-product.md` |
| `Fabric/template/fabric-standup.md` | `Example/.claude/fabric-standup.md` |
| `Fabric/template/fabric-retro.md` | `Example/.claude/fabric-retro.md` |
| `Fabric/template/fabric-backlog.md` | `Example/.claude/fabric-backlog.md` |
| `Fabric/template/fabric-source.md` | `Example/.claude/fabric-source.md` |
| `Fabric/template/CLAUDE.md` | `Example/CLAUDE.md` |

For each pair, check:
1. All `##` and `###` headings in the template exist in the Example counterpart (same name, same level)
2. All `##` and `###` headings appear in the same sequence
3. All property field names (lines matching `- Key:` or `Key:` at the start of a line) present in the template appear in the Example counterpart

### Backlog entity templates

For each `Fabric/backlog/template-*.md`, compare its section structure and field names against any existing Example entity of that type under `Example/backlog/`. If no Example entity of that type exists, record that as a low-severity gap.

### Findings format

For each gap found, emit one block:

```
**File pair:** Fabric/template/<name>.md → Example/.claude/<name>.md
**Severity:** high | medium | low
**Issue:** <one-sentence description of the gap>
**Proposal:**
` ` `diff
- <line or section as it appears in Example>
+ <line or section as it should appear, matching template>
` ` `
```

If no gaps are found, emit: `No drift issues found.`

---

## Step 2: Consistency (`consistency`)

**Scope:** `Fabric/.claude/commands/`, `Fabric/.claude/skills/`, `Fabric/template/`

Check structural and naming conventions across the framework.

### Checks

1. **Command file naming** — all files in `Fabric/.claude/commands/` must be `kebab-case.md`. Flag any that deviate.

2. **Skill file naming** — all files in `Fabric/.claude/skills/` must be `kebab-case.md`. Flag any that deviate.

3. **Command heading structure** — each command file should open with `# /command-name — Title` followed by a `## Purpose` section. Flag any that don't follow this pattern.

4. **Skill heading structure** — each skill file should open with `# Skill Name` followed by a `## Purpose` or `## When to Use` section. Flag if missing.

5. **`@import` paths in `Fabric/template/CLAUDE.md`** — each `@.claude/filename.md` line must correspond to an actual file in `Fabric/template/`. List any that don't resolve.

6. **Skill registrations in `fabric-core.md`** — read the skills section of `Fabric/template/fabric-core.md`. For each skill listed by name, confirm a matching file exists in `Fabric/.claude/skills/`. For each file in `Fabric/.claude/skills/`, confirm it is listed in `fabric-core.md`. Flag both directions.

7. **Cross-reference name consistency** — when a command references a skill by name (e.g., "invoke the reporting skill"), confirm the referenced name matches the actual skill filename (without `.md`).

### Findings format

```
**Check:** <check name from list above>
**File:** <path>
**Severity:** high | medium | low
**Issue:** <description>
**Proposal:**
` ` `diff
- <current>
+ <corrected>
` ` `
```

If no issues are found, emit: `No consistency issues found.`

---

## Step 3: Token Load (`tokens`)

**Scope:** `Fabric/.claude/commands/`, `Fabric/.claude/skills/`, `Fabric/template/`

Identify opportunities to reduce token footprint without losing meaning.

### Checks

1. **Files over 200 lines** — for each file exceeding 200 lines, read it and identify specific passages that are candidates for trimming:
   - Narrative explanation that could be expressed as a concise rule
   - Extended worked examples that could be shortened or replaced with a one-line note
   - Rules restated within the same file

2. **Command–skill overlap** — for each command that references a named skill, read both files and identify prose rules that appear in both. The command should defer to the skill; redundant repetition is waste.

3. **Boilerplate repetition** — look for preamble blocks, notes sections, or usage blocks appearing with minor variation across 3+ files. Flag as a consolidation candidate.

4. **Verbose prose rules** — rules expressed in 3+ sentences that could be expressed in 1. Flag the specific passage and propose a tighter rewrite.

### Findings format

```
**File:** <path>
**Severity:** high | medium | low
**Estimated reduction:** ~N lines
**Issue:** <description>
**Proposal:**
` ` `diff
- <current text>
+ <proposed trimmed version>
` ` `
```

If no opportunities are found, emit: `No significant token load issues found.`

---

## Step 4: Technical Debt (`debt`)

**Scope:** All files in `Fabric/`, `Example/`, `.claude/commands/`

Surface structural technical debt: broken references, orphans, schema gaps.

### Checks

1. **Commands referencing missing skills** — for each command in `Fabric/.claude/commands/`, scan for references to skill names. Confirm a matching file exists in `Fabric/.claude/skills/`. Flag any broken references.

2. **Unregistered skills** — list all files in `Fabric/.claude/skills/`. For each, confirm it is registered in `Fabric/template/fabric-core.md`. Flag any absent from the registration.

3. **Orphaned framework files** — scan `Fabric/` for `.md` files (excluding `backlog/template-*.md`, `team/members/template/`, and `products/template/`) not referenced by name in any command, skill, or template file. Flag as potentially orphaned.

4. **Template fields absent from skills** — collect all property field names from `Fabric/backlog/template-*.md`. Check `Fabric/.claude/skills/entity-maintenance.md` and `Fabric/.claude/skills/entity-transitions.md`. Flag fields present in templates but not mentioned in either skill.

5. **Top-level command path references** — for each file in `.claude/commands/` (the repo-root commands: `init.md`, `update.md`, `fabric-deep-review.md`), scan for path references and confirm those paths exist in the TeamFabric repo structure.

### Findings format

```
**Check:** <check name>
**File:** <path>
**Severity:** high | medium | low
**Issue:** <description>
**Proposal:**
` ` `diff
- <current>
+ <corrected>
` ` `
[or: "Requires human decision: <what to decide>"]
```

If no debt is found, emit: `No technical debt issues found.`

---

## Step 5: Completeness (`completeness`)

**Scope:** `Fabric/template/`, `Fabric/.claude/commands/`, `fabric-design-summary.md`, `Example/`

Check that the framework is self-consistent and fully described.

### Checks

1. **Command–skill coverage** — for each command in `Fabric/.claude/commands/` that performs multi-step entity operations (reading/writing multiple files, running cascades, maintaining state across multiple entity types), confirm a corresponding skill exists in `Fabric/.claude/skills/`. A skill "corresponds" if its name and stated purpose align with the command's core operation.

2. **Design summary accuracy** — read `fabric-design-summary.md`. For each directory or file mentioned in its structure listing, confirm it exists. For each file that exists in `Fabric/` and `Example/` but is not mentioned in `fabric-design-summary.md`, flag as an undocumented addition.

3. **Example-only patterns** — scan `Example/` for any structural patterns (section headings, field names, directory structures) not present in any template under `Fabric/template/` or `Fabric/backlog/`. Flag as potential forward drift.

4. **Template CLAUDE.md import completeness** — read `Fabric/template/CLAUDE.md`. Confirm every `fabric-*.md` file in `Fabric/template/` appears as an `@import` line (where appropriate — `fabric-init-form.md` and `fabric-source.md` are not meant to be imported). Flag any missing imports and any import lines pointing to non-existent files.

### Findings format

Same as Steps 1–2: diff format where the fix is clear, description-only otherwise.

If no issues are found, emit: `No completeness issues found.`

---

## Step 6: Write Report and Summarize

### Write the report

Create the `output/` directory in the TeamFabric root if it does not exist.

Write the full findings to `output/deep-review-YYYY-MM-DD.md` using today's date.

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

[findings, or "No drift issues found."]

## Step 2: Consistency

[findings, or "No consistency issues found."]

## Step 3: Token Load

[findings, or "No significant token load issues found."]

## Step 4: Technical Debt

[findings, or "No technical debt issues found."]

## Step 5: Completeness

[findings, or "No completeness issues found."]

## Skipped

[List any steps not run due to --focus flag. Omit this section if all steps ran.]
```

### Print conversation summary

After writing the report, print:

```
## Deep Review Summary — YYYY-MM-DD

### Drift          — N issues (N high, N medium, N low)
- [top finding 1]
- [top finding 2]

### Consistency    — N issues (N high, N medium, N low)
- [top finding 1]

### Token Load     — N issues (~NNN lines reduction potential)
- [top finding 1]
- [top finding 2]

### Technical Debt — N issues (N high, N medium, N low)
- [top finding 1]

### Completeness   — N issues (N high, N medium, N low)
- [top finding 1]

Full report: output/deep-review-YYYY-MM-DD.md
```

List only the top 2–3 most impactful findings per category. If a category was skipped, show `— skipped (--focus=<other-name>)`.

---

## Notes

- This command operates on the TeamFabric framework repo only. Never run it from inside `Example/` or a deployed instance.
- The `output/` directory at the TeamFabric root is gitignored. Reports are ephemeral.
- Do not modify any files. This command reads and reports only.
- Do not commit automatically. The user commits.
