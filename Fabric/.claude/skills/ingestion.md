# Skill: Content Ingestion

## Purpose
Process incoming content into Fabric's structured entity model. This is the core "people dump raw content in, AI organizes it" capability.

## Three Ingestion Paths

### Quick File
User provides content plus an entity hint.

Trigger: User says something like "this is for R-42" or "file this under WI-1234" along with content.

Procedure:
1. Load the referenced entity's header and recent context log.
2. Summarize the content against that entity's context.
3. Present the proposed context log entry for confirmation.
4. On confirmation, append to the entity's context log.
5. Set the entity's staleness flag if the summary may affect first-class fields.

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
2. For each piece of content, classify and summarize.
3. Produce a digest plan document listing all proposed actions.
4. Present the plan for review.
5. On confirmation, execute the plan (append entries, update fields, create entities).
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

## Behavioral Rules During Ingestion

- Always check AGENT.md for repository nudges after ingestion (e.g., "should this also go in SharePoint?")
- Check notification rules and suggest notifications if applicable.
- Never modify first-class fields without explicit human confirmation.
- When ingesting against an entity, flag it as stale if the new content may invalidate the summary.
