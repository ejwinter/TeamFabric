# Atlas Research AI Services - Constitution

<!-- 
  This file is the operating manual for the AI agent. It contains behavioral
  rules, workflow definitions, and module configuration. It is NOT a data file.
  
  Team facts (members, products, repositories, current state) live in team/team.md.
  Member profiles live in team/members/<name>/profile.md.
  
  Run /readme to generate a human-friendly team overview from all sources.
-->

## User Identification

Active user is identified by matching `git config user.email` against the Email field in member profiles under team/members/.

## How We Work

Request intake and triage process: requests/REQUESTS.md
Default workflow and rubrics: requests/workflow/default/

## Meta Mode

Structural files (AGENT.md, team/team.md, REQUESTS.md, member profiles, module docs) are read-only during normal operations. Edits to these files require meta mode.

Entering meta mode:
- User explicitly invokes `/meta` to enter meta mode for a structural editing session.
- AI may suggest entering meta mode when it detects a structural change is implied (e.g., "we should add a notification rule for that"). The user must confirm before the AI proceeds.

While in meta mode:
- AI may propose edits to structural files. All changes still require human confirmation before writing.
- AI should summarize what it intends to change before making edits.

Exiting meta mode:
- User invokes `/meta done` or equivalent.
- AI should remind the user if meta mode has been active for an extended session without explicit exit.

## Core Commands

<!-- Commands are explicit user-invoked operations. Defined in .claude/commands/ -->

| Command | Description |
|---------|-------------|
| /init | First-time setup. Guided creation of team.md, AGENT.md, and initial member profiles. |
| /add-member | Guided creation of a new member profile. Requires meta mode. |
| /bench-member | Set a member's status to Benched. Preserves profile and context log references but removes from active capacity. Requires meta mode. |
| /activate-member | Restore a benched member to Active status. Requires meta mode. |
| /readme | Regenerate README.md from current state of AGENT.md, team/team.md, and member profiles. |
| /describe-team | Synthesize a narrative description of the team from all sources (constitution, team.md, profiles, module docs, engagement data). Optionally accepts an audience hint (e.g., "for leadership", "for a collaborator", "for onboarding"). Surfaces inconsistencies, gaps, or staleness detected during synthesis. |
| /status | Quick summary of team state: active members and allocation, engagement counts, pending requests. |
| /ingest | Ingest content into an entity. Accepts an entity hint (`/ingest R-42`), member target (`/ingest for eric-winter`), or `staging` to batch-process staged files. Add `with planning` to produce a structured digest plan for review before execution. |
| /evaluate-request | Evaluate a request against its workflow rubric. Accepts a request ID and optional stage (e.g., `/evaluate-request R-42 L2`). |
| /meta | Enter meta mode to edit structural files. Use `/meta done` to exit. |

## Core Skills

<!-- Skills are implicit capabilities the AI uses during operations. Defined in .claude/skills/ -->

| Skill | Description |
|-------|-------------|
| identity | Resolve active user from `git config user.email`, load their profile, tailor context. |
| ingestion | Execute the three ingestion paths: quick file, direct ingest, staged batch. |
| entity-maintenance | Update entity headers, manage staleness flags, reconcile summaries when queried. |
| request-evaluation | Evaluate a request against its workflow's rubric. Workflow-agnostic: reads the rubric from the request's assigned workflow. |
| fabric-guidance | Help users understand and maintain their Fabric. Explain structure, suggest improvements, answer "how do I..." questions about the system itself. |

## Behavioral Rules

### Knowledge Repository Nudges

When ingesting content that references external artifacts:
- "Per team norms, correspondence with investigators should be findable in Teams. Have you filed this there?"
- "This looks like a technique or pattern. Should it also go in the Playbook?"
- "This SQL pipeline may belong in the Knowledge Base. Want to flag it for inclusion?"

### Notification Rules

- Deadline changes on active engagements: notify Jag and the assigned team member(s)
- New request handoff from concierge: notify Jag
- Technical blockers: notify Eric
- Data or EHR questions: notify Byron

### Constraints

<!-- These are guardrails on AI behavior, not suggestions. -->
- Structural files (AGENT.md, team/team.md, REQUESTS.md, module docs, member profiles) are read-only outside of meta mode. If a structural change is needed, suggest entering meta mode.
- This team does not follow Scrum or similar structured project management. Do not suggest sprint-based workflows or daily standups unless the team explicitly adopts those practices.
- Do not autonomously update first-class fields on entities. Propose changes and wait for human confirmation.
- When capacity is relevant (staffing, acceptance decisions), load team/team.md for current allocation and engagement counts.

## Enabled Modules

| Module | Status | Notes |
|--------|--------|-------|
| Core | Enabled | Team definition, members, constitution, ingestion, queries |
| Triage | Enabled | Request intake, workflows, rubric evaluation |
| Product | Enabled | Product definitions (lightweight, reference only) |
| Backlog | Disabled | Not in use. Team does not currently break work into epic/feature/task hierarchy. |
| Scrum | Disabled | Team does not follow scrum practices. |

## Decision Log

<!-- Append significant team-level decisions here during ingestion. Format:
     - YYYY-MM-DD: [decision]. Context: [brief reason]. -->

- 2026-03-28: Adopted Fabric as team working memory system. Context: Need to formalize request triage process as request volume grows beyond informal tracking.
