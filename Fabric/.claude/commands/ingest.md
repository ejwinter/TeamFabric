# /ingest - Ingest Content into Fabric

## Purpose
Process content into Fabric's entity model. Supports three input modes and an optional planning step for structured review before execution.

## Usage
- `/ingest` - paste or describe content, AI classifies and proposes filing
- `/ingest R-42` - file content against a specific entity (quick file path)
- `/ingest for eric-winter` - file content to a member's context log
- `/ingest staging` - process all files in staging/ as a batch
- `/ingest with planning` - produce a written plan before executing (works with any mode)
- `/ingest with planning R-42` - plan against a specific entity
- `/ingest with planning staging` - plan for all staged files

## Modifiers

### `with planning`

By default, ingestion is conversational: the AI proposes entries in chat and the user confirms inline. Adding `with planning` produces a structured digest plan document that lists all proposed actions for review before anything is written.

Planning mode is especially useful when:
- Content touches multiple entities
- The user wants to review all proposed changes as a set before committing
- Someone is ingesting on behalf of another team member and wants a reviewable record

When `with planning` is used, `/ingest staging` is implied if there are files in staging/ and no other content is provided.

## Behavior

### Step 1: Gather Content

**With entity hint** (e.g., `/ingest R-42`):
1. Resolve the entity from the hint. If ambiguous, ask the user to clarify.
2. Load the entity's header and recent context log entries.
3. Ask the user for the content if not already provided.

**Without entity hint** (e.g., `/ingest`):
1. Ask the user for the content if not already provided.
2. Scan entity headers (lightweight scan per the entity-maintenance skill) to find likely matches.
3. Propose classification: "This looks like it relates to [entity]. Is that right?"
   - If multiple entities seem relevant, list them ranked by relevance.
   - If no match found, propose catch-all filing (team-level, member-level, or product-level).
4. Once the user confirms or redirects, continue with the resolved entity.

**Staged** (e.g., `/ingest staging`):
1. Read all files in staging/ (excluding README.md).
   - If staging/ is empty, inform the user: "Nothing in staging to process."
2. Classify each file against existing entity headers.

### Step 2: Summarize and Propose

For each piece of content (regardless of input mode):

1. Summarize into a proposed context log entry using the standard format:
   ```
   - YYYY-MM-DD HH:MM - [Who] ([email]) via [channel]: [Summary].
     Source: [reference]
   ```
2. If the content suggests a first-class field change, propose it as an **Update** action showing old and new values.
3. Run duplicate detection against recent context log entries. Surface overlaps and let the user decide.

### Step 3: Review

**Conversational (default):**
Present each proposed entry in chat for confirmation. The user approves, edits, or rejects inline.

**With planning:**
Produce a structured digest plan listing all proposed actions, grouped by target entity:

```markdown
## Digest Plan - YYYY-MM-DD

### [Entity ID]: [Entity Name]
**Source:** [filename or "provided in chat"]
**Action:** [Append | Update | Conflict | Stale flag | Duplicate | New entity]
**Proposed entry:**
- YYYY-MM-DD HH:MM - [Who] ([email]) via [channel]: [Summary].
  Source: [reference]
**Field changes:** [if Update, show old -> new]

### NEW: [Proposed entity name]
**Source:** [filename or "provided in chat"]
**Action:** New entity
**Proposed location:** [path]
**Proposed entry:** ...

### Unclassified
**Source:** [filename or "provided in chat"]
**Notes:** [Why classification failed, suggested catch-all location]
```

The user may:
- **Approve all** - execute every action in the plan.
- **Approve selectively** - confirm or reject individual actions.
- **Edit** - redirect an action to a different entity or modify the summary.
- **Abort** - discard the plan entirely.

### Step 4: Execute

On confirmation (conversational or plan-based):
- Append context log entries.
- Update first-class fields (only if explicitly approved).
- Create new entities from templates.
- Set staleness flags where applicable.
- Check DRAFT_AGENTS.md for knowledge repository nudges and notification rules.

For staged content:
- Clear processed files from staging/ (only files whose actions were executed).
- Files tied to rejected or aborted actions remain in staging/.

## Gathering Content Details

When summarizing, the AI may need to ask clarifying questions to produce a good context log entry:
- **Who** is the source? (if not obvious from the content)
- **When** did this happen? (the content timestamp, not the ingestion time)
- **Channel**: how was this communicated? (email, meeting, Teams, phone, etc.)
- **Source**: where can the original be found? (optional but encouraged)

Ask only what's missing — don't interrogate the user if the content is self-explanatory.

## Notes
- Does not require meta mode (ingestion is a normal operation).
- Never modifies first-class fields without explicit confirmation.
- The identity skill runs first to establish who is ingesting.
- If the referenced entity doesn't exist, offer to create it as a **New entity** action.
- If content is relevant to multiple entities, split into separate actions per entity (see ingestion skill: Multi-Entity Content).
- Staged files that fail to parse (binary, unreadable) are listed under Unclassified with an explanation.
