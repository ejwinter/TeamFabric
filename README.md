# TeamFabric

**A file-based working memory system for software teams, operated by an AI agent.**

Fabric lives in a git repository. Your team drops raw content in — meeting notes, emails, decisions, standup updates — and an AI agent organizes it into structured, queryable knowledge. You ask questions; it synthesizes across your full history. You pick up work; it tells you what changed, what's blocked, and what needs a decision.

The goal is to lower the friction of keeping team knowledge current and actionable, so teams can spend less time managing context and more time building.

> **Go deeper:** A NotebookLM project with deep dives, audio overviews, and generated documents is maintained at [notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9](https://notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9). Content there is continuously updated and may drift from the current codebase — this README is the authoritative reference.

---

## The Problem

Teams accumulate knowledge in the wrong places. Meeting notes vanish into shared drives. Email threads carry critical decisions nobody can find later. New team members spend weeks piecing together context. Senior members carry institutional knowledge in their heads that disappears when they leave.

Existing tools — wikis, ticketing systems, project management software — require discipline to maintain. That discipline erodes under workload. The result is a team that knows more than its documentation reflects.

**Fabric takes a different approach: make it easy to put things in, and let the AI do the organizing.**

---

## How It Works

### Getting Content In

Three ingestion paths, all human-confirmed before anything is filed:

**Quick file** — Provide content plus an entity hint ("this is about R-101"). The AI summarizes it against that entity's context and proposes the entry. One interaction.

**Direct ingest** — Provide content with no hint. The AI scans existing entities, proposes a classification and summary, you confirm or redirect.

**Staged batch** — Drop files into `staging/` over time, then trigger a digest. The AI produces a structured plan showing every proposed action. Review and edit the plan, then execute. Best for complex content like meeting notes touching multiple entities.

### Getting Answers Out

Commands are slash commands invoked in Claude Code:

- `/status` — Team snapshot: active epics, pending requests, blockers, capacity
- `/describe-team` — Narrative synthesis across the team's full history
- `/evaluate-request` — Structured rubric evaluation on a request
- `/refine` — Backlog refinement conversation: classify, elaborate, split, estimate
- `/report` — Generate HTML mindmaps, Gantt timelines, or effort breakdown reports

### Keeping It Honest

When new content arrives for an entity, Fabric flags that entity's summary as potentially stale rather than auto-rewriting it. When you next query that entity, the AI notes the staleness and offers to reconcile. Curated content is only updated with your confirmation.

---

## Modules

Enable only what fits your team. All modules are opt-in at `/init` time.

| Module | What It Does |
|--------|-------------|
| **Core** | Team definition, member profiles, ingestion, basic queries — always enabled |
| **Triage** | Request intake with customizable workflow, rubric-based evaluation (L1/L2), What's Next checklists, and promotion to backlog |
| **Product** | Product definitions with ownership, status, stakeholder context, and repo linking |
| **Backlog** | Epic → Feature → Work Item → Task hierarchy with Definition of Done enforcement, team-defined templates, effort tracking, and HTML reporting |
| **Standup** | Async daily standups with per-member records and team-wide summary generation |
| **Retrospective** | Periodic retros with individual input, themed synthesis, and action item routing |

---

## What's Built

| Capability | Status |
|------------|--------|
| Core, Triage, Product, and Backlog modules | Complete |
| Standup and Retrospective modules | Complete |
| Request evaluation framework (configurable L1/L2 rubrics) | Complete |
| Request → Epic and Request → Feature promotion paths | Complete |
| What's Next checklists on requests | Complete |
| Team-defined backlog item templates | Complete |
| Effort tracking with additive rollup across hierarchy | Complete |
| Backlog refinement using DEEP principles | Complete |
| Entity transition guards with Definition of Done enforcement | Complete |
| Open questions and blockers tracking on all entities | Complete |
| Repository linking on epics and requests | Complete |
| HTML reporting — mindmap, Gantt, effort breakdown | Complete |
| Fabric GC (`/clean-fabric`) with configurable retention | Complete |
| Member lifecycle — add, depart, activate, time off | Complete |
| Member onboarding orientation | Complete |
| AI skill system (11 skills) | Complete |
| Command system (19 commands) | Complete |
| Example instance (Riverdale Data Engineering) | Complete |

### What's Not Built Yet

- **Scrum module** — Sprint planning, velocity tracking, formal ceremony facilitation
- **Query commands** — `personal-summary`, `team-summary` by time period
- **Azure DevOps sync** — Bidirectional backlog synchronization
- **Multi-instance management** — Framework versioning across deployed instances

---

## Commands

| Command | Description |
|---------|-------------|
| `/init` | Scaffold a new Fabric instance — guided wizard or form-driven |
| `/ingest` | Ingest raw content into an entity |
| `/status` | Quick team status snapshot |
| `/describe-team` | Narrative synthesis across the team's full history |
| `/evaluate-request` | Run rubric evaluation on a request |
| `/refine` | Backlog refinement conversation — classify, elaborate, split, estimate |
| `/rollup-backlog` | Refresh Child Summary sections on epics and features |
| `/report` | Generate reports: mindmap, Gantt, effort breakdown, activity summaries |
| `/standup-discussion` | Async standup conversation (Q&A or narrative mode) |
| `/retro create` | Open a new retrospective |
| `/retro` | Member retro input conversation |
| `/retro review` | Show participation status and submitted themes |
| `/retro report` | Synthesize member inputs into an annotated draft |
| `/retro close` | Finalize draft, write summary, mark retro closed |
| `/transition` | Guard and execute entity state transitions with DoD checks |
| `/open-questions` | Surface unresolved questions and blockers across all entities |
| `/onboard` | Personalized orientation for a new team member |
| `/clean-fabric` | Review and remove stale or terminal-state artifacts |
| `/member` | Member lifecycle: `add`, `depart`, `activate`, `timeoff` |
| `/meta` | Toggle meta mode for structural edits |
| `/update-fabric` | Apply framework updates to an existing instance |
| `/submit-idea` | Submit feedback or feature suggestions for TeamFabric |

---

## Skills (Implicit AI Capabilities)

| Skill | Description |
|-------|-------------|
| `identity` | Resolves the active user from git config; loads their profile |
| `ingestion` | Three-path ingestion with deduplication and staging support |
| `request-evaluation` | Workflow-agnostic rubric engine that reads criteria from files |
| `backlog-refinement` | Progressive refinement using DEEP principles — classification, elaboration, splitting, estimation |
| `entity-transitions` | Guards and executes state transitions with DoD checks and human confirmation |
| `entity-maintenance` | Staleness detection, dirty flags, and summary reconciliation |
| `reporting` | Mindmap, Gantt, effort breakdown, and activity report renderers |
| `standup-context` | Pre-loads assigned work, recent commits, and team follow-ups before standup |
| `standup-report` | Collects member standup records and produces the team-wide summary |
| `retro-report` | Synthesizes member retro inputs into a themed draft |
| `fabric-guidance` | Self-help for Fabric itself — structure, conventions, common questions |

---

## Getting Started

### Prerequisites

- [Claude Code](https://claude.ai/code) (CLI or IDE extension)
- Git

### Scaffold a New Instance

```bash
# Clone this repo, then from the TeamFabric directory:
# /init creates the new instance as a sibling directory
```

Open Claude Code in the TeamFabric repo and run:
```
/init MyTeamName
```

The wizard walks you through team profile, module selection, constitution setup, and first member profiles. Alternatively, request a form: `/init MyTeamName` → "generate a form" to fill out at your own pace.

### Try the Example First

The `Example/` directory contains a fully initialized fictional team (Riverdale Data Engineering) with two example requests at different stages. Commands and skills are symlinked to the live framework, so it always reflects the current state.

Open Claude Code in `Example/` and try:
- `/status` — see the team snapshot
- `/evaluate-request R-102` — run L1 screening on a new request
- `/refine` — start a backlog refinement conversation

---

## Project Structure

```
TeamFabric/
├── CLAUDE.md                      # Developer instructions (meta perspective on the framework)
├── README.md                      # This file
├── PITCH.md                       # Value proposition
├── welcome.md                     # Welcome doc for Fabric instance users
├── fabric-design-summary.md       # Foundational design document
│
├── .claude/
│   └── commands/
│       ├── init.md                # Scaffold a new team instance
│       └── update.md              # Apply framework updates
│
├── Fabric/                        # The framework
│   ├── .claude/
│   │   ├── commands/              # Shipped slash commands
│   │   └── skills/                # Shipped AI skills
│   ├── template/                  # Distribution source — copied by /init and /update
│   │   ├── CLAUDE.md              # Template team constitution with @imports
│   │   ├── fabric-core.md         # Core behavioral rules (always shipped)
│   │   ├── fabric-triage.md       # Triage module rules
│   │   ├── fabric-product.md      # Product module rules
│   │   ├── fabric-backlog.md      # Backlog module rules
│   │   └── ...
│   ├── backlog/                   # Backlog entity templates (copied by /init)
│   ├── team/members/template/     # Member profile template
│   ├── requests/workflow/default/ # Default request workflow and rubrics
│   └── products/template/         # Product entity template
│
└── Example/                       # Test instance (Riverdale Data Engineering)
    ├── CLAUDE.md                  # Generated constitution with @imports
    ├── .claude/
    │   ├── commands/              # → symlink to Fabric/.claude/commands/
    │   ├── skills/                # → symlink to Fabric/.claude/skills/
    │   └── fabric-*.md            # Copies from template/ (deployed instance state)
    ├── team/                      # Fictional team data
    ├── backlog/
    │   ├── epics/                 # Example epics and features
    │   ├── inbox/
    │   └── templates/             # Example team-defined item templates
    ├── requests/                  # Two example requests (R-101, R-102)
    └── products/
```

---

## Design Principles

- **No raw content retention** — Fabric stores structured summaries, not original content. Raw content is discarded after processing unless explicitly kept.
- **Human in the loop** — The AI proposes, the human confirms. Summaries are reviewed before filing. First-class fields are curated, not written autonomously.
- **Sensible defaults, team-refined** — Every aspect of Fabric ships with reasonable starting configuration that teams customize to fit how they actually work.
- **Constitution as living document** — The team constitution (`CLAUDE.md`) serves two audiences simultaneously: the AI (behavioral rules) and humans (onboarding reference, operating agreements).
- **Token-efficient by design** — Entity files use a layered structure so lightweight headers can be scanned cheaply, with full context loaded on demand.
- **Nudges, not blockers** — The AI is a gentle enforcer of team norms. It reminds; it doesn't block.
- **Framework-agnostic** — Fabric is not tied to any particular methodology. Teams bring their own rubrics, workflows, and definitions of done.

---

## Who Built This

TeamFabric was built by Eric Winter — a project management practitioner with a Master of Science in Project Management and 20 years of experience leading and supporting software delivery teams. The framework was built in parallel with its first real-world deployment, solving a problem the author has felt firsthand across two decades of team work.

The premise: most AI tools for teams are built by engineers guessing at the problem. TeamFabric is built by someone who lived it.
