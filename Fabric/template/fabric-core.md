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
| /member | Member lifecycle and capacity management. Subcommands: `add` (requires meta mode), `depart` (requires meta mode), `activate` (requires meta mode), `timeoff` (meta mode required only when recording for another member). |
| /stakeholder | Stakeholder lifecycle management. Subcommands: `add` (requires meta mode), `depart` (requires meta mode), `activate` (requires meta mode). |
| /readme | Regenerate README.md from current state of CLAUDE.md, team/team.md, and member profiles. |
| /describe-team | Synthesize a narrative description of the team from all sources. Optionally accepts an audience hint (e.g., "for leadership", "for onboarding"). Surfaces inconsistencies, gaps, or staleness. |
| /status | Quick summary of team state: active members and allocation, engagement counts, pending requests. |
| /ingest | Ingest content into an entity. Accepts an entity hint (`/ingest R-42`), member target (`/ingest for eric-winter`), or `staging` to batch-process staged files. Add `with planning` to produce a structured digest plan for review before execution. |
| /meta | Enter meta mode to edit structural files. Use `/meta done` to exit. |
| /update-fabric | Apply updates from the TeamFabric source repo to this instance. Uses `.claude/fabric-source.md` to locate the source; falls back to cloning from the remote URL; asks if both fail. |
| /report | Generate reports from the backlog: `mindmap` (D3 radial tree), `gantt` (D3 timeline), or `day/week/month/quarter/year` (markdown activity summary). Requires Backlog module for mindmap and gantt. |
| /open-questions | List all unchecked open questions across the instance. Default output groups by entity. Accepts an optional entity hint (`/open-questions R-42`) to scope to one entity. Useful for answering "what's blocking X?" |
| /transition | Manage entity state transitions with pre-flight checks. Usage: `/transition [entity] [to-state]`. Supported transitions: New → Active (checks blockers and open questions), Active → Resolved/Closed (walks acceptance criteria), Any → Removed (scans dependents). Never deletes entity files. |
| /check | Instance health lint. Scans for coherence problems: integrity violations, drift, orphaned references, schema mismatches. `/check` reports findings; `/check --fix` enters an interactive resolution session; `/check [entity]` scopes to one entity or subtree. |

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

### Agent-First Workflow

Teams and members should do most of their work through the agent — commands and conversation — rather than editing files directly. Direct file edits are always possible, but the agent path is strongly preferred because it ensures the framework's checks and processes actually run.

Examples of why this matters:
- Using `/transition` to close a work item runs acceptance criteria review, child-completion checks, and writes `Terminated:` — direct edits skip all of that.
- Using `/member depart` writes `Terminated:` and updates capacity in `team.md` atomically — a manual edit to `Status:` does neither.
- Using `/evaluate-request` loads the current rubric from the workflow definition — doing it conversationally without the command risks evaluating from stale or assumed criteria.

When a user edits a file directly in a way that bypasses a command path, the agent should notice and offer to complete the associated checks retroactively. For example: if `State: Closed` is detected on a file with no `Terminated:` date, offer to run the close checks and backfill the date rather than silently accepting the raw edit.

This principle applies to team members and leads alike. It is not a restriction — it is a practice that keeps the system's working memory coherent.

### Contextual Authority

Not all inputs carry equal weight. When synthesizing conflicting statements, answering questions with multiple perspectives, or proposing a recommendation where disagreement exists, the agent should apply contextual authority — the relative weight of a perspective given the specific question or domain at hand.

**Sources of authority inference** (in approximate order of specificity):
- **Expertise** — the `## Expertise` section of a member or stakeholder profile is the strongest signal. A member listed as expert in a domain is the most authoritative voice on questions in that domain.
- **Role and title** — inferred from the `Role:` and `Team Function:` profile fields. A Principal Engineer carries more architectural authority; a PM carries more business value authority.
- **Domain proximity** — who is closest to the work? The person actively building something understands its current state better than anyone reviewing it from a distance.
- **Stakeholder interests** — stakeholder profiles carry areas of interest. A stakeholder with a known interest in compliance carries authority on compliance-related questions.

**Key constraint:** authority is always contextual, never global. The architect is authoritative on system design questions; the engineer closest to the code may be more authoritative on implementation feasibility for the same feature. Weight shifts with the question.

**Agent behavior when inputs conflict:**
- Do not silently average or suppress dissenting views.
- Surface the conflict explicitly: who said what and why their perspective carries weight in this context.
- Propose a resolution that accounts for domain authority, and explain the reasoning.
- When authority is ambiguous (two people have overlapping expertise), flag it as a genuine judgment call requiring human resolution rather than pretending confidence.

This principle applies during ingestion, evaluation, triage, and any conversation where the agent is synthesizing perspectives to form a recommendation.

### Knowledge Repository Nudges

Teams define their knowledge repositories in the `## Knowledge Repositories` section of their CLAUDE.md using level-3 headings — one heading per repository. During `/ingest` and `/refine`, evaluate content against all defined repositories and nudge (do not block) the user when something looks like it belongs in one of them. Use the free-form description under each heading to inform what triggers a nudge for that repository.

#### Repository Entry Format

```markdown
### Repository Name
Readable: Yes          # optional — default No
Writable: Yes          # optional — default No
Expect-Local: Yes      # optional — default No; signals a local clone is expected
URL: https://...       # optional — web URL or git remote

Free-form description: what lives here, what triggers a nudge, how the team uses it.
```

All fields are optional. A minimal entry is just a heading and description.

#### Local Path Resolution

When `Expect-Local: Yes` is set, the agent expects a sibling directory next to the Fabric instance:
- If `URL:` is present: infer the folder name from the last path segment of the URL (e.g. `https://github.com/org/internal-docs` → `../internal-docs`).
- If no `URL:`: use the heading name lowercased and hyphenated.

The sibling check is **lazy** — performed only when the agent actually attempts to read or write the repository, not on session load. If the folder is not found at that moment, surface a warning and continue:

> "We are unable to locate [repo name] at [expected path]. Clone the repository to enable [read/write] access."

#### Readable Behavior

When `Readable: Yes` and `Expect-Local: Yes`: the agent may read from the sibling folder to provide context (recent content, existing pages) when relevant to the current ingest or refine session. Do not read proactively on every query — read on demand when the content would improve a nudge or answer.

#### Writable Behavior

When `Writable: Yes` and `Expect-Local: Yes`: the agent may propose drafting content into the sibling folder. Always propose the draft content and target path for confirmation before writing. After writing:
1. Append a context log entry to the originating entity noting the draft path and date.
2. Remind the user that they need to go to that repository to review and commit the draft — the agent does not commit on their behalf.

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

## Fabric GC

The `/clean-fabric` command scans the instance for stale and terminal-state artifacts and removes or archives them after review. Default retention is 90 days after `Terminated:` for most artifacts; 1 year for epics and requests.

The `/check` command scans for active integrity violations — drift, orphaned references, schema mismatches, and field inconsistencies. `/clean-fabric` removes the dead; `/check` keeps the living honest. Teams that want a single maintenance cadence can run both in sequence.

Teams may override defaults by adding a `## Fabric GC` table to their `CLAUDE.md` or `team/team.md`:

```markdown
## Fabric GC

| Artifact | Retention |
|----------|-----------|
| standup-log | 180 days |
| retro | 1 year |
| member | 1 year |
```

Valid artifact keys: `epic`, `request`, `feature`, `workitem`, `task`, `inbox-item`, `standup-log`, `discuss-log`, `retro`, `member`, `stakeholder`, `product`.

When a team member asks "how do I change retention for X?", point them to this table and explain that it overrides the framework defaults for that artifact type only.
