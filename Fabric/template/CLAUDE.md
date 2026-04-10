@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md
@.claude/fabric-standup.md
@.claude/fabric-retro.md

# {{TEAM_NAME}}

<!--
  Everything below this line is yours. TeamFabric updates will not touch this section.

  FRAMEWORK-OWNED FILES — do not edit directly, changes will be overwritten on /update:
    .claude/fabric-*.md         Framework behavioral rules (@imported above)
    .claude/commands/           Built-in slash commands
    .claude/skills/             Built-in AI skills

  TO CUSTOMIZE BEHAVIOR:
    - Override or extend rules here, below the @imports (this section)
    - Add team-specific commands to .claude/commands/ with new names
    - Add team-specific skills to .claude/skills/ with new names
-->

## How We Work

<!-- Customize your team's working norms, communication preferences, and processes here.
     You can override module defaults in this section. For example, to customize
     backlog statuses:

     ### Backlog Statuses
     - Epic: New | Active | Resolved | Closed
     - Feature: New | Active | Resolved | Closed
     - Work Item: New | In Progress | In Review | Done
     - Task: New | Active | Done

     If your team works in fixed iterations, add this subsection (remove it if you don't use sprints):

     ### Iterations
     Iteration Start: YYYY-MM-DD
     Iteration Duration: 14 days
-->

## Knowledge Repositories

<!--
  One level-3 heading per repository. All fields are optional — a minimal entry is
  just a heading and a description of what lives there and what triggers a nudge.

  ### My Repo
  Readable: Yes          # agent can read local clone for context (requires Expect-Local)
  Writable: Yes          # agent can draft content into local clone (requires Expect-Local)
  Expect-Local: Yes      # expect a sibling folder; warn lazily if not found
  URL: https://...       # web URL or git remote; last path segment = expected folder name

  Description: what lives here, what triggers a nudge, how the team uses it.
-->

## Notification Rules

<!-- Who should be notified about what? Examples:
- Deadline changes on active engagements: notify [person]
- New request handoff: notify [person]
- Technical blockers: notify [person]
-->

## Constraints

<!-- Team-specific behavioral guardrails for the AI. Examples:
- This team does not follow Scrum. Do not suggest sprint-based workflows.
- All patient data references must be flagged for IRB review.
-->

## Enabled Modules

| Module | Status | Notes |
|--------|--------|-------|
| Core | Enabled | Team definition, members, constitution, ingestion, queries |
| Triage | Enabled | Request intake, workflows, rubric evaluation |
| Product | Enabled | Product definitions and context |
| Backlog | Disabled | Epic/feature/work-item hierarchy |
| Effort Tracking | Disabled | Capture actual hours on close, rollup to parent |
| Standup | Disabled | Daily standup conversations and team summary |
| Retrospective | Disabled | Periodic retros with team summary and action item routing |

