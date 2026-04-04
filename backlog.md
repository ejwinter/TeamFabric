# TeamFabric Feature Backlog

Ideas for future framework capabilities. Not prioritized — use this as a starting point for planning conversations.

---

## Decision Capture in Context Logs

Strengthen context log conventions and ingestion prompts to treat decisions as a first-class entry type — not just summaries of what happened, but explicit "decided X because Y" breadcrumbs on the entity where the decision was made (request, backlog item, product, member profile). Add a query path so teams can ask "what decisions have we made about X?" and surface decision entries across an entity's context log. Also evaluate whether the `## Decision Log` section in the CLAUDE.md template serves a purpose or should be removed.

---

## Capacity Planning Workflow

Surface a planning view that synthesizes member allocations, current backlog assignments, and iteration schedule to help answer "do we have capacity for this?" and "who should own this?" — especially useful during request acceptance and sprint planning.

---

## Dependency Visibility

Make the "Items this depends on" sections actionable. Add a `/blocked` or `/dependencies` command that traverses the backlog tree and surfaces a dependency map — what's waiting on what, and what would unblock the most work.

---

## Retrospective Module

Add a retro workflow as a complement to the Standup module. Covers what went well, what didn't, and action items. Produces a team-level retro summary and optionally feeds action items into the backlog inbox.

---

## Member Availability Tracking

Allow members to declare temporary unavailability (OOO, partial weeks, leave) on their profile. Surface availability alongside allocation when Fabric reasons about capacity so the two stay in sync.

---

## Release Notes / Changelog Generation

Add a `/report changelog` (or similar) that generates a product-focused summary of what was completed in a given period — drawing from closed backlog items, resolved requests, and context logs. Useful for stakeholder updates and release communication.

## Stakeholder Lifecycle Management

Add an `/add-stakeholder` command and a lightweight stakeholder lifecycle (active, disengaged, archived). Extend ingestion and triage to proactively surface which stakeholders are affected by a given request or product change.

---

## Scrum Module

Build out the Scrum module listed in the init form as "not yet available." Minimum viable scope: sprint ceremonies (planning, review, retro), velocity tracking, and sprint-level reporting. Should compose with the existing Standup, Backlog, and Iteration support.

---
