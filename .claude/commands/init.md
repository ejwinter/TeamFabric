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
    fabric-source.md    # Always copy from Fabric/template/ (fill in Local and Remote)
  team/
    members/
      template/
        profile.md      # Copy from Fabric/team/members/template/profile.md
  staging/
    README.md           # Copy from Fabric/staging/README.md
  .gitignore            # Copy from Fabric/.gitignore
```

### 2. Module-specific directories

- If **Triage** enabled: create `requests/workflow/default/` and copy `Fabric/requests/REQUESTS.md` and contents of `Fabric/requests/workflow/default/` if present
- If **Product** enabled: create `products/` with `products/template/` copied from `Fabric/products/template/`
- If **Backlog** enabled: create `backlog/epics/`

### 3. Create `.claude/fabric-source.md`

Ask the user:
- "Where is your local clone of the TeamFabric repo?" (local path, can be blank if they don't have one yet)
- "What is the TeamFabric git remote URL?" (used as fallback for `/update-fabric`)

Copy `Fabric/template/fabric-source.md` into `<target>/.claude/fabric-source.md` and fill in both values. This file is used by `/update-fabric` to find framework updates.

### 4. Generate CLAUDE.md

Start from `Fabric/template/CLAUDE.md`. Modify it:
- Include only the `@` imports for enabled modules (remove lines for disabled modules)
- Replace `{{TEAM_NAME}}` with the team name (ask for it now if not already known)
- Update the Enabled Modules table to reflect the selections

### 5. Guided team setup

After scaffolding, begin the guided team setup conversation:
- Ask for team name, parent organization, and mission statement (1-2 sentences)
- Create `team/team.md` with this information
- Collect initial members: for each, gather name, role, key function, allocation %, and email. Create `team/members/<name>/profile.md` for each.
- If Product module is enabled, ask what products the team owns and create initial `products/<slug>/product.md` files using the template.

### 6. Wrap up

Present the generated structure for review. Suggest next steps:
- "Review your CLAUDE.md and customize the team-specific sections (notification rules, constraints, knowledge repositories)."
- "Try `/describe-team` to see how the AI synthesizes your team's information."
- "Start ingesting content with `/ingest` when you're ready."
- "When TeamFabric releases updates, run `/update-fabric` from inside your Fabric instance to apply them."
