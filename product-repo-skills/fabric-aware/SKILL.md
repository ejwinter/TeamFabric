---
name: fabric-aware
description: >
  Use when working in this codebase and the user mentions Fabric, backlog,
  a work item, story, feature, epic, or acceptance criteria — or references a
  backlog entity ID (pattern: word-word-YYMMDD, e.g. auth-refresh-260610).
  Also use when asking what's in scope, what the AC says about something, whether
  something is covered by a work item, or to log progress or a discovery mid-implementation.
  This skill loads Fabric context conversationally and inline — for the structured
  start/wrap lifecycle with state transitions use /fabric-backlog instead.
allowed-tools: Bash, Read, Write, Edit
---

# fabric-aware Skill

Provides ambient Fabric context during active development. The engineer doesn't need
to break flow — they can ask about scope, AC, or open questions and get an answer
drawn directly from the team's Fabric backlog.

**Relationship to `/fabric-backlog`:**
- `fabric-aware` → conversational, read-heavy, no state changes; triggered by casual mentions
- `/fabric-backlog start|wrap` → structured ceremony; AC congruence check, state transitions, iteration assignment

---

## Step 0 — Locate the Fabric instance

Check for an explicit pointer first:

```bash
cat .claude/fabric-link.md 2>/dev/null
```

If the file exists, read the `Path:` field — that is the Fabric instance root. Example file:

```
Path: ../AcmeFabric
```

If absent, fall back to the sibling-directory convention: look for a directory at `../` whose
name contains `fabric` or `Fabric` (case-insensitive):

```bash
ls -d ../*[Ff]abric* 2>/dev/null | head -5
```

If exactly one match is found, use it. If multiple matches, list them and ask the user which one.
If none, tell the user no Fabric instance was found and suggest adding a `.claude/fabric-link.md`.

Store the resolved path as `$FABRIC` for all subsequent steps.

---

## Step 1 — Identify the entity being referenced

Extract the Fabric entity from the conversation. Possibilities in order of confidence:

1. **Explicit ID slug** — matches the pattern `[a-z]+-[a-z]+-\d{6}` (e.g. `auth-refresh-260610`)
2. **Partial slug or keyword** — "the auth refresh story", "the summarization job"
3. **Work item type + description** — "the retry work item", "that feature we discussed"
4. **No explicit reference** — use the current git branch as a hint:

```bash
git branch --show-current
```

Branch names often encode the work item slug (e.g. `feature/auth-refresh`).

If still ambiguous after checking the branch, ask the user: "Which work item or feature are you
referring to? A partial name is fine."

---

## Step 2 — Locate the entity in the Fabric instance

### Fast path — use the backlog index

Read `$FABRIC/backlog-index.slim.md` and search for lines matching the slug or keywords.
The index carries entity type, state, path, assignee, iteration, and labels for every item — use it
to identify the exact file path without a directory scan.

```bash
grep -i "<keyword>" $FABRIC/backlog-index.slim.md
```

If the index is stale (or absent), fall back to a direct search:

```bash
find $FABRIC/backlog -name "workitem.md" | xargs grep -li "<keyword>" 2>/dev/null
find $FABRIC/backlog -name "feature.md"  | xargs grep -li "<keyword>" 2>/dev/null
find $FABRIC/backlog -name "epic.md"     | xargs grep -li "<keyword>" 2>/dev/null
```

**Zero matches:** tell the user and stop.
**Multiple matches:** list them with their titles and ask which one.
**Exactly one:** proceed.

---

## Step 3 — Load the entity

Read the full entity file. Then check for a co-located spec:

```bash
ls $(dirname <entity-path>)/spec.md 2>/dev/null
```

If `spec.md` exists, read it and surface it based on its state:

- **`State: Approved`** — surface it proactively as the pre-implementation brief: "There's an approved spec for this work item — reading it now." Present the spec content alongside the entity, since an Approved spec is the authoritative *how* for the work.
- **`State: Ready`** — note it: "A spec exists (State: Ready) but hasn't been approved yet. Load it for context? (yes / skip)"
- **`State: Draft`** — note it: "There's a spec in Draft — it may not be complete. Load it anyway? (yes / skip)"
- **`State: Superseded`** — mention it briefly: "A superseded spec exists — likely replaced by a newer direction. Skip it unless you need the history."
- **No state field or unrecognized value** — treat as Draft.

If the question is clearly about technical approach or design, always read the spec without asking.

---

## Step 4 — Answer the question

Surface the sections most relevant to what the engineer asked. Be selective — don't dump the whole file.

| What they asked about | What to surface |
|---|---|
| Scope / "is X covered?" | `## Acceptance Criteria` — annotate relevant items |
| Approach / design | `## Description` + `spec.md` if present |
| Open questions / blockers | `## Open Questions` and `## Blockers` |
| Status / what's left | State, AC checkbox counts, any active blockers |
| General "what is this" | Title, Description summary, AC checkbox tally, assignee, iteration |

For AC scope questions, be explicit: mark items as clearly in scope, clearly out of scope, or
ambiguous given the question. If something the engineer is about to build isn't represented in
the AC, flag it rather than assume it's covered.

---

## Step 5 — Surface constraints from the Fabric instance

When loading a work item for the first time in a session, surface any active constraints relevant
to the work. Read these from `$FABRIC/CLAUDE.md` (or the relevant `fabric-*.md` module files) —
do not hardcode team-specific rules here.

Common things to look for and surface:

- **Active blockers** — if `Blocked: Yes` is set on the entity, surface the blocker summary upfront.
- **Open questions** — if there are unchecked items in `## Open Questions`, list them. They may
  affect implementation choices.
- **Security/compliance labels** — if the entity has labels like `security-sensitive` or
  `external-integration`, note them and reference any relevant team conventions from Fabric CLAUDE.md.
- **Team-specific hard constraints** — anything documented in Fabric CLAUDE.md as a non-negotiable
  rule (data handling rules, architectural constraints, etc.) that applies to this entity's domain.

Don't recite these on every follow-up question — once per entity per session is enough.

---

## Step 6 — Mid-implementation logging (optional)

If the engineer mentions completing something, discovering something worth capturing, or making a
decision during the conversation, offer to write a context log entry to the entity file.

Resolve the author name:

```bash
git config user.name
```

Propose the entry before writing:

```
- <YYYY-MM-DD> - <Author Name> via implementation: <one-line summary of what was discovered/decided/shipped>.
  Source: <file:line or commit hash if applicable>
```

Rules:
- Only propose when there's genuinely new information (a decision, a discovery, a deviation from the spec).
- Do not propose a log entry just because the work item was read.
- Do not change `State:` — refer the engineer to `/fabric-backlog wrap` for that.
- After writing, remind: "Commit this in the Fabric instance separately: `git -C $FABRIC commit -am 'context: <id>'`"

---

## Quick examples

```
"What does the AC say about the save endpoint?"
→ Load the relevant work item, show AC items related to save behavior.

"Is auto-summarization in scope for the auth refresh story?"
→ Load the work item, check AC for summarization — flag if it's in a sibling item, not this one.

"I just found that the session ID needs to be a specific format — worth logging?"
→ Propose a context log entry for the work item.

"What open questions are on the retry feature?"
→ Load the feature, surface ## Open Questions.
```
