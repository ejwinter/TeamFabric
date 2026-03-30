# Skill: Entity Maintenance

## Purpose
Keep entity files accurate and current through staleness detection, summary reconciliation, and guided field updates.

## Staleness Detection

Entities use a dirty flag approach: when new context arrives that may invalidate an entity's summary or first-class fields, the entity is flagged as potentially stale.

### How Staleness is Set
- During ingestion, if new context log content contradicts or supersedes existing summary or field values, add a staleness marker to the entity header.
- Staleness propagates upward: if a child entity is stale, its parent may also be stale.

### Staleness Marker Format
```
Stale: yes (since YYYY-MM-DD, reason: [brief reason])
```

### How Staleness is Resolved
- When a user queries a stale entity, the AI notes the staleness: "This entity has new context since its last summary update. Want me to help reconcile?"
- Reconciliation means: read the new context log entries, propose updated summary and/or field values, get human confirmation, clear the staleness flag.
- The AI never resolves staleness autonomously. It always requires human involvement.

## Summary Reconciliation

When reconciling a stale entity:

1. Load the entity's full content (header, fields, and context log).
2. Identify context log entries added since the last summary update.
3. Propose an updated summary incorporating the new context.
4. If any first-class fields should change, show old and new values explicitly.
5. On confirmation, update the summary, update any confirmed field changes, and clear the staleness flag.
6. Update the summary's "last updated" date.

## Entity Header Scanning

For operations that need to classify content or find relevant entities (direct ingest, queries), use lightweight header scanning:

1. Read only the header block of each entity (everything before the first `##` section).
2. Headers contain: name, status, owner, product, and summary.
3. This is sufficient for classification without loading full context logs.
4. Only load full entity content when deeper context is needed.

## Catch-All Context

Content that doesn't map to a specific entity can be filed at directory levels:
- team/team.md context log: team-level discussions, process decisions, general announcements
- team/members/<n>/profile.md context log: individual notes, growth conversations, personal context
- products/<product>/ context: market info, competitive analysis not tied to specific work

## Notes
- Entity maintenance is always human-guided. The AI proposes, the human confirms.
- Staleness is a nudge, not a blocker. Stale entities are still usable; the AI just notes the staleness.
- When multiple entities are stale, prioritize reconciliation by how recently they were queried or updated.
