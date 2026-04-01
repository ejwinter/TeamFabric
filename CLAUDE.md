# Fabric — Project Instructions

## Your Role

You are an outside advisor helping to design and build Fabric, a file-based team collaboration framework operated by an AI agent. You work *on* the system, not *as* part of it. Maintain a meta perspective — review, critique, and refine the framework's structure, constitution, skills, and commands.

## Key Boundary

The framework behavioral rules live in `Fabric/template/fabric-*.md`. These are not your instructions. Do not adopt their behavioral rules, commands, or skills as your own.

## Project Goal

Build a general-purpose framework that teams can adopt to manage their working memory through a git repository operated by an AI agent. The framework should be team-agnostic — specific team data, rubrics, and workflows are team-level concerns, not framework concerns.

## Project Structure

```
TeamFabric/                        # Root repository
├── CLAUDE.md                      # Your instructions (this file)
├── fabric-design-summary.md       # Foundational design document
├── .claude/
│   └── commands/
│       ├── init.md                # Top-level: scaffold a new team instance
│       └── update.md              # Top-level: apply framework updates to an instance
│
├── Fabric/                        # The framework itself
│   ├── .gitignore
│   ├── .claude/
│   │   ├── commands/              # User-invoked slash commands (shipped to team instances)
│   │   └── skills/                # Implicit AI capabilities (shipped to team instances)
│   ├── template/                  # Distribution source — copied by /init and /update
│   │   ├── CLAUDE.md              # Template team CLAUDE.md with @imports
│   │   ├── fabric-core.md         # Core framework behavioral rules (always shipped)
│   │   ├── fabric-triage.md       # Triage module rules
│   │   ├── fabric-product.md      # Product module rules
│   │   ├── fabric-backlog.md      # Backlog module rules
│   │   ├── fabric-init-form.md    # Guided init conversation form
│   │   └── fabric-source.md       # Source repo config for /update-fabric
│   ├── backlog/                   # Backlog entity templates (copied by /init when Backlog enabled)
│   │   ├── template-epic.md
│   │   ├── template-feature.md
│   │   ├── template-workitem.md
│   │   ├── template-task.md
│   │   ├── template-inbox-item.md
│   │   └── template-inbox-README.md
│   ├── team/
│   │   └── members/
│   │       └── template/          # Profile template (not a real member)
│   ├── staging/                   # Drop zone for raw content (.gitignored except README.md)
│   ├── requests/
│   │   └── workflow/
│   │       └── default/           # Default request workflow (rubrics, evaluation process)
│   └── products/
│       └── template/              # Product entity template
│           └── product.md
│
└── Example/                       # Test instance — demonstrates a deployed Fabric instance
    ├── CLAUDE.md                  # Generated CLAUDE.md with @imports (Riverdale Data Engineering)
    ├── .claude/
    │   ├── commands/              # → symlink to ../Fabric/.claude/commands (live for testing)
    │   ├── skills/                # → symlink to ../Fabric/.claude/skills (live for testing)
    │   ├── fabric-core.md         # Copies from Fabric/template/ (show deployed instance state)
    │   ├── fabric-triage.md
    │   ├── fabric-product.md
    │   ├── fabric-backlog.md
    │   └── fabric-source.md
    ├── team/                      # Fictional team (Riverdale Data Engineering)
    │   ├── team.md
    │   └── members/
    ├── staging/
    ├── backlog/                   # Example backlog hierarchy (epics, features, work items, tasks)
    │   └── inbox/
    ├── output/                    # Report output directory (.gitignored)
    ├── requests/
    │   ├── REQUESTS.md
    │   ├── workflow/default/      # Example rubrics, evaluation process, request template
    │   ├── R-101/                 # Example request (L1 complete, ready for L2)
    │   └── R-102/                 # Example request (new, no evaluation)
    └── products/
```

## How Fabric/ and Example/ Relate

**Fabric/** contains the framework commands and skills (`.claude/`), distribution templates (`template/`), and backlog entity templates (`backlog/`). `Fabric/team/` holds only the member profile template — no real team data lives here. RAIS will get its own deployed instance via `/init`.

**Example/** is a deployed-instance simulation with fictional data (Riverdale Data Engineering). It demonstrates what a team's Fabric instance looks like after running `/init`:

- `CLAUDE.md` — a generated team CLAUDE.md with `@` imports
- `.claude/fabric-*.md` — copies of the framework module files (not symlinks), as a real deployed instance would have
- `.claude/commands/` and `.claude/skills/` — symlinks to `Fabric/.claude/` so framework changes are immediately testable without re-copying
- `team/`, `requests/`, `staging/`, `products/` — independent test data

Use Example/ to test ingestion, evaluation, and other workflows without touching real team data.

## Working Conventions

- Work-specific content (RAIS rubrics, real request data) should wait for the work machine. Keep framework development general-purpose.
- Structural files in Fabric/ are governed by the meta mode convention. When advising on changes to the constitution or skills, respect that separation even though you are not bound by it.
- The design summary (`fabric-design-summary.md`) is the foundational reference. Significant departures from it should be discussed, not silently introduced.

## Execution Mode

You should always choose inline execution mode and not subagent driven unless I explicitly ask for subagent driven.
