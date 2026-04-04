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
Add an `/add-stakeholder` command and a lightweight stakeholder lifecycle (active, disengaged, archived). Extend ingestion and triage to proactively surface which stakeholders are affected by a given request or product change.

---

## Scrum Module
priority: low
Build out the Scrum module listed in the init form as "not yet available." Minimum viable scope: sprint ceremonies (planning, review, retro), velocity tracking, and sprint-level reporting. Should compose with the existing Standup, Backlog, and Iteration support.

---
