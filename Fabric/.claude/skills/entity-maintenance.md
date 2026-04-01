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

## Child Summary Rollup

Generates and maintains Child Summary sections on epics and features. Invoked by the `/rollup-backlog` command or during refinement when the backlog-refinement skill detects a stale or missing rollup.

### Child Summary Format

```markdown
## Child Summary
Last updated: YYYY-MM-DD

- **child-slug** (Level, State) — Brief description. N work items, ~Xh estimated.
- **child-slug** (Level, State) — Brief description. Unestimated.
```

One line per direct child. Contains: name (folder slug), hierarchy level, state, what it does (from the entity's description first sentence or summary), and a sizing signal (child count, hours if known). Enough to understand scope and spot overlaps without loading child files.

### Scanning Process

1. List all direct child directories of the target entity.
2. For each child, read only the entity file header (everything before the first `##` section) to extract: title (from `# ` heading), state (from `State:` property).
3. Read the first sentence of the child's `## Description` section for the brief description.
4. For features as children of an epic: count work item subdirectories under `workitems/`.
5. For work items as children of a feature: count task files under `tasks/` and sum `Estimated Hours` values from task headers.
6. If hours data is unavailable, use "Unestimated" as the sizing signal.

### Comparison and Update

When an existing Child Summary is present:

1. Parse each line to extract the child slug and state.
2. Compare against the scanned children.
3. Flag: new children not in the summary, children whose state changed, children removed from the directory, estimation changes.
4. Propose the updated section showing what changed.

When no Child Summary exists, generate the full section from the scan results.

### Placement

Insert the `## Child Summary` section after `## Items this depends on` (or after the last standard section if that section is absent). If a `## Context Log` section exists, place Child Summary before it.

### Maintenance Rules

- Updated as part of refinement activity or via `/rollup-backlog`, not autonomously.
- Follows the "propose and confirm" pattern — all entity edits require human confirmation.
- Staleness: if a child has been modified outside of refinement, the rollup may be stale. This is flagged during refinement rather than kept perpetually in sync.

## Notes

- Entity maintenance is always human-guided. The AI proposes, the human confirms.
- Staleness is a nudge, not a blocker. Stale entities are still usable; the AI just notes the staleness.
- When multiple entities are stale, prioritize reconciliation by how recently they were queried or updated.
