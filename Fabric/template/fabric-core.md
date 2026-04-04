# TeamFabric Core

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
  Team-specific instructions belong in your CLAUDE.md, below the @import lines.
-->

## User Identification

Active user is identified by matching `git config user.email` against the Email field in member profiles under team/members/.

## Meta Mode

Structural files (CLAUDE.md framework imports, team/team.md, REQUESTS.md, member profiles, module docs) are read-only during normal operations. Edits to these files require meta mode.

Entering meta mode:
- User explicitly invokes `/meta` to enter meta mode for a structural editing session.
- AI may suggest entering meta mode when it detects a structural change is implied (e.g., "we should add a notification rule for that"). The user must confirm before the AI proceeds.

While in meta mode:
- AI may propose edits to structural files. All changes still require human confirmation before writing.
- AI should summarize what it intends to change before making edits.

Exiting meta mode:
- User invokes `/meta done` or equivalent.
- AI should remind the user if meta mode has been active for an extended session without explicit exit.

## Entity File Structure

Each entity uses a layered information architecture:

1. **Lightweight header/summary** — cheap to load, enough for AI to identify relevance quickly
2. **First-class structured fields** — curated artifacts (description, acceptance criteria, status, owner) maintained through human-guided refinement
3. **Context log** — append-only breadcrumb trail of sourced summaries from ingested content

### Context Log Entry Format

Lean breadcrumbs with enough "why" to answer follow-up questions:

```
- YYYY-MM-DD HH:MM - Who (contact) via channel: Summary of content with reasoning.
  Source: [location or reference to original artifact]
```

### Blocked Entities

Epics, features, work items, and requests can be marked blocked via a `Blocked:` property flag. The flag is an overlay on the entity's existing state — a work item can be Active and Blocked simultaneously.

**Property field:**
```
- Blocked: Yes
```
Set when a Blockers entry is created with `Status: Active`. Cleared (removed) when all Blockers entries are resolved. The flag exists for scannability; the detail lives in `## Blockers`.

**`## Blockers` section format:**
```
### [YYYY-MM-DD] Brief description of the block
- **Flagged by:** Name
- **Cause:** Open question / Dependency / External / Other — [reference the specific question or dependency by name if applicable]
- **Follow-up:** YYYY-MM-DD — [what will happen on that date, e.g. "checking back with vendor", "revisit after architecture meeting"]
- **Status:** Active | Resolved — YYYY-MM-DD ([how it resolved])
```

`Follow-up:` is optional. When set, the blocker is **parked** until that date — it is known and being managed. Omit when the blocker needs immediate attention or has no known check-in date.

**Cause types:**
- `Open question` — progress requires a decision that hasn't been made; reference the specific item in `## Open Questions`
- `Dependency` — waiting on another entity to complete; reference the item in `## Items this depends on`
- `External` — waiting on something outside the team's control (access, vendor, another team)
- `Other` — anything else; be specific in the description

**Agent behavior:**
- When a user indicates an entity is blocked ("this is blocked", "we're stuck on", "can't proceed until"), propose a Blockers entry. Ask: who flagged it, what's the cause, is there an existing open question or dependency this relates to? Optionally ask if there is a follow-up date.
- Do not write the entry or set `Blocked: Yes` without confirmation.
- When a blocker is resolved, propose updating the entry's Status and clearing `Blocked:` from Properties if no other active entries remain.
- When loading a blocked entity, surface the active blocker(s) prominently before other context.

**Surfacing logic (used by standup and reports):**
- A blocker or open question is **actionable** when: it has no follow-up date, or its follow-up date is today or in the past.
- A blocker or open question is **parked** when its follow-up date is in the future.
- Actionable items are surfaced prominently. Parked items are acknowledged in aggregate ("2 parked blockers") but not listed in detail until their follow-up date arrives.

### Open Questions and Decisions

Entities carry two companion sections for tracking knowledge gaps and choices:

**`## Open Questions`** — unchecked items are unresolved questions. Format:
```
- [ ] Question text *(asked by Name, YYYY-MM-DD)*
- [ ] Question text *(asked by Name, YYYY-MM-DD — follow-up: YYYY-MM-DD)*
- [x] Resolved question *(asked by Name, YYYY-MM-DD — resolved YYYY-MM-DD)*
```

`follow-up: YYYY-MM-DD` is optional. When set, the question is parked until that date and not surfaced as actionable beforehand. Apply the same surfacing logic as blockers.

**`## Decisions`** — structured record of choices made. Format:
```
### [YYYY-MM-DD] Decision title
- **Decided by:** Name
- **Recorded by:** Name or Claude (ingestion)
- **Options considered:** Option A (rejected: reason), Option B (rejected: reason), chosen option
- **Rationale:** Why this option was chosen
```

**Lifecycle:** An open question is an unresolved decision. When it resolves: check the box, add a Decisions entry. The resolved question provides the "why we asked" context; the decision entry provides the answer.

**Agent behavior:**
- During ingestion or conversation, detect decision language ("we decided to...", "going with X over Y", "we chose...") and propose a Decisions entry. Do not write silently — show the proposed entry and confirm.
- Detect unresolved questions or blockers ("we need to figure out...", "open question:", "TBD:") and propose an Open Questions entry. Same confirmation requirement.
- User can also explicitly request: "log a decision" or "add this as an open question on [entity]."

### Definition of Done

Every entity type has an **implicit Definition of Done** — structural completion criteria that apply without being written down:

| Entity type | Implicit DoD |
|---|---|
| Epic | All child features are Closed, Resolved, or Removed |
| Feature | All child work items are Closed, Resolved, or Removed |
| Work item | All Acceptance Criteria are reviewed as met; all child tasks are Closed or Removed |
| Task | No structural implicit DoD — explicit criteria only |

Entities may also carry an **explicit `## Definition of Done` section** — a checklist of additional completion criteria beyond the implicit ones. This section is optional; most entities won't need it. Use it for criteria that aren't structurally detectable: "deployed to staging", "stakeholder sign-off received", "documentation updated."

**Format:**
```
## Definition of Done

- [ ] Additional criterion specific to this entity
- [ ] Another criterion
- [x] Criterion already confirmed met
```

**Agent behavior during close/resolve (invoked by the `entity-transitions` skill):**
1. Run implicit DoD checks first (programmatically — count children by state, review acceptance criteria).
2. If the entity has an explicit `## Definition of Done` section, walk through any unchecked items with the user.
3. Present the full picture before asking for close confirmation.
4. Do not close an entity over unmet DoD criteria without the user explicitly acknowledging and overriding.

### Staleness Detection

When new content is ingested against an entity, its summary may become outdated. Do not proactively rewrite summaries. Instead, flag entities as potentially stale when new context arrives. When someone queries that entity, note the staleness and offer to reconcile.

## Staging Directory

The `staging/` directory is a drop zone for raw content. All contents except `README.md` are in `.gitignore` and are local to the workstation (effectively per-member). Content is cleared after processing.

## Core Commands

<!-- Commands are explicit user-invoked operations. Defined in .claude/commands/ -->

| Command | Description |
|---------|-------------|
| /member | Member lifecycle and capacity management. Subcommands: `add` (requires meta mode), `bench` (requires meta mode), `activate` (requires meta mode), `timeoff` (meta mode required only when recording for another member). |
| /readme | Regenerate README.md from current state of CLAUDE.md, team/team.md, and member profiles. |
| /describe-team | Synthesize a narrative description of the team from all sources. Optionally accepts an audience hint (e.g., "for leadership", "for onboarding"). Surfaces inconsistencies, gaps, or staleness. |
| /status | Quick summary of team state: active members and allocation, engagement counts, pending requests. |
| /ingest | Ingest content into an entity. Accepts an entity hint (`/ingest R-42`), member target (`/ingest for eric-winter`), or `staging` to batch-process staged files. Add `with planning` to produce a structured digest plan for review before execution. |
| /meta | Enter meta mode to edit structural files. Use `/meta done` to exit. |
| /update-fabric | Apply updates from the TeamFabric source repo to this instance. Uses `.claude/fabric-source.md` to locate the source; falls back to cloning from the remote URL; asks if both fail. |
| /report | Generate reports from the backlog: `mindmap` (D3 radial tree), `gantt` (D3 timeline), or `day/week/month/quarter/year` (markdown activity summary). Requires Backlog module for mindmap and gantt. |
| /open-questions | List all unchecked open questions across the instance. Default output groups by entity. Accepts an optional entity hint (`/open-questions R-42`) to scope to one entity. Useful for answering "what's blocking X?" |
| /transition | Manage entity state transitions with pre-flight checks. Usage: `/transition [entity] [to-state]`. Supported transitions: New → Active (checks blockers and open questions), Active → Resolved/Closed (walks acceptance criteria), Any → Removed (scans dependents). Never deletes entity files. |

## Core Skills

<!-- Skills are implicit capabilities the AI uses during operations. Defined in .claude/skills/ -->

| Skill | Description |
|-------|-------------|
| identity | Resolve active user from `git config user.email`, load their profile, tailor context. |
| ingestion | Execute the three ingestion paths: quick file, direct ingest, staged batch. |
| entity-maintenance | Update entity headers, manage staleness flags, reconcile summaries when queried. |
| fabric-guidance | Help users understand and maintain their Fabric. Explain structure, suggest improvements, answer "how do I..." questions about the system itself. |
| entity-transitions | Guard and execute state transitions for entities. Checks blockers, open questions, acceptance criteria, and dependents before writing any state change. Invoked by `/transition` or implicitly when state-change intent is detected in conversation. |
| reporting | Generate interactive HTML reports (mindmap, gantt) and markdown activity summaries from the backlog working memory. Handles data traversal, hours rollup from tasks, title shortening, and all three renderers. |

## Framework File Ownership

The following files are owned by the TeamFabric framework and will be overwritten when `/update-fabric` runs:

- `.claude/fabric-*.md` — framework behavioral rules
- `.claude/commands/` — built-in slash commands
- `.claude/skills/` — built-in AI skills

If a user asks to modify any of these files, do not edit them. Instead, redirect to the appropriate override mechanism:

- **Behavioral rules** — add overrides in `CLAUDE.md` below the `@import` lines
- **Command behavior** — add a new command in `.claude/commands/` with a team-specific name
- **Skill behavior** — add a new skill in `.claude/skills/` with a team-specific name

These files may only be edited via meta mode during an `/update-fabric` operation or when explicitly working on the framework itself (i.e., from the TeamFabric source repo). Surface this constraint clearly if a user attempts to modify them.

## Behavioral Defaults

### Knowledge Repository Nudges

When ingesting content that references external artifacts, nudge (do not block) the user about filing in appropriate external systems. Teams should customize these nudges in their CLAUDE.md based on their knowledge repositories.

### Constraints

- Structural files are read-only outside of meta mode. If a structural change is needed, suggest entering meta mode.
- Do not autonomously update first-class fields on entities. Propose changes and wait for human confirmation.
- When capacity is relevant (staffing, acceptance decisions), load team/team.md for current allocation and engagement counts.
- When communications, escalations, or decisions involve external parties, load team/team.md and surface relevant stakeholders from the `## Stakeholders` section. Do not assume the user knows who to loop in.

### Stakeholder Profiles

Some stakeholders have profile directories at `team/stakeholders/<name>/profile.md`. Profiles are optional — not all stakeholders have them. The `## Stakeholders` table in `team/team.md` is always the index.

- **Discovery**: When surfacing a stakeholder, check for `team/stakeholders/<name>/profile.md`. If it exists, load it for richer context (communication preferences, expertise, areas of interest). Fall back to the table row if no profile exists.
- **Ingestion**: Stakeholder profiles are valid ingest targets. When the user targets a stakeholder by name (e.g., `/ingest for theresa-blount`), route to `team/stakeholders/<name>/profile.md` and append to the context log.
- **Transitions**: Moving a stakeholder to a team member (or vice versa) is a conversational meta-mode action. Propose: move the profile directory (`team/stakeholders/<name>/` → `team/members/<name>/`), update profile fields to match the destination template, update `team.md` tables. The context log carries over intact.
