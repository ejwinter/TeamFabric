---
spec-sha: de8749235c36
---
# Skill: Content Ingestion

## Purpose
Process incoming content into Fabric's structured entity model. This is the core "people dump raw content in, AI organizes it" capability.

<!-- spec:begin -->
## Three Ingestion Paths

### Quick File
User provides content plus an entity hint.

Trigger: User says something like "this is for R-42" or "file this under WI-1234" along with content.

Procedure:
1. Load the referenced entity's header and recent context log.
2. If the content is file-based, run the Hash Check and surface any match before proceeding.
3. Summarize the content against that entity's context.
4. Present the proposed context log entry for confirmation.
5. On confirmation, append to the entity's context log and append an Ingested Log entry.
6. Set the entity's staleness flag if the summary may affect first-class fields.

### Direct Ingest
User provides content with a scope hint but no specific entity.

Trigger: User provides content scoped to a domain (e.g., `/ingest requests` or `/ingest backlog`) without specifying a specific entity.

Procedure:
1. Require a scope before scanning. If the user provides no scope, ask: "Should I look in requests, backlog, or a specific entity?"
2. Scan entity headers within the specified scope:
   - **requests**: scan request entities.
   - **backlog**: scan epics and features only. Work items and tasks are too granular for classification scans. If the content best fits a feature, propose it — the user can direct to a specific work item if needed.
   - **members**: scan member profiles.
   - **products**: scan product entities.
3. Propose classification: "This looks like it relates to [entity]. Is that right?"
4. If confirmed, proceed as Quick File.
5. If redirected, follow the user's guidance.
6. If no match found, propose catch-all filing (team-level, member-level, or product-level context).

Note: Users can always target a specific work item or task directly via Quick File (e.g., "file this under backlog/epics/.../workitems/kafka-consumer-framework"). The scan restriction only applies to unscoped classification.

### Staged Batch
User drops content into staging/ and triggers a digest.

Trigger: User invokes a digest command or asks to process staged content.

Procedure:
1. Read all files in staging/ (excluding README.md).
2. For each piece of content, run the Hash Check (file-based content only), then classify and summarize.
3. Produce a digest plan document listing all proposed actions, including each file's Source, SHA-256, and Hash Check outcome.
4. Present the plan for review.
5. On confirmation, execute the plan (append entries, update fields, create entities, append one Ingested Log entry per processed source).
6. Clear processed files from staging/.

## Context Log Entry Format

```
- YYYY-MM-DD HH:MM - [Who] ([email]) via [channel]: [Summary with reasoning].
  Source: [reference to find original artifact]
```

Fields:
- Timestamp: when the content was created or received (not when it was ingested)
- Who: person who created or sent the content
- Channel: email, meeting, Teams, Slack, phone, document, etc.
- Summary: lean breadcrumb with enough "why" to answer follow-up questions
- Source: optional pointer to the original artifact in an external system

## Action Types

When proposing actions during ingestion:
- **Append**: new context, no field changes
- **Update**: proposes changing a first-class field, shows old and new values
- **Conflict**: surfaces a contradiction with existing context, requires human resolution
- **Stale flag**: marks an entity's summary as potentially outdated
- **Duplicate**: notes redundancy with existing context, recommends skipping
- **New entity**: proposes creating something that doesn't exist yet

## Ingested Log

An instance-wide, append-only record of ingestion actions, separate from the per-entity Context Log above. One entry per ingested *source* (file, or described content) — not per entity. A source that touches multiple entities gets a single entry with multiple lines in its Actions field, since Source and SHA-256 are properties of the source, not of any one entity.

```
- YYYY-MM-DD HH:MM - [Who] ([email]): [Source]
  SHA-256: [64-char hex, or NA]
  Content: [short, objective description of what was ingested]
  Hash Check: [no prior match | exact match: [date] by [who] | possible new version of [prior source], last seen [date] by [who]]
  Actions: [Action Type]: [Entity] - [what changed]; [Action Type]: [Entity] - [what changed]
```

Fields:
- Timestamp: when the ingestion action ran — the opposite convention from the Context Log's Timestamp, which records when the content originated. Don't confuse the two.
- Who: the identity-resolved user performing the ingestion (see User Identification), not necessarily the content's originator.
- Source: file path, or a short description of the content's origin if not a file (pasted text, dictation, etc.).
- SHA-256: hash of the file, computed during the Hash Check. `NA` if there's no underlying file.
- Content: a short, objective description of the source itself — not an entity-specific summary (that belongs in the Context Log entry).
- Hash Check: the outcome recorded at ingestion time, so the entry is self-explanatory later without re-deriving it.
- Actions: one segment per entity touched, using the Action Types vocabulary above.

Written only for executed actions. A declined or aborted ingestion — including a rejected item within a partially-approved Staged Batch plan — produces no entry.

### Ingested Log File Lifecycle

- `ingested-log/ingested-log.md` accumulates entries for the current calendar month. Created on first use if it doesn't exist.
- Before appending a new entry: if the file's most recent entry is from a prior calendar month, roll it over first — archive its current contents to `ingested-log/YYYY-MM.md` (named for the month being archived), start a fresh `ingested-log.md`, then append.
- If `ingested-log.md` does not yet exist, skip rollover and create it fresh.
- `ingested-log/` archives are append-only once written. `/clean-fabric` manages culling per the Fabric GC retention table.
- A Hash Check lookup alone never triggers rollover — only an actual append does.

## Multi-Entity Content

A single piece of content may be relevant to multiple entities. For example, meeting notes might touch three different requests, or an email might update a request's timeline while also surfacing a new request.

When this occurs:
1. Decompose the content into separate context log entries — one per entity, each summarizing only the portion relevant to that entity.
2. Present all proposed entries together so the user can review them as a set.
3. Each entry should stand on its own (don't write "see also" references that create dependency between log entries). A reader of any single entity should understand the entry without chasing cross-references.
4. If the same fact is relevant to multiple entities, it's acceptable to have similar summaries on each — this is not duplication, it's appropriate context at each level.

## Duplicate Detection

Before appending, check recent context log entries for overlap:
- If similar content exists, surface it: "[Person] noted a similar point on [date]. Is this confirming that, updating it, or a separate concern?"
- Let the user decide whether to append, skip, or merge.

## Hash Check

Applies only to file-based content. Content with no underlying file records `SHA-256: NA` and skips this check entirely — Duplicate Detection above is the only applicable mechanism for pasted or described content.

Before proposing the entry for confirmation:
1. Compute the file's SHA-256.
2. Check it against `ingested-log/ingested-log.md` and every retained `ingested-log/YYYY-MM.md` archive.
3. **Exact hash match**: surface "This exact file was already ingested on [date] by [who]; here's what happened" (pull Content and Actions from the matched entry). Advisory, not blocking — the user may proceed anyway.
4. **Same source path, different hash, no exact match**: surface as a likely new version, referencing the prior entry's date and who ingested it.
5. A confirmed override always produces its own new Ingested Log entry — a hash match never silently suppresses logging. Only a declined or aborted ingestion produces no entry.

This check is independent of, and runs before, Duplicate Detection above. A hash match does not automatically make the resulting Action Type "Duplicate" — that's still the user's call, since a byte-identical file can legitimately apply to more than one entity.

Because retention purges old archives (see Fabric GC), the check's lookback is bounded by the configured retention window — a file re-ingested after its original entry has aged out won't be flagged. This is expected, consistent with archived epics/requests losing their gravestone history after their own retention window.

## Behavioral Rules During Ingestion

- Always check AGENT.md for repository nudges after ingestion (e.g., "should this also go in SharePoint?")
- Check notification rules and suggest notifications if applicable.
- Never modify first-class fields without explicit human confirmation.
- When ingesting against an entity, flag it as stale if the new content may invalidate the summary.
- Ingested Log entries are written only for executed actions — never for declined or aborted ingestions.
<!-- spec:end -->
