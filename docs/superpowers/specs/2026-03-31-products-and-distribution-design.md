# Products Module & TeamFabric Distribution Model

## Overview

Two related design decisions: (1) how the `products/` module is structured, and (2) how TeamFabric is distributed to teams and kept up to date. Both are motivated by the goal of shipping Fabric to teams who will customize it heavily while still being able to receive framework updates cleanly.

## Products Module

### Purpose

Products represent cohesive components or deliverables a team owns. In many teams, the "product" is a platform with many components — each component is a product in Fabric. Products are **separate from the backlog** because backlog items (epics) frequently cut across multiple products.

### Directory Structure

```
products/
  <slug>/
    product.md
```

Products are flat — each gets a folder with a `product.md` file. No backlog nesting. Backlog items reference products through a `Products:` field rather than directory hierarchy.

### Product Entity File

Follows the standard Fabric layered entity structure:

```markdown
# Portal
Status: Active
Owner: Eric Winter
Repository: ../portal-api
Summary: Customer-facing API layer for the data platform. Q2 roadmap approved, focusing on v2 auth migration.

## Properties
Description: RESTful API serving the portal frontend and third-party integrations.
Stakeholders: Product Management, Security, External Partners
Key Repositories: ../portal-api, ../portal-shared

## Context Log
- 2026-03-15 - Eric (email): Leadership approved Q2 roadmap.
  Source: [email, subject: "Q2 Planning Sign-off"]
```

**Key fields:**
- `Status`: Active, Sunset, Planned, etc.
- `Owner`: Team member who owns this product
- `Repository`: Optional. The primary source repo — relative path, git URL, or absent. Teams decide their linking strategy (git subtree, sibling folder, remote repo). Fabric does not enforce. If a product has multiple repos, list them in `Key Repositories` under Properties.
- `Summary`: 2-3 sentence current state
- `Stakeholders`, `Description`: Standard Properties section
- `Context Log`: Product-level strategic context (not tied to specific epics)

### Relationship to Backlog

Products and backlog are separate modules. When the Backlog module is enabled:

```
products/
  portal/product.md
  data-pipeline/product.md

backlog/
  epics/
    E-001/
      epic.md            # Contains "Products: Portal, Data Pipeline"
      features/
        F-001/
          feature.md
          work-items/
            WI-001.md
```

Epics reference products via a `Products:` field, supporting many-to-many relationships. A product file may be the **only** representation of a product (no backlog, no external repo) or it may link outward to external systems.

## TeamFabric Distribution Model

### Architecture

TeamFabric is a **generator repo**, not a template to copy. Teams clone the TeamFabric repo, run `/init` to scaffold their instance, then pull updates and run `/update` to receive framework improvements.

### CLAUDE.md Update Problem

When a team adopts Fabric, `DRAFT_AGENTS.md` becomes their `CLAUDE.md`. Over time they add team-specific instructions. Framework updates to behavioral rules need to be applied without clobbering team customizations.

### Solution: Modular Framework Imports

Framework behavioral rules live in separate `.claude/fabric-*.md` files that are entirely framework-owned. The team's `CLAUDE.md` imports them via Claude Code's `@filename` syntax and adds team content below. Updates overwrite the module files — no merge conflicts, no parsing.

### Module Files

| File | Module | Always Present |
|------|--------|---------------|
| `fabric-core.md` | Core | Yes |
| `fabric-triage.md` | Triage | If enabled |
| `fabric-product.md` | Product | If enabled |
| `fabric-backlog.md` | Backlog | If enabled |
| `fabric-scrum.md` | Scrum | If enabled (future) |

**`fabric-core.md`** contains:
- User identification (git email matching against member profiles)
- Meta mode rules (structural file protection, enter/exit flow)
- Core commands table (init, add-member, bench-member, activate-member, readme, describe-team, status, ingest, meta)
- Core skills table (identity, entity-maintenance, ingestion, fabric-guidance)
- Staging directory behavior
- Context log format and conventions
- Staleness detection rules
- Entity file structure conventions

**`fabric-triage.md`** contains:
- Request lifecycle and workflow rules
- Evaluation command and behavior
- Rubric loading conventions
- Request archival rules

**`fabric-product.md`** contains:
- Product entity structure and conventions
- Repository linking behavior
- Product-level context log guidance

**`fabric-backlog.md`** contains:
- Epic > Feature > Work Item > Task hierarchy rules
- ID assignment conventions
- Cross-product referencing (the `Products:` field on epics)
- Status rollup behavior

**`fabric-scrum.md`** (future):
- Daily communication facilitation
- Sprint ceremony support

Each module file is self-contained enough to be understood on its own but may reference concepts from `fabric-core.md` (which is always present). No optional module file references another optional module.

### TeamFabric Repo Structure

```
TeamFabric/                        # The repo teams clone
├── CLAUDE.md                      # Advisor instructions (meta-level)
├── fabric-design-summary.md
├── .claude/
│   └── commands/
│       ├── init.md                # Scaffold a new team instance
│       └── update.md              # Apply framework updates to an instance
│
├── Fabric/                        # Framework source
│   ├── template/
│   │   ├── CLAUDE.md              # Template team CLAUDE.md with @imports
│   │   ├── fabric-core.md         # Core behavioral rules
│   │   ├── fabric-triage.md       # Triage module rules
│   │   ├── fabric-product.md      # Product module rules
│   │   ├── fabric-backlog.md      # Backlog module rules
│   │   └── fabric-scrum.md        # Scrum module rules (future)
│   ├── .claude/
│   │   ├── commands/              # Shipped slash commands
│   │   └── skills/                # Shipped skills
│   ├── team/
│   │   └── members/
│   │       └── template/          # Profile template
│   ├── staging/
│   │   └── README.md
│   ├── requests/                  # Default workflow and rubrics
│   │   ├── REQUESTS.md
│   │   └── workflow/
│   │       └── default/
│   └── products/                  # Empty scaffold
│
└── Example/                       # Test instance (fictional data, symlinked framework)
```

### `/init <target-folder>` Command

Runs from the TeamFabric repo. Flow:

1. Ask which modules to enable (Core is always on; then Triage, Product, Backlog, Scrum)
2. Copy the directory scaffold to the target folder:
   - `team/members/template/`
   - `staging/README.md`
   - `.claude/commands/` and `.claude/skills/`
   - Module-specific directories (`requests/`, `products/`, `backlog/`) based on selection
3. Copy the relevant `fabric-*.md` module files into `<target>/.claude/`
4. Generate `CLAUDE.md` with the correct `@` imports and a team-specific section stub
5. Kick off the guided team setup (team name, purpose, initial members)

### Generated Team CLAUDE.md

```markdown
@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md

# Riverdale Data Engineering

## Team-Specific Instructions
<!-- Everything below is yours. Fabric updates will not touch this section. -->
```

The `@` imports load framework rules first. Team-specific content follows — entirely team-owned, never overwritten by updates.

### `/update <target-folder>` Command

Runs from the TeamFabric repo. Behavior:

1. Overwrite `.claude/fabric-*.md` files that exist in the target (only files already present — does not add new modules)
2. Overwrite `.claude/commands/` and `.claude/skills/` (these are standalone, overwrite is safe)
3. Does **NOT** touch: `CLAUDE.md`, `team/`, `requests/`, `products/`, `backlog/`, `staging/`, or any team data
4. Report what changed (list of updated files, optionally a version or changelog summary)

Teams who have customized a skill or command will lose those customizations on update — this is by design. If they want to maintain custom versions, they rename the file (which breaks the update path for that file) and own it themselves.

### Enabling a New Module After Init

If a team wants to add a module later (e.g., enable Backlog after starting with only Core + Triage):

1. Run `/update` with a flag or a separate `/enable-module backlog` command
2. Copies `fabric-backlog.md` into `.claude/`
3. Scaffolds the `backlog/` directory structure
4. Adds the `@.claude/fabric-backlog.md` import to `CLAUDE.md`

This is an explicit opt-in — modules are never added silently by `/update`.
