# Design: Fabric-Integration-Tips.md

**Date:** 2026-04-03  
**Status:** Approved  

## Problem

Fabric manages work at the strategic level — epics, features, work items, and acceptance criteria. But Fabric is not equipped to know the internals of every product repo, and tactical engineers need a way to pick up where Fabric's breakdown left off and drive spec-driven development inside their product repo.

The gap: no documented pattern exists for how a product repo connects to a Fabric instance and pulls a work item's acceptance criteria into a working implementation plan.

## Scope

A single markdown document (`Fabric-Integration-Tips.md`) at the repo root, referenced from `README.md`. No framework changes. No new commands or skills. Pure guidance — patterns teams can adopt as-is or extend.

## Deliverable

`Fabric-Integration-Tips.md` with four patterns:

### Pattern 1 — Make your product repo Fabric-aware

Add a convention line to the product repo's `CLAUDE.md` pointing at the Fabric instance. Recommended convention: sibling folder (e.g., `../team-fabric`). Any path works, but the sibling convention makes it easy for all engineers on a team to use the same line verbatim.

Example CLAUDE.md addition:

```markdown
## Team Fabric

Our Fabric instance is at `../team-fabric`. Read work items from there when planning implementation work.
```

This is the only setup required. Claude Code can navigate relative paths to read Fabric backlog files.

### Pattern 2 — The handoff model

Conceptual framing for teams adopting this workflow:

- **Fabric owns:** What needs to be built and why. Epics, features, work items, acceptance criteria, business context.
- **Product repo owns:** How it gets built. Technical specs, implementation plans, code, tests.

Engineers pick up where Fabric's backlog breakdown ends. The work item's acceptance criteria is the scope boundary — it defines done without prescribing implementation. No changes to Fabric are required for this model to work.

### Pattern 3 — Pull a Fabric story into Backlog.md

**Prerequisite:** Backlog.md initialized in the product repo (`backlog init`).

The engineer uses a single prompt to kick off the workflow:

> "Pull in `../team-fabric/backlog/epics/<epic-id>/features/<feature-id>/workitems/<workitem-id>/workitem.md` as a Backlog.md task and start planning an implementation."

What Claude does:

1. Reads the Fabric work item — title, description, acceptance criteria, and External URL if present
2. Creates a Backlog.md task via the backlog MCP, mapping fields:
   - Fabric `# Title` → Backlog.md `title`
   - Fabric `## Description` → task body
   - Fabric `## Acceptance Criteria` → Backlog.md `acceptance criteria` frontmatter list
   - Fabric `External URL` → carried over if present (preserves traceability to ADO etc.)
3. Begins implementation planning — using the AC as the scope boundary, generates a structured implementation plan within or linked from the task

The Backlog.md task becomes the engineer's working document. The Fabric work item is the source of truth for scope; the product repo task is the source of truth for how.

### Pattern 4 — Keeping Fabric current

Since the Fabric instance is a reachable path, the engineer can edit the Fabric work item directly from a product repo Claude Code session — updating acceptance criteria as requirements are clarified, or closing the work item when implementation is complete.

**Important:** Fabric is its own git repository. Changes made to Fabric files during a product repo session must be committed separately:

```bash
cd ../team-fabric
git add backlog/...
git commit -m "Close work item: <title>"
```

This bidirectional access means the Fabric story doesn't become stale — engineers can refine it as they learn more during implementation, without needing to switch contexts.

## Out of Scope

- Automated sync between Backlog.md tasks and Fabric work items
- New Fabric commands or skills
- Changes to fabric-backlog.md or any template files
- Shipping this file to team instances via `/init`

## README Update

`README.md` gets a brief mention of `Fabric-Integration-Tips.md` under a "Integrating with product repos" or similar heading, with a one-line description and link.
