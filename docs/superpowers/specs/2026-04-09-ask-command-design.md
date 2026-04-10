# /ask Command — Design Spec

**Date:** 2026-04-09
**Issue:** ejwinter/TeamFabric#13
**Status:** Approved

---

## Overview

`/ask` is a cross-entity natural-language query command. It scans the instance's structured knowledge, synthesizes an answer, and cites every claim back to its source entity and section. It is the counterweight to `/ingest` — people dump content in with ingest, they pull synthesis out with ask.

---

## Usage

```
/ask [scope] <question> [--deep]
```

**Examples:**
- `/ask what have we decided about auth?` — instance-wide, key sections
- `/ask R-42 what's the current status?` — scoped to R-42 and its connected graph
- `/ask ehr-pipeline what did the vendor say about the API timeline?` — scoped, key sections
- `/ask R-42 what did the vendor say about the API timeline? --deep` — full content scan on the connected graph

When no scope is provided, the agent issues a gentle prompt before answering:
> "No scope given — scanning instance-wide. For faster and more precise results, try `/ask [entity] <question>`."

The agent then proceeds immediately — the nudge is informational, not a gate.

---

## Retrieval

Retrieval runs in four steps.

### Step 1 — Identify seed entities

Extract key terms from the question. Scan entity headers and summaries across all entity types in scope: requests, epics, features, work items, products, member profiles, and stakeholder profiles.

- When a scope hint is given, start from that entity.
- For instance-wide queries, walk all entity directories.

Match on title, summary, and Properties fields. Select all entities with meaningful term overlap — err liberal at this stage.

### Step 2 — Expand via connected graph

For each seed entity, walk its connected graph using the same rules as `/open-questions` scoped mode:
- **Ancestors** — walk up the backlog hierarchy (work item → feature → epic)
- **Descendants** — walk down (epic → features → work items)
- **Dependencies** — follow entries in `## Items this depends on`
- **Request↔Epic bridge** — if the seed is a request with a `Backlog Epic:` field, follow to the epic and include its full subtree; if the seed is a backlog entity with an originating request reference, include that request

Deduplicate — an entity reached via multiple paths is loaded once.

### Step 3 — Load sections

For each entity in the expanded set, load: header/summary, Properties, Decisions, Open Questions.

With `--deep`: also load the full Context Log.

### Step 4 — Knowledge Repository scan

For any readable Knowledge Repository defined in CLAUDE.md (including wiki), check if the question's key terms warrant a read. If yes, include relevant content with the repository name as the citation source. Apply the same lazy-load rule as ingestion — only read when it would improve the answer.

---

## Synthesis

### Rules

- Answer the question directly in 1–3 sentences at the top.
- Every factual claim is backed by at least one citation. Format: *(Entity / Section)* — e.g., *(R-42 / Decisions)*, *(ehr-pipeline / Context Log)*.
- Apply Contextual Authority (as defined in `fabric-core.md`) when sources conflict: surface both claims with their citations, apply authority rules to recommend which to trust, and flag as a judgment call requiring human resolution when authority is ambiguous.
- Do not invent or interpolate. If the answer isn't in the scanned content, say so explicitly and suggest where it might live.

### Output Format

```
## Answer

[Direct answer, 1–3 sentences. Citations inline.]

## Sources

- R-42 / Decisions — [what was found here]
- ehr-pipeline / Context Log — [what was found here]

## Conflicts (if any)

**Deadline:** R-42 / Decisions says April 30. fhir-parser workitem / Context Log says May 15.
→ R-42 / Decisions carries more authority here (formal decision record vs. context log note).
  Recommend trusting April 30, but verify with the work item owner.

## Not found

[If relevant areas came up empty, note them and suggest where to look.]
```

If the scanned set was large, append: *"Scanned [N] entities across [M] entity types."*

---

## Command Registration

`/ask` is a **Core command** — it queries the entity model, which is always present regardless of which modules are enabled. It requires no meta mode. It is read-only.

### Addition to `fabric-core.md` Core Commands table

| Command | Description |
|---------|-------------|
| /ask | Cross-entity natural-language query. Accepts an optional scope hint and a question. Returns a cited answer with conflicts surfaced. Add `--deep` to include full Context Log in the scan. |

### Addition to `fabric-core.md` Core Skills table

| Skill | Description |
|-------|-------------|
| query | Execute the `/ask` retrieval and synthesis pipeline: seed entity identification, connected graph expansion, section loading, Knowledge Repository scan, conflict detection with Contextual Authority, and cited answer generation. |

The `query` skill is implemented in `Fabric/.claude/skills/query.md`.

No new entity types or file structure changes are required.

---

## What This Is Not

- `/ask` does not write to any entity. It never proposes context log entries or decisions from its output.
- `/ask` does not perform external calls. All content comes from the local Fabric instance and readable local Knowledge Repository clones.
- `/ask` is not a replacement for `/open-questions` (which is optimized for surfacing blockers) or `/status` (which is a factual snapshot). It complements both.
