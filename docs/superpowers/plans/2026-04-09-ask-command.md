# /ask Command Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `/ask` cross-entity natural-language query command, which scans the instance's structured knowledge and returns a cited, conflict-aware answer.

**Architecture:** Three new files: a command definition (`ask.md`) that handles usage and output format, a skill definition (`query.md`) that owns the retrieval and synthesis logic, and two table row additions to `fabric-core.md` (template and Example copy) to register both. The command delegates all retrieval complexity to the skill, following the existing command/skill separation pattern.

**Tech Stack:** Markdown framework files. No code or test runner — verification steps are structured spec-coverage checks performed by reading the written file against an explicit checklist.

**Spec:** `docs/superpowers/specs/2026-04-09-ask-command-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `Fabric/.claude/commands/ask.md` | Command definition: purpose, usage, examples, output format |
| Create | `Fabric/.claude/skills/query.md` | Retrieval and synthesis logic: seed identification, graph expansion, section loading, Knowledge Repository scan, conflict handling |
| Modify | `Fabric/template/fabric-core.md` | Register `/ask` in Core Commands table; register `query` in Core Skills table |
| Modify | `Example/.claude/fabric-core.md` | Mirror the same table additions to keep the example instance current |

---

## Task 1: Write the `/ask` command file

**Files:**
- Create: `Fabric/.claude/commands/ask.md`

- [ ] **Step 1: Write `Fabric/.claude/commands/ask.md`**

```markdown
# /ask - Cross-Entity Natural-Language Query

## Purpose
Answer natural-language questions by scanning the instance's structured knowledge and returning a cited answer. Every factual claim names the entity and section it came from. Surfaces conflicts using Contextual Authority rules.

This is the counterweight to `/ingest` — people dump content in with ingest, they pull synthesis out with ask.

## Usage

```
/ask [scope] <question> [--deep]
```

- `/ask what have we decided about auth?` — instance-wide, key sections
- `/ask R-42 what's the current status?` — scoped to R-42 and its connected graph
- `/ask ehr-pipeline what did the vendor say about the API timeline?` — scoped, key sections (vendor details likely in Context Log; use `--deep` if not found)
- `/ask R-42 what did the vendor say about the API timeline? --deep` — full content scan on the connected graph

**Scope hint:** any entity ID, folder slug, or name that identifies a starting entity. When a scope is given, retrieval is limited to that entity and its connected graph.

**`--deep`:** extends section loading to include the full Context Log for every entity in the scan. Slower; use when the answer likely lives in ingested notes rather than structured fields.

## Behavior

1. If no scope hint is given, issue the following prompt and then proceed immediately — do not wait for a response:
   > "No scope given — scanning instance-wide. For faster and more precise results, try `/ask [entity] <question>`."

2. Invoke the `query` skill, passing the resolved scope (or "instance-wide") and the question text.

3. Present the output from the `query` skill using the format below.

## Output Format

```
## Answer

[Direct answer, 1–3 sentences. Inline citations in the form *(Entity / Section)*.]

## Sources

- [Entity] / [Section] — [one-line summary of what was found here]
- [Entity] / [Section] — [one-line summary of what was found here]

## Conflicts

**[Topic]:** [Entity A] / [Section] says [X]. [Entity B] / [Section] says [Y].
→ [Entity A] / [Section] carries more authority here ([reason]). Recommend trusting [X], but verify with [person or entity].

## Not found

[If relevant areas came up empty: what was looked for and where it might live instead. Omit this section if nothing was missing.]
```

Omit `## Conflicts` if no conflicts were found. Omit `## Not found` if all relevant areas had content.

If the scanned set was large, append a single line after the output: *"Scanned [N] entities across [M] entity types."*

## Notes
- Read-only. Does not propose or write any entity changes.
- No meta mode required.
- Does not make external calls. Readable Knowledge Repositories (including wiki) defined in CLAUDE.md are in scope when `Readable: Yes` and `Expect-Local: Yes` are set and the local clone is present.
- Not a replacement for `/open-questions` (blockers and unresolved questions) or `/status` (factual team snapshot). Complements both.
```

- [ ] **Step 2: Verify coverage against spec**

Read `Fabric/.claude/commands/ask.md` and confirm each item is present:
- [ ] Usage syntax with `[scope]`, `<question>`, `[--deep]` documented
- [ ] All four usage examples from the spec are present
- [ ] No-scope nudge message matches spec wording exactly and is non-blocking
- [ ] `--deep` behavior described
- [ ] Output format has all four sections: Answer, Sources, Conflicts, Not found
- [ ] Citation format is `*(Entity / Section)*`
- [ ] Read-only / no meta mode noted
- [ ] Knowledge Repository scope noted

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/ask.md
git commit -m "feat: add /ask command definition"
```

---

## Task 2: Write the `query` skill

**Files:**
- Create: `Fabric/.claude/skills/query.md`

- [ ] **Step 1: Write `Fabric/.claude/skills/query.md`**

```markdown
# Skill: Query

## Purpose
Execute the `/ask` retrieval and synthesis pipeline. Scans the instance's structured knowledge, applies Contextual Authority to resolve conflicts, and returns a cited answer ready for the `/ask` output format.

## Retrieval Pipeline

Retrieval runs in four sequential steps.

### Step 1 — Identify seed entities

Extract key terms from the question (nouns, domain words, entity IDs). Scan entity headers and summaries across all entity types in scope:
- `requests/` — request directories
- `backlog/` — epics, features, work items (not tasks)
- `products/` — product files
- `team/members/` — member profiles
- `team/stakeholders/` — stakeholder profiles (when present)

When a scope hint is given, restrict the scan to that entity's directory subtree plus the connected graph (Step 2). For instance-wide queries, walk all entity directories.

Match against: title (the `# ` heading), `Summary:` field, and `## Properties` section. Select all entities with meaningful term overlap — err liberal at this stage. A false positive costs one section load; a false negative loses a citation.

Use the header-only scanning technique from the `entity-maintenance` skill: read only the block before the first `##` heading unless section content is needed.

### Step 2 — Expand via connected graph

For each seed entity, walk its connected graph. This mirrors the `/open-questions` scoped-mode expansion:

- **Ancestors** — walk up the backlog hierarchy: work item → feature → epic
- **Descendants** — walk down: epic → features → work items
- **Dependencies** — follow each entry in `## Items this depends on`
- **Request↔Epic bridge** — if the entity is a request with a `Backlog Epic:` field, follow to the epic and include its full subtree (features, work items); if the entity is a backlog item whose `## Related Items` references an originating request (e.g., "Originated from request R-NNN"), include that request

Deduplicate: an entity reached via multiple traversal paths is loaded once.

### Step 3 — Load sections

For each entity in the expanded set, load:
- Header / summary block
- `## Properties`
- `## Decisions`
- `## Open Questions`

With `--deep`: also load the full `## Context Log`.

### Step 4 — Knowledge Repository scan

After entity traversal, check the `## Knowledge Repositories` section of CLAUDE.md. For each repository where `Readable: Yes` and `Expect-Local: Yes` are set:

1. Apply the local path resolution rule from `fabric-core.md` to find the sibling directory.
2. If the directory is present and the question's key terms suggest the repository is relevant, read from it.
3. Cite using the repository name: *(Team Wiki / [page or section])*.
4. If the directory is not present, skip silently — do not surface a warning during a query operation.

Only read a repository when it would materially improve the answer. Do not read every repository for every query.

## Synthesis

### Answering

Synthesize a direct answer in 1–3 sentences. Every factual claim must be backed by at least one citation in the form *(Entity / Section)*.

Do not invent or interpolate. If the scanned content does not contain an answer, say so explicitly and suggest where the answer might live (e.g., "not found in Fabric — may be in the team wiki or an external system").

### Conflict Detection and Resolution

When two sources make contradictory claims about the same fact:

1. **Surface both:** show each claim with its source citation.
2. **Apply Contextual Authority** (defined in `fabric-core.md`): determine which source carries more authority for this specific question, using expertise, role, domain proximity, and stakeholder interest signals.
3. **Recommend:** state which source to trust and why.
4. **Flag ambiguity:** if authority is genuinely ambiguous (two sources with equal standing), state that explicitly and mark it as a judgment call requiring human resolution rather than proposing a winner.

Do not silently average conflicting claims or suppress the dissenting view.

### Not Found

If the question touches an area where no relevant content was found, include a `## Not found` section naming:
- What was looked for (in plain language)
- Where it might live (e.g., "context logs — rerun with `--deep`", "team wiki", "external system")

## Output

Return structured content matching the `/ask` output format. The `query` skill produces the content; the `/ask` command is responsible for presenting it.

## Notes

- This skill is invoked exclusively by `/ask`. It is not invoked implicitly during other operations.
- Read-only. Never proposes entity changes, decisions, or context log entries from query results.
- Respects the Contextual Authority rules from `fabric-core.md` without modification.
```

- [ ] **Step 2: Verify coverage against spec**

Read `Fabric/.claude/skills/query.md` and confirm each item is present:
- [ ] All four retrieval steps present (seed identification, graph expansion, section loading, Knowledge Repository scan)
- [ ] Connected graph rules match `/open-questions` scoped mode exactly (ancestors, descendants, dependencies, request↔epic bridge)
- [ ] Default section load list: header/summary, Properties, Decisions, Open Questions
- [ ] `--deep` adds full Context Log
- [ ] Knowledge Repository scan uses lazy-load rule (only when it would improve the answer)
- [ ] Citation format is *(Entity / Section)*
- [ ] Conflict handling: surface both, apply Contextual Authority, recommend, flag ambiguity
- [ ] "Not found" handling present
- [ ] Read-only constraint stated

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/query.md
git commit -m "feat: add query skill for /ask retrieval and synthesis"
```

---

## Task 3: Register `/ask` and `query` in `fabric-core.md` (template)

**Files:**
- Modify: `Fabric/template/fabric-core.md` — Core Commands table and Core Skills table

- [ ] **Step 1: Add `/ask` row to the Core Commands table**

In `Fabric/template/fabric-core.md`, locate the Core Commands table. Insert the `/ask` row after the `/open-questions` row (keeping query commands together):

Find this line:
```
| /open-questions | List all unchecked open questions across the instance. Default output groups by entity. Accepts an optional entity hint (`/open-questions R-42`) to scope to one entity. Useful for answering "what's blocking X?" |
```

Insert after it:
```
| /ask | Cross-entity natural-language query. Accepts an optional scope hint and a question. Returns a cited answer with conflicts surfaced. Add `--deep` to include full Context Log in the scan. |
```

- [ ] **Step 2: Add `query` row to the Core Skills table**

In `Fabric/template/fabric-core.md`, locate the Core Skills table. Insert the `query` row at the end of the table:

Find the last row of the Core Skills table:
```
| reporting | Generate interactive HTML reports (mindmap, gantt) and markdown activity summaries from the backlog working memory. Handles data traversal, hours rollup from tasks, title shortening, and all three renderers. |
```

Insert after it:
```
| query | Execute the `/ask` retrieval and synthesis pipeline: seed entity identification, connected graph expansion, section loading, Knowledge Repository scan, conflict detection with Contextual Authority, and cited answer generation. |
```

- [ ] **Step 3: Verify the additions**

Read `Fabric/template/fabric-core.md` lines 148–185 and confirm:
- [ ] `/ask` row is present in Core Commands table, after `/open-questions`
- [ ] `query` row is present in Core Skills table, at the end
- [ ] No other rows were accidentally modified

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-core.md
git commit -m "feat: register /ask and query skill in fabric-core template"
```

---

## Task 4: Mirror table additions to `Example/.claude/fabric-core.md`

**Files:**
- Modify: `Example/.claude/fabric-core.md` — same Core Commands and Core Skills table additions as Task 3

The Example instance carries a copy of `fabric-core.md` (not a symlink), so it must be updated independently to reflect the framework's current state.

- [ ] **Step 1: Apply the same `/ask` row addition**

In `Example/.claude/fabric-core.md`, locate the Core Commands table. Insert the same `/ask` row after `/open-questions`:

```
| /ask | Cross-entity natural-language query. Accepts an optional scope hint and a question. Returns a cited answer with conflicts surfaced. Add `--deep` to include full Context Log in the scan. |
```

- [ ] **Step 2: Apply the same `query` row addition**

In `Example/.claude/fabric-core.md`, locate the Core Skills table. Insert the same `query` row at the end:

```
| query | Execute the `/ask` retrieval and synthesis pipeline: seed entity identification, connected graph expansion, section loading, Knowledge Repository scan, conflict detection with Contextual Authority, and cited answer generation. |
```

- [ ] **Step 3: Verify the additions**

Read `Example/.claude/fabric-core.md` Core Commands and Core Skills tables and confirm both rows are present and match the template version exactly.

- [ ] **Step 4: Commit**

```bash
git add Example/.claude/fabric-core.md
git commit -m "feat: sync /ask and query skill registration to Example instance"
```

---

## Self-Review Checklist

Run after all tasks are complete.

- [ ] `Fabric/.claude/commands/ask.md` exists and covers: purpose, usage syntax, all four examples, no-scope nudge, `--deep`, output format, notes
- [ ] `Fabric/.claude/skills/query.md` exists and covers: all four retrieval steps, connected graph rules, default section list, `--deep` extension, Knowledge Repository scan, conflict detection with Contextual Authority, not-found handling, read-only constraint
- [ ] `/ask` row in `Fabric/template/fabric-core.md` Core Commands table
- [ ] `query` row in `Fabric/template/fabric-core.md` Core Skills table
- [ ] Both rows mirrored in `Example/.claude/fabric-core.md`
- [ ] Four commits: one per task
