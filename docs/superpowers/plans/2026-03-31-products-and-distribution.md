# Products Module & Distribution Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the products/ module and restructure TeamFabric as a generator repo with modular framework imports, top-level init/update commands, and a template system for distribution.

**Architecture:** The current monolithic `DRAFT_AGENTS.md` is decomposed into modular `fabric-*.md` files under `Fabric/template/`. A new top-level `/init` command scaffolds team instances from these templates, generating a `CLAUDE.md` with `@` imports. A `/update` command overwrites framework-owned files without touching team data. The product module adds a `product.md` entity template and `fabric-product.md` behavioral rules.

**Tech Stack:** Markdown files, Claude Code slash commands (markdown prompt files), git

**Spec:** `docs/superpowers/specs/2026-03-31-products-and-distribution-design.md`

---

## File Map

### Files to Create

```
Fabric/template/                          # Distribution source
  fabric-core.md                          # Core framework behavioral rules
  fabric-triage.md                        # Triage module rules
  fabric-product.md                       # Product module rules
  fabric-backlog.md                       # Backlog module rules
  CLAUDE.md                               # Template team CLAUDE.md with @imports

Fabric/products/template/
  product.md                              # Product entity template

.claude/commands/
  init.md                                 # Top-level: scaffold a new team instance
  update.md                               # Top-level: apply framework updates

Example/.claude/
  fabric-core.md                          # Copied from template (demonstrates deployed state)
  fabric-triage.md
  fabric-product.md

Example/products/                         # Empty scaffold for Example instance
```

### Files to Modify

```
Example/CLAUDE.md                         # New file: generated CLAUDE.md with @imports (replaces symlinked DRAFT_AGENTS.md)
```

### Files That Stay As-Is

```
Fabric/DRAFT_AGENTS.md                    # Real RAIS constitution — untouched, will be migrated later
Fabric/.claude/commands/*                 # Team-level commands — shipped to instances by init/update
Fabric/.claude/skills/*                   # Team-level skills — shipped to instances by init/update
Fabric/team/                              # Real team data
Fabric/staging/                           # Stays as-is
Fabric/requests/                          # Stays as-is
```

---

### Task 1: Create `fabric-core.md` — Core Framework Rules

**Files:**
- Create: `Fabric/template/fabric-core.md`

This is the largest module file. It contains the framework behavioral rules that every team gets, generalized from `DRAFT_AGENTS.md` with team-specific content stripped out.

- [ ] **Step 1: Create `Fabric/template/` directory**

```bash
mkdir -p Fabric/template
```

- [ ] **Step 2: Write `fabric-core.md`**

Create `Fabric/template/fabric-core.md` with the following content. This is generalized from `DRAFT_AGENTS.md` — team-specific notification rules, constraints, and decision log are NOT included (those belong in team CLAUDE.md).

```markdown
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
| /add-member | Guided creation of a new member profile. Requires meta mode. |
| /bench-member | Set a member's status to Benched. Preserves profile and context log references but removes from active capacity. Requires meta mode. |
| /activate-member | Restore a benched member to Active status. Requires meta mode. |
| /readme | Regenerate README.md from current state of CLAUDE.md, team/team.md, and member profiles. |
| /describe-team | Synthesize a narrative description of the team from all sources. Optionally accepts an audience hint (e.g., "for leadership", "for onboarding"). Surfaces inconsistencies, gaps, or staleness. |
| /status | Quick summary of team state: active members and allocation, engagement counts, pending requests. |
| /ingest | Ingest content into an entity. Accepts an entity hint (`/ingest R-42`), member target (`/ingest for eric-winter`), or `staging` to batch-process staged files. Add `with planning` to produce a structured digest plan for review before execution. |
| /meta | Enter meta mode to edit structural files. Use `/meta done` to exit. |

## Core Skills

<!-- Skills are implicit capabilities the AI uses during operations. Defined in .claude/skills/ -->

| Skill | Description |
|-------|-------------|
| identity | Resolve active user from `git config user.email`, load their profile, tailor context. |
| ingestion | Execute the three ingestion paths: quick file, direct ingest, staged batch. |
| entity-maintenance | Update entity headers, manage staleness flags, reconcile summaries when queried. |
| fabric-guidance | Help users understand and maintain their Fabric. Explain structure, suggest improvements, answer "how do I..." questions about the system itself. |

## Behavioral Defaults

### Knowledge Repository Nudges

When ingesting content that references external artifacts, nudge (do not block) the user about filing in appropriate external systems. Teams should customize these nudges in their CLAUDE.md based on their knowledge repositories.

### Constraints

- Structural files are read-only outside of meta mode. If a structural change is needed, suggest entering meta mode.
- Do not autonomously update first-class fields on entities. Propose changes and wait for human confirmation.
- When capacity is relevant (staffing, acceptance decisions), load team/team.md for current allocation and engagement counts.
```

- [ ] **Step 3: Verify the file reads correctly**

```bash
cat Fabric/template/fabric-core.md | head -5
```

Expected: The `# TeamFabric Core` header and the framework-owned comment.

- [ ] **Step 4: Commit**

```bash
git add Fabric/template/fabric-core.md
git commit -m "feat: add fabric-core.md template — core framework behavioral rules"
```

---

### Task 2: Create `fabric-triage.md` — Triage Module Rules

**Files:**
- Create: `Fabric/template/fabric-triage.md`

- [ ] **Step 1: Write `fabric-triage.md`**

Create `Fabric/template/fabric-triage.md`:

```markdown
# TeamFabric Module: Triage

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Triage module manages request intake, evaluation workflows, and rubric-based assessment. Teams customize the specific rubrics and workflow definitions in `requests/workflow/`.

## Request Lifecycle

Requests flow through a configurable workflow. The default workflow provides a two-level evaluation (L1 screening, L2 consultation) but teams can define their own stages.

```
Intake → L1 Screening → L2 Consultation → Decision (Accept / Reject / Needs More Info)
  → If accepted: Staffing and approach planning → Active engagement
```

## Directory Structure

```
requests/
  REQUESTS.md                    # Module definition (team-customized)
  workflow/
    default/                     # Default workflow (team-customized)
      request-template.md        # Template for new request entities
      l1-rubric.md               # L1 evaluation rubric
      l2-rubric.md               # L2 evaluation rubric
      evaluation.md              # Evaluation process definition
  <request-id>/                  # Per-request folder
    request.md                   # Request entity file
    [supporting documents]
```

## Commands

| Command | Description |
|---------|-------------|
| /evaluate-request | Evaluate a request against its workflow rubric. Accepts a request ID and optional stage (e.g., `/evaluate-request R-42 L2`). |

## Skills

| Skill | Description |
|-------|-------------|
| request-evaluation | Evaluate a request against its workflow's rubric. Workflow-agnostic: reads the rubric from the request's assigned workflow. |

## Behavioral Rules

- New requests are created in `requests/<request-id>/request.md` using the workflow's request template.
- Request IDs follow the pattern `R-NNN` (sequential, zero-padded to 3 digits minimum).
- Evaluations are appended to the request entity's evaluation section, not stored separately.
- When evaluating, always load the full rubric from the workflow definition. Do not evaluate from memory.
- After evaluation, surface the recommendation clearly but do not make the accept/reject decision — that belongs to the designated decision-maker.
```

- [ ] **Step 2: Commit**

```bash
git add Fabric/template/fabric-triage.md
git commit -m "feat: add fabric-triage.md template — triage module rules"
```

---

### Task 3: Create `fabric-product.md` — Product Module Rules

**Files:**
- Create: `Fabric/template/fabric-product.md`

- [ ] **Step 1: Write `fabric-product.md`**

Create `Fabric/template/fabric-product.md`:

```markdown
# TeamFabric Module: Product

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Product module tracks the cohesive components or deliverables a team owns. Products are often components of a larger platform. Each product gets a directory under `products/` with a `product.md` entity file.

## Directory Structure

```
products/
  <slug>/
    product.md                   # Product entity file
```

## Product Entity Structure

Products follow the standard Fabric layered entity structure:

```markdown
# Product Name
Status: Active | Sunset | Planned
Owner: [team member name]
Repository: [optional — relative path, git URL, or omit entirely]
Summary: [2-3 sentence current state, last updated date]

## Properties
Description: [what this product is and does]
Stakeholders: [who cares about this product]
Key Repositories: [optional — additional repos beyond the primary]

## Context Log
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference]
```

### Key Fields

- **Status**: Active, Sunset, Planned — reflects current lifecycle stage.
- **Owner**: The team member responsible for this product.
- **Repository**: Optional. The primary source repository. Can be a relative path (e.g., `../portal-api`), a git URL, or absent entirely. Teams decide their own linking strategy (git subtree, sibling folder, remote reference). Fabric does not enforce a convention.
- **Key Repositories**: Optional Properties field for products with multiple repos.
- **Context Log**: Product-level strategic context — competitive info, stakeholder decisions, roadmap changes. Not tied to specific backlog items.

## Behavioral Rules

- Product files are structural entities protected by meta mode.
- When ingesting content that mentions a product, check if a product entity exists. If not, suggest creating one.
- Product context logs capture strategic-level information. Tactical work details belong on backlog entities (if Backlog module is enabled) or request entities (if Triage module is enabled).
- The `Repository` field is informational. Fabric does not clone, sync, or validate external repositories.

## Relationship to Backlog

Products and backlog are independent modules. When both are enabled, backlog epics reference products through a `Products:` field (e.g., `Products: Portal, Data Pipeline`). This supports many-to-many relationships — an epic can span multiple products.
```

- [ ] **Step 2: Commit**

```bash
git add Fabric/template/fabric-product.md
git commit -m "feat: add fabric-product.md template — product module rules"
```

---

### Task 4: Create `fabric-backlog.md` — Backlog Module Rules

**Files:**
- Create: `Fabric/template/fabric-backlog.md`

- [ ] **Step 1: Write `fabric-backlog.md`**

Create `Fabric/template/fabric-backlog.md`:

```markdown
# TeamFabric Module: Backlog

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Backlog module provides a hierarchical work tracking structure: Epic > Feature > Work Item > Task. This is for teams that break work into structured deliverables. Teams that manage work informally or through external tools do not need this module.

## Directory Structure

```
backlog/
  epics/
    E-001/
      epic.md
      features/
        F-001/
          feature.md
          work-items/
            WI-001.md
```

## Entity Hierarchy

### Epic
High-level initiative. May originate from an accepted request (Triage module) or be created directly.

```markdown
# E-001: Epic Title
Status: Planned | Active | Complete | Cancelled
Owner: [team member name]
Products: [comma-separated product names, if Product module enabled]
Summary: [2-3 sentence current state]

## Properties
Description: [what this epic delivers]
Origin: [e.g., "Request R-042" or "Team initiative"]
Target: [optional date or milestone]

## Context Log
```

### Feature
Breakdown of an epic into business-facing capabilities.

```markdown
# F-001: Feature Title
Status: Planned | Active | Complete
Owner: [team member name]
Epic: E-001
Summary: [current state]

## Properties
Description: [what this feature delivers to users]
Acceptance Criteria:
- [criterion 1]
- [criterion 2]

## Context Log
```

### Work Item
Breakdown of a feature into assignable implementation work.

```markdown
# WI-001: Work Item Title
Status: Not Started | In Progress | Complete | Blocked
Owner: [team member name]
Feature: F-001
Summary: [current state]

## Properties
Description: [what needs to be built or done]
Estimated Hours: [number]

## Tasks
- [ ] Task description (assigned to: name, hours remaining: N)
- [ ] Task description (assigned to: name, hours remaining: N)

## Context Log
```

## ID Assignment

- Epics: `E-NNN` (sequential, zero-padded to 3 digits minimum)
- Features: `F-NNN`
- Work Items: `WI-NNN`
- IDs are global within the Fabric instance (not scoped to parent entity).

## Behavioral Rules

- Backlog entities are structural and protected by meta mode.
- When creating a new epic, check if it should reference existing products (if Product module is enabled).
- Status rollup: when all child entities are complete, suggest updating the parent's status.
- Do not create backlog entities autonomously. Propose the entity and wait for confirmation.
- Tasks are the finest-grained breakdown. They live inline on work items as checkbox items, not as separate files.

## Relationship to Triage

When both Triage and Backlog modules are enabled, accepted requests can be promoted to epics. The epic's `Origin` field links back to the request. The request entity is not modified — it stays in `requests/` as a historical record.
```

- [ ] **Step 2: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "feat: add fabric-backlog.md template — backlog module rules"
```

---

### Task 5: Create Product Entity Template

**Files:**
- Create: `Fabric/products/template/product.md`

- [ ] **Step 1: Create directory and write template**

```bash
mkdir -p Fabric/products/template
```

Create `Fabric/products/template/product.md`:

```markdown
# [Product Name]
Status: [Active | Sunset | Planned]
Owner: [team member name]
Repository: [optional — relative path, git URL, or omit]
Summary: [2-3 sentence current state, last updated date]

## Properties
Description: [what this product is and does]
Stakeholders: [who cares about this product — teams, roles, external partners]
Key Repositories: [optional — additional repos if the product spans multiple]

## Context Log

<!-- Append-only breadcrumb trail. Format:
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference to original artifact]
-->
```

- [ ] **Step 2: Remove old `.gitkeep`**

```bash
rm Fabric/products/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add Fabric/products/
git commit -m "feat: add product entity template"
```

---

### Task 6: Create Template CLAUDE.md

**Files:**
- Create: `Fabric/template/CLAUDE.md`

This is the template that `/init` uses to generate a team's `CLAUDE.md`. It contains `@` import directives and a team section stub.

- [ ] **Step 1: Write template CLAUDE.md**

Create `Fabric/template/CLAUDE.md`:

```markdown
@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md

# {{TEAM_NAME}}

<!--
  Everything below this line is yours. TeamFabric updates will not touch this section.
  The @imports above load framework behavioral rules from .claude/fabric-*.md files.
  Those files ARE updated when you run /update from the TeamFabric repo.
-->

## How We Work

<!-- Customize your team's working norms, communication preferences, and processes here. -->

## Knowledge Repositories

<!-- Where does your team's content live? SharePoint, shared drives, wikis, repos? -->
<!-- The AI uses this section to generate nudges when ingesting content. -->

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
| Scrum | Disabled | Sprint ceremonies and daily facilitation |

## Decision Log

<!-- Append significant team-level decisions here during ingestion. Format:
     - YYYY-MM-DD: [decision]. Context: [brief reason]. -->
```

- [ ] **Step 2: Commit**

```bash
git add Fabric/template/CLAUDE.md
git commit -m "feat: add template CLAUDE.md with modular @imports"
```

---

### Task 7: Create Top-Level `/init` Command

**Files:**
- Create: `.claude/commands/init.md`

This command runs from the TeamFabric repo root. It scaffolds a new team Fabric instance in a target folder.

- [ ] **Step 1: Create directory**

```bash
mkdir -p .claude/commands
```

- [ ] **Step 2: Write the init command**

Create `.claude/commands/init.md`:

```markdown
# /init — Scaffold a New TeamFabric Instance

## Purpose
Create a new Fabric instance for a team in a specified target folder. This command runs from the TeamFabric repo and copies framework files into the target.

## Arguments
- `$ARGUMENTS` — the target folder path where the Fabric instance should be created (required)

## Pre-Flight

1. Verify `$ARGUMENTS` is provided. If not, ask: "Where should I create the Fabric instance? Provide a folder path."
2. If the target folder already exists and contains a `CLAUDE.md` with `@.claude/fabric-core.md`, warn: "This folder already has a Fabric instance. Do you want to reinitialize (this will overwrite framework files but preserve team data) or abort?"

## Module Selection

Ask the user which modules to enable. Present as a checklist:

- **Core** — always enabled, not optional
- **Triage** — request intake, workflows, rubric evaluation (recommended for most teams)
- **Product** — product definitions and context (recommended if the team owns deliverables)
- **Backlog** — epic/feature/work-item hierarchy (for teams that break work into structured deliverables)
- **Scrum** — sprint ceremonies and daily facilitation (not yet available)

## Scaffold Steps

After module selection, create the following structure in the target folder:

### 1. Directory structure

```
<target>/
  .claude/
    commands/           # Copy from Fabric/.claude/commands/
    skills/             # Copy from Fabric/.claude/skills/
    fabric-core.md      # Always copy from Fabric/template/
    fabric-triage.md    # Copy if Triage enabled
    fabric-product.md   # Copy if Product enabled
    fabric-backlog.md   # Copy if Backlog enabled
  team/
    members/
      template/
        profile.md      # Copy from Fabric/team/members/template/
  staging/
    README.md           # Copy from Fabric/staging/README.md
  .gitignore            # Copy from Fabric/.gitignore
```

### 2. Module-specific directories

- If **Triage** enabled: create `requests/workflow/default/` and copy `Fabric/requests/REQUESTS.md`
- If **Product** enabled: create `products/` with template
- If **Backlog** enabled: create `backlog/epics/`

### 3. Generate CLAUDE.md

Start from `Fabric/template/CLAUDE.md`. Modify it:
- Include only the `@` imports for enabled modules
- Replace `{{TEAM_NAME}}` with the team name (ask for it)
- Update the Enabled Modules table to reflect selections

### 4. Guided team setup

After scaffolding, transition into the team-level `/init` workflow:
- Gather team name, parent organization, mission
- Create `team/team.md`
- Collect initial members and create profiles
- If Product module is enabled, ask about products and create initial `products/<slug>/product.md` files

### 5. Wrap up

Present the generated structure for review. Suggest next steps:
- "Review your CLAUDE.md and customize the team-specific sections (notification rules, constraints, knowledge repositories)."
- "Try `/describe-team` to see how the AI synthesizes your team's information."
- "Start ingesting content with `/ingest` when you're ready."
- "When TeamFabric releases updates, pull this repo and run `/update <your-folder>` to apply them."
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/init.md
git commit -m "feat: add top-level /init command for scaffolding team instances"
```

---

### Task 8: Create Top-Level `/update` Command

**Files:**
- Create: `.claude/commands/update.md`

- [ ] **Step 1: Write the update command**

Create `.claude/commands/update.md`:

```markdown
# /update — Apply TeamFabric Updates to a Team Instance

## Purpose
Update framework-owned files in an existing Fabric instance. This command runs from the TeamFabric repo after pulling the latest changes.

## Arguments
- `$ARGUMENTS` — the target folder path of the Fabric instance to update (required)

## Pre-Flight

1. Verify `$ARGUMENTS` is provided. If not, ask: "Which Fabric instance should I update? Provide the folder path."
2. Verify the target folder contains a `CLAUDE.md` with at least one `@.claude/fabric-` import. If not, warn: "This doesn't look like a Fabric instance. Run `/init` first."

## What Gets Updated

### Always overwrite:
- `.claude/commands/` — all files replaced with latest from `Fabric/.claude/commands/`
- `.claude/skills/` — all files replaced with latest from `Fabric/.claude/skills/`
- `.claude/fabric-core.md` — always present, always updated

### Conditionally overwrite (only if the file already exists in the target):
- `.claude/fabric-triage.md`
- `.claude/fabric-product.md`
- `.claude/fabric-backlog.md`
- `.claude/fabric-scrum.md`

If a module file exists in the target, overwrite it with the latest from `Fabric/template/`. If it does not exist, skip it — modules are not added silently. To add a new module, the team should use `/init` with the reinitialize option or manually add the import.

### Never touch:
- `CLAUDE.md` (team-owned content)
- `team/` (team data)
- `requests/` (request data and team-customized workflows/rubrics)
- `products/` (product data)
- `backlog/` (backlog data)
- `staging/` (local content)
- `.gitignore`

## Reporting

After updating, report:
1. List every file that was updated
2. Note any new commands or skills that were added
3. Note any commands or skills that were removed (file existed in target but not in source)
4. If new module files exist in `Fabric/template/` that are not in the target, mention them: "New module available: Backlog. Run `/init` with reinitialize to enable it, or manually add `@.claude/fabric-backlog.md` to your CLAUDE.md."

## Safety

- Read the target's CLAUDE.md before and after to confirm the `@` imports are intact.
- If a `.claude/fabric-*.md` file in the target has been modified (differs from the previous version in the TeamFabric repo), warn: "fabric-product.md was customized locally. Overwriting will replace your changes. Proceed?"
```

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/update.md
git commit -m "feat: add top-level /update command for applying framework updates"
```

---

### Task 9: Update Example/ to Demonstrate Modular Structure

**Files:**
- Create: `Example/.claude/fabric-core.md` (copy from template)
- Create: `Example/.claude/fabric-triage.md` (copy from template)
- Create: `Example/.claude/fabric-product.md` (copy from template)
- Create: `Example/CLAUDE.md` (generated from template, replacing symlinked DRAFT_AGENTS.md)
- Create: `Example/products/` directory

The Example/ instance should look like what `/init` would produce, demonstrating the deployed modular structure to developers. The `.claude/commands/` and `.claude/skills/` symlinks remain (they still point to `Fabric/.claude/` for live testing of framework changes).

- [ ] **Step 1: Check current Example/ symlink state**

```bash
ls -la Example/DRAFT_AGENTS.md Example/.claude/ Example/.gitignore
```

Understand what's symlinked before making changes.

- [ ] **Step 2: Copy fabric module files into Example/.claude/**

```bash
cp Fabric/template/fabric-core.md Example/.claude/fabric-core.md
cp Fabric/template/fabric-triage.md Example/.claude/fabric-triage.md
cp Fabric/template/fabric-product.md Example/.claude/fabric-product.md
```

Note: These are copies (not symlinks) to demonstrate what a real deployed instance looks like. The commands/ and skills/ directories remain symlinked.

- [ ] **Step 3: Remove the DRAFT_AGENTS.md symlink from Example/**

```bash
rm Example/DRAFT_AGENTS.md
```

This symlink is replaced by the modular CLAUDE.md + fabric-*.md imports.

- [ ] **Step 4: Create Example/CLAUDE.md**

Create `Example/CLAUDE.md` — this is what a generated instance looks like, filled in for the Riverdale Data Engineering fictional team:

```markdown
@.claude/fabric-core.md
@.claude/fabric-triage.md
@.claude/fabric-product.md

# Riverdale Data Engineering

<!--
  Everything below this line is yours. TeamFabric updates will not touch this section.
  The @imports above load framework behavioral rules from .claude/fabric-*.md files.
  Those files ARE updated when you run /update from the TeamFabric repo.
-->

## How We Work

Request intake and triage process: requests/REQUESTS.md
Default workflow and rubrics: requests/workflow/default/

## Knowledge Repositories

- Confluence: team wiki and runbooks
- GitHub: source repositories
- Shared Drive: project documentation and reports

## Notification Rules

- New request handoff: notify Marcus Chen
- Data quality issues: notify Priya Patel
- Infrastructure changes: notify Dana Torres

## Constraints

- Do not autonomously create or modify data pipeline configurations.
- All client-facing deliverables require review by Marcus before delivery.

## Enabled Modules

| Module | Status | Notes |
|--------|--------|-------|
| Core | Enabled | Team definition, members, constitution, ingestion, queries |
| Triage | Enabled | Request intake, workflows, rubric evaluation |
| Product | Enabled | Product definitions and context |
| Backlog | Disabled | Not currently in use |
| Scrum | Disabled | Team does not follow scrum practices |

## Decision Log

- 2026-03-28: Adopted Fabric as team working memory system. Context: Growing request volume needs structured triage.
```

- [ ] **Step 5: Create Example/products/ directory**

```bash
mkdir -p Example/products
```

- [ ] **Step 6: Verify the Example/ structure**

```bash
ls -la Example/.claude/
ls -la Example/CLAUDE.md
ls -la Example/products/
```

Confirm: `fabric-core.md`, `fabric-triage.md`, `fabric-product.md` exist as regular files alongside the symlinked `commands/` and `skills/` directories. `CLAUDE.md` exists as a regular file. `products/` directory exists.

- [ ] **Step 7: Commit**

```bash
git add Example/.claude/fabric-core.md Example/.claude/fabric-triage.md Example/.claude/fabric-product.md Example/CLAUDE.md Example/products/
git rm Example/DRAFT_AGENTS.md  # if git is tracking the symlink
git commit -m "feat: update Example/ to demonstrate modular CLAUDE.md structure"
```

---

### Task 10: Update Project CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (project root)

The project CLAUDE.md needs to reflect the new structure — specifically the `Fabric/template/` directory and the top-level commands.

- [ ] **Step 1: Read current CLAUDE.md**

Read the full `CLAUDE.md` to see what needs updating.

- [ ] **Step 2: Update the Project Structure section**

Update the tree in CLAUDE.md to reflect:
- `Fabric/template/` directory with fabric-*.md files and template CLAUDE.md
- `Fabric/products/template/` replacing `.gitkeep`
- Top-level `.claude/commands/` with init.md and update.md
- Example/ changes (CLAUDE.md replaces DRAFT_AGENTS.md symlink, fabric-*.md files in .claude/)

- [ ] **Step 3: Update the "How Fabric/ and Example/ Relate" section**

Add a note that Example/ now demonstrates the modular CLAUDE.md structure with `@` imports, and that `.claude/fabric-*.md` files are copies (not symlinks) to show what a deployed instance looks like.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update project CLAUDE.md to reflect distribution model and products module"
```
