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
