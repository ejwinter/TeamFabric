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
| AI skill system (5 skills) | Complete |
| AI command system (10 commands) | Complete |
| Request evaluation framework (L1/L2 rubrics) | Complete |
| Core, Triage, and Product modules | Complete |
| Constitution format and defaults | Complete |
| Example team instance (Riverdale Data Engineering) | Complete |

### Commands Available

| Command | Description |
|---------|-------------|
| `/init` | First-time setup wizard — creates team.md, constitution, and member profiles |
| `/ingest` | Ingest content into the working memory |
| `/status` | Quick team status snapshot |
| `/describe-team` | Synthesize a narrative of the team |
| `/evaluate-request` | Run rubric evaluation on a request |
| `/add-member` | Add a new team member (requires meta mode) |
| `/bench-member` | Deactivate a member (requires meta mode) |
| `/activate-member` | Restore a benched member (requires meta mode) |
| `/meta` | Toggle meta mode for structural edits to the framework itself |
| `/readme` | Generate a human-readable README for the Fabric instance |

### Skills (Implicit AI Capabilities)

| Skill | Description |
|-------|-------------|
| `identity` | Resolves the active user from git config — the AI knows who it's talking to |
| `ingestion` | Three-path ingestion with deduplication and staging support |
| `request-evaluation` | Workflow-agnostic rubric engine that reads criteria from files |
| `entity-maintenance` | Staleness detection, dirty flags, and summary reconciliation |
| `fabric-guidance` | Self-help for Fabric itself — "how do I...?" questions |

### What's Not Built Yet

- **Backlog module** — Epic → Feature → Work Item → Task hierarchy (designed, not implemented)
- **Scrum module** — Daily communication facilitation (deferred)
- **Query commands** — `personal-summary` ("what should I know this morning?"), `team-summary` by period
- **Azure DevOps sync** — Bidirectional backlog synchronization
- **Multi-instance management** — Framework updates propagating across instances

---

## Roadmap

### Near Term

- **Query commands** — personal and team summaries by time period, with staleness handling
- **Refinement workflow** — the "check for new context before picking up work" pattern
- **Cross-cutting content** — canonical home for meetings/emails beyond decomposed breadcrumbs; "what did we decide Tuesday?" queries
- **Initialization polish** — smoother `/init` experience for new teams

### Medium Term

- **Backlog module** — Epic → Feature → Work Item → Task hierarchy with full ingestion support
- **Products module** — richer product context beyond simple definitions
- **Azure DevOps sync** — pull/push backlog items from ADO, reconcile differences

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
│   │   ├── commands/              # 10 slash commands
│   │   └── skills/                # 5 implicit AI capabilities
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
