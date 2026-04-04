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

## Core Skills

<!-- Skills are implicit capabilities the AI uses during operations. Defined in .claude/skills/ -->

| Skill | Description |
|-------|-------------|
| identity | Resolve active user from `git config user.email`, load their profile, tailor context. |
| ingestion | Execute the three ingestion paths: quick file, direct ingest, staged batch. |
| entity-maintenance | Update entity headers, manage staleness flags, reconcile summaries when queried. |
| fabric-guidance | Help users understand and maintain their Fabric. Explain structure, suggest improvements, answer "how do I..." questions about the system itself. |
| reporting | Generate interactive HTML reports (mindmap, gantt) and markdown activity summaries from the backlog working memory. Handles data traversal, hours rollup from tasks, title shortening, and all three renderers. |

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
