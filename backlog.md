# TeamFabric Feature Backlog

Ideas for future framework capabilities. Not prioritized — use this as a starting point for planning conversations.

---

## Decision Capture in Context Logs

**Implemented 2026-04-04.** Entities now carry two companion sections:

- **`## Open Questions`** — checkbox list of unresolved questions or blockers. An open question is an unresolved decision. Checking the box closes it; a Decisions entry records the answer.
- **`## Decisions`** — structured entries: decided by, recorded by, options considered (with rejection reasons), rationale.

Agent behavior: detects decision language and unresolved-question language during ingestion/conversation, proposes entries (confirm before writing). User can also explicitly request entries.

Query path: `/open-questions` lists all unchecked questions instance-wide, grouped by entity. Scoped with `/open-questions [entity]`. Broader search (e.g., "what have we decided about auth?") handled via natural language over all Decisions sections.

`## Decision Log` removed from CLAUDE.md template — superseded by per-entity sections.

---

## Capacity Planning Workflow

Surface a planning view that synthesizes member allocations, current backlog assignments, and iteration schedule to help answer "do we have capacity for this?" and "who should own this?" — especially useful during request acceptance and sprint planning.

---

## Dependency Visibility

Make the "Items this depends on" sections actionable. Add a `/blocked` or `/dependencies` command that traverses the backlog tree and surfaces a dependency map — what's waiting on what, and what would unblock the most work.

---

## Retrospective Module

**Implemented 2026-04-04.** Retro workflow as a complement to the Standup module. Covers what went well, what didn't, and action items. Produces a team-level retro summary and optionally feeds action items into the backlog inbox.

Files added:
- `Fabric/template/fabric-retro.md` — module behavioral rules
- `Fabric/.claude/commands/retro.md` — `/retro` command (Q&A, narrative, and report modes)
- `Fabric/.claude/skills/retro-report.md` — team summary synthesis skill

---

## Member Availability Tracking

Allow members to declare temporary unavailability (OOO, partial weeks, leave) on their profile. Surface availability alongside allocation when Fabric reasons about capacity so the two stay in sync.

---

## Release Notes / Changelog Generation

Add a `/report changelog` (or similar) that generates a product-focused summary of what was completed in a given period — drawing from closed backlog items, resolved requests, and context logs. Useful for stakeholder updates and release communication.

## Stakeholder Lifecycle Management
priority: medium
Add a `/stakeholder` command mirroring the `/member` command — covers onboarding, profile updates, and marking a stakeholder as departed. Needs `Status:` and `Terminated:` fields added to the stakeholder profile template (already flagged as a schema gap in the clean-fabric spec). Extend ingestion and triage to proactively surface which stakeholders are affected by a given request or product change.

---

## Reconcile Command (`/reconcile`)

Address the "shadow backlog" risk: when new content arrives, staleness flags accumulate but no forcing function drives resolution. The working memory drifts into a map of warnings rather than a source of truth.

**Core behavior:** `/reconcile` surfaces all staleness flags instance-wide, groups them by entity, and presents a structured session to work through them one by one — proposing a specific update, skip (with reason), or dismiss (flag was incorrect). Each resolution is confirmed before writing.

**Why this beats passive flagging:**
- Staleness becomes a *debt metric* (N entities pending reconciliation), visible and trackable rather than buried in individual files
- The command creates a defined start/end to reconciliation — teams can assign it to a sprint ceremony or triage cadence rather than leaving it perpetually open
- Entities don't freeze at the old value while awaiting reconciliation; the command can render the new-data-alongside-old-record view so readers can make informed decisions even before formal resolution

**Possible modes:**
- `/reconcile` — full session, all stale entities
- `/reconcile [entity]` — scoped to one entity or subtree
- `/reconcile --summary` — report-only; show count and age of outstanding flags without entering resolution flow

**Design note:** The reconciliation backlog should also be surfaced automatically during triage and at sprint boundaries — not just on explicit invocation. Staleness debt older than a configurable threshold (e.g., 7 days) should escalate to a visible warning in standup context.

---

## Team Wiki Module
priority: medium

Add optional awareness of a team wiki so the agent can recognize wiki-worthy content during ingestion and prompt teams to document it — without ever writing to the wiki autonomously.

**Design constraints:**
- Wiki is strictly read-only from the agent's perspective. The agent reads, suggests, and drafts; it never writes to the wiki directly.
- Module is opt-in. Teams without a wiki are unaffected.
- Encourage adoption of a file-based wiki tool (e.g. MkDocs) so the wiki is a sibling git repo the agent can read locally.

**Configuration (in team CLAUDE.md):**

```markdown
### Team Wiki
Path: ../team-wiki        # sibling folder convention; any relative path accepted
Format: mkdocs            # optional hint — mkdocs | plain | confluence (future)
```

If `Path:` resolves to a local directory, the agent reads wiki files directly. If not (e.g., a Confluence URL), the agent acknowledges the wiki exists but treats it as an opaque external reference — nudges still fire, but the agent cannot read content or propose targeted file paths.

**Ingestion nudge behavior:**
When ingesting content that looks wiki-worthy — a procedure someone just worked through, a cross-product pattern, an architectural decision with general applicability, a setup or onboarding step — the agent flags it at the end of ingestion:

> "This looks like it could strengthen your team wiki. Want me to draft an addition to `docs/pipelines/dataflow-setup.md`?"

The draft lands in `staging/` as a proposed wiki file edit for the member to review, adjust, and commit to the wiki repo. The agent proposes a target file based on wiki structure — it does not create a new file without confirmation.

**What counts as wiki-worthy** (agent judgment during ingestion):
- Reusable procedures or how-to steps that will apply again in the future
- Cross-product or cross-team patterns that emerged from a specific engagement
- Setup, onboarding, or environment instructions
- Operational runbooks surfaced during incident or request work

Not wiki-worthy: decisions specific to one request or work item, status updates, one-time context.

**Product wiki extension:** Product entities gain an optional `Wiki:` field pointing to the product's own wiki or docs directory (separate from the team wiki). The agent uses this when answering product-specific how-to questions.

---

## Scrum Module
priority: low
Build out the Scrum module listed in the init form as "not yet available." Minimum viable scope: sprint ceremonies (planning, review, retro), velocity tracking, and sprint-level reporting. Should compose with the existing Standup, Backlog, and Iteration support.

---
