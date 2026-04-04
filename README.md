# Fabric

**A file-based team working memory system, operated by an AI agent.**

Fabric lives in a git repository. Your team drops raw content in — meeting notes, emails, Slack threads — and an AI agent organizes it into structured, queryable knowledge. You ask questions; it synthesizes across your team's history. You pick up work; it tells you what changed while you were away.

The goal is to lower the friction of keeping team knowledge current and actionable.

---

## The Problem

Teams accumulate knowledge in the wrong places. Meeting notes vanish into shared drives. Email threads carry critical decisions nobody can find later. New team members spend weeks piecing together context. Senior members carry institutional knowledge in their heads that disappears when they leave.

Existing tools — wikis, ticketing systems, project management software — require discipline to maintain. That discipline erodes under workload. The result is a team that knows more than its documentation reflects.

Fabric takes a different approach: **make it easy to put things in, and let the AI do the organizing.**

---

## Core Concepts

### Working Memory, Not an Archive

Fabric tracks the *current state* of things and enough context to understand how you got there. Original artifacts (emails, documents, recordings) live in your existing systems (SharePoint, email, shared drives). Fabric retains lean breadcrumbs — structured summaries with attribution and timestamps — not copies of source material.

### Human in the Loop

The AI proposes; you confirm. Summaries are reviewed before filing. First-class fields (status, owner, description) are curated by humans with AI assistance, not written autonomously. The AI is a collaborator, not an autonomous actor.

### Entities

Fabric organizes knowledge into a hierarchy of entities:

| Entity | Description |
|--------|-------------|
| **Team** | Top-level container — who you are, what you do, how you work |
| **Member** | Team members with roles, responsibilities, and context |
| **Product** | Broad deliverables the team owns |
| **Request** | Something someone has asked the team to work on, with structured evaluation |
| **Epic** | High-level initiative, often originating from an accepted request |
| **Feature** | Business-facing capability within an epic |
| **Work Item** | Assignable implementation work within a feature |
| **Task** | Finest-grained breakdown — name, status, assignee, hours |

Each entity uses a layered file structure: a lightweight summary (cheap to scan), structured first-class fields, and an append-only context log of sourced breadcrumbs.

### The Constitution

Each Fabric instance has a constitution (`DRAFT_AGENTS.md`) that serves two audiences simultaneously: the AI (behavioral rules, nudge triggers, workflow definitions) and humans (onboarding document, team reference, operating agreements). The AI reads this during operations and uses it to generate contextual nudges — gentle reminders about team norms, not blockers.

---

## How It Works

### Getting Content In

There are three ingestion paths:

**Quick file** — You provide content plus an entity hint ("this is about R-101"). The AI summarizes it against that entity's context, you confirm, done. One interaction.

**Direct ingest** — You provide content with no hint. The AI scans existing entities, proposes a classification and summary, you confirm or redirect.

**Staged batch** — You drop files into a `staging/` directory over time, then trigger a digest. The AI produces a structured plan showing every proposed action. You review and edit the plan, then execute. Best for complex content like meeting notes touching multiple entities.

The staging directory is gitignored (except a marker file), so raw content never enters version control.

### Getting Answers Out

Commands are invoked as slash commands in Claude Code:

- `/status` — Quick snapshot of team state: what's active, what's stale, what needs attention
- `/describe-team` — Narrative synthesis of the team, surfacing gaps and inconsistencies
- `/evaluate-request` — Run a request through rubric-based evaluation (L1 screening → L2 consultation)
- `/ingest` — Trigger the ingestion workflow

### Keeping It Honest

When new content arrives for an entity, Fabric flags that entity's summary as potentially stale rather than auto-rewriting it. When you next query that entity, the AI notes the staleness and offers to reconcile. Curated content is only updated with your confirmation.

---

## Current State

Fabric is in active development. The framework is complete and running against a real team. An example instance with fictional data is available for testing and demonstration.

### What's Built

| Component | Status |
|-----------|--------|
| Framework design and architecture | Complete |
| AI skill system (11 skills) | Complete |
| AI command system (24 commands) | Complete |
| Core, Triage, Product, and Backlog modules | Complete |
| Request evaluation framework (L1/L2 rubrics) | Complete |
| Effort tracking with additive rollup | Complete |
| Backlog refinement (DEEP principles) | Complete |
| HTML reporting — mindmap, Gantt, effort breakdown | Complete |
| Constitution format and defaults | Complete |
| Product repo integration patterns | Complete |
| Standup module — async daily standups with team summary | Complete |
| Retrospective module — periodic retros with lifecycle and action item routing | Complete |
| Entity transition guards with pre-flight checks and Definition of Done | Complete |
| Open questions and blockers tracking on all entities | Complete |
| Member onboarding orientation command | Complete |
| Example team instance (Riverdale Data Engineering) | Complete |

### Commands

| Command | Description |
|---------|-------------|
| `/init` | First-time setup wizard — team profile, constitution, member setup |
| `/ingest` | Ingest raw content into the working memory |
| `/status` | Quick team status snapshot |
| `/describe-team` | Narrative synthesis across the team's full history |
| `/evaluate-request` | Run L1/L2 rubric evaluation on a request |
| `/refine` | Backlog refinement conversation — classify, elaborate, split, estimate |
| `/rollup-backlog` | Refresh Child Summary sections on epics and features |
| `/report` | Generate reports: mindmap, gantt, effort breakdown, activity summaries |
| `/standup-discussion` | Daily standup conversation (Q&A or narrative mode); writes per-member record |
| `/retro create` | Open a new retrospective — sets period, questions, and participant list |
| `/retro` | Member retro input conversation (async, Q&A or narrative mode) |
| `/retro review` | Show participation status; optionally preview submitted themes |
| `/retro report` | Synthesize member inputs into an annotated draft for the team review meeting |
| `/retro close` | Finalize the annotated draft; write summary and mark retro closed |
| `/onboard` | Personalized orientation for a new team member — team context, work flow, Fabric operations |
| `/open-questions` | Surface unresolved questions and blockers across all entities (or scoped to one) |
| `/transition` | Guard and execute entity state transitions with pre-flight checks and DoD enforcement |
| `/submit-idea` | Submit feedback or feature suggestions for the Fabric framework |
| `/add-member` | Add a new team member (meta mode) |
| `/bench-member` | Deactivate a member (meta mode) |
| `/activate-member` | Restore a benched member (meta mode) |
| `/meta` | Toggle meta mode for structural edits |
| `/readme` | Generate a human-readable README for the Fabric instance |
| `/update-fabric` | Apply framework updates to an existing instance |

### Skills (Implicit AI Capabilities)

| Skill | Description |
|-------|-------------|
| `identity` | Resolves the active user from git config |
| `ingestion` | Three-path ingestion with deduplication and staging support |
| `request-evaluation` | Workflow-agnostic rubric engine that reads criteria from files |
| `backlog-refinement` | Progressive refinement using DEEP principles — classification, elaboration, splitting, estimation |
| `reporting` | Renderers for mindmap, Gantt, effort breakdown, and activity reports |
| `entity-maintenance` | Staleness detection, dirty flags, and summary reconciliation |
| `fabric-guidance` | Self-help for Fabric itself |
| `standup-context` | Pre-loads assigned work, recent commits, and team follow-ups before a standup conversation |
| `standup-report` | Collects all member standup records and produces the team-wide summary |
| `retro-report` | Synthesizes member retro inputs into a themed draft with addressal placeholders |
| `entity-transitions` | Guards and executes state transitions with DoD checks and human confirmation |

### What's Not Built Yet

- **Scrum module** — Sprint planning, velocity tracking, formal ceremony facilitation (deferred; standup and retro are available as standalone modules)
- **Query commands** — `personal-summary`, `team-summary` by period
- **Azure DevOps sync** — Bidirectional backlog synchronization
- **Multi-instance management** — Framework versioning and update propagation across instances

---

## Roadmap

### Near Term

- **Query commands** — personal and team summaries by time period
- **Cross-cutting content** — canonical home for meetings/emails; "what did we decide Tuesday?" queries
- **Initialization polish** — smoother `/init` experience for new teams

### Medium Term

- **Azure DevOps sync** — pull/push backlog items from ADO, reconcile differences
- **Richer product context** — product module expansion beyond definitions

### Later

- **Scrum module** — daily standup facilitation, blockers, capacity tracking
- **Multi-instance tooling** — framework versioning and update propagation
- **Other AI backends** — Fabric is currently Claude Code-specific; architecture supports other agents

---

## Getting Started

### Prerequisites

- [Claude Code](https://claude.ai/code) (the CLI or IDE extension)
- Git

### Set Up a New Fabric Instance

1. Create a new git repository for your team
2. Copy the framework files from `Fabric/.claude/` into your repo's `.claude/` directory
3. Copy `Fabric/DRAFT_AGENTS.md` to the root of your repo
4. Create the directory structure:
   ```
   mkdir -p team/members staging requests/workflow/default products
   ```
5. Open Claude Code in your repo and run:
   ```
   /init
   ```
   The wizard will walk you through creating your team.md, constitution, and first member profiles.

### Try the Example Instance

The `Example/` directory contains a fully initialized fictional team (Riverdale Data Engineering) with two example requests at different stages. It's symlinked to the framework files, so it reflects the current state of the framework.

Open Claude Code in `Example/` and try:
- `/status` — see the team snapshot
- `/evaluate-request R-102` — run L1 screening on a new request
- `/ingest` — drop a file into `Example/staging/` and try the ingestion workflow

### Adopt the Framework for an Existing Instance

If your team already has a Fabric instance and the framework has been updated:
1. Pull the latest framework files into your `.claude/` directory
2. Review `DRAFT_AGENTS.md` for any constitutional changes
3. Run `/describe-team` to surface any inconsistencies introduced by the update

---

## Integrating with Product Repos

Fabric manages work at the strategic level — epics, features, work items, and acceptance criteria. It is not designed to know the internals of every product repo. [`Fabric-Integration-Tips.md`](Fabric-Integration-Tips.md) documents patterns for bridging the gap: how to make a product repo Fabric-aware, how engineers pick up where Fabric's backlog breakdown ends, and how to pull a Fabric work item into [Backlog.md](https://backlog.md) to start planning an implementation.

---

## Design Principles

- **No raw content retention** — Fabric stores structured summaries, not original content. Raw content is discarded after processing unless explicitly told otherwise.
- **Human in the loop** — The AI proposes, the human confirms. Summaries are reviewed before filing.
- **Sensible defaults, team-refined** — Every aspect of Fabric ships with reasonable starting configuration that teams are encouraged to customize.
- **Constitution as living document** — The team constitution serves two audiences: the AI (behavioral rules) and humans (onboarding/reference).
- **Token-efficient by design** — Entity files are structured so lightweight headers can be scanned cheaply, with full context available on demand.
- **Nudges, not blockers** — The AI is a gentle enforcer of team norms. It reminds, it doesn't block.

---

## Project Structure

```
Fabric/                            # Root repository
├── README.md                      # This file
├── CLAUDE.md                      # Developer instructions (not for AI agents)
├── fabric-design-summary.md       # Foundational design document
│
├── Fabric/                        # The framework + real team instance (RAIS)
│   ├── DRAFT_AGENTS.md            # Constitution (AI behavioral contract + human reference)
│   ├── .claude/
│   │   ├── commands/              # 13 slash commands
│   │   └── skills/                # 7 implicit AI capabilities
│   ├── team/                      # Team and member profiles
│   ├── staging/                   # Drop zone for raw content (.gitignored)
│   ├── requests/                  # Request tracking and workflow definitions
│   └── products/                  # Product definitions
│
└── Example/                       # Test instance (Riverdale Data Engineering)
    ├── .claude → ../Fabric/.claude # Symlink — always uses current framework
    ├── DRAFT_AGENTS.md → ../Fabric/DRAFT_AGENTS.md
    ├── team/                      # Fictional team data
    ├── staging/
    ├── requests/                  # Two example requests (R-101, R-102)
    └── products/
```

The symlinks in `Example/` mean framework changes only need to be made once — the example instance always reflects the current framework.

---

## Status


We are iterating quickly. The design is solid; the edges are being refined through use.
