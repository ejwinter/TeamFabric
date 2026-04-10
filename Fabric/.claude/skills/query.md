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
