# /init — Scaffold a New TeamFabric Instance

## Purpose
Create a new Fabric instance for a team in a specified target folder. This command runs from the TeamFabric repo and copies framework files into the target.

## Arguments
- `$ARGUMENTS` — the name or relative path for the new Fabric instance, interpreted relative to the **parent folder of the TeamFabric repo** (required).

  Examples (assuming TeamFabric is at `~/source/TeamFabric`):
  - `/init RAIS` → creates `~/source/RAIS`
  - `/init clients/acme` → creates `~/source/clients/acme`

  To resolve the target path: take the TeamFabric repo root, go up one level, then append `$ARGUMENTS`.

## Pre-Flight

1. Verify `$ARGUMENTS` is provided. If not, ask: "What should the folder be named? It will be created next to the TeamFabric repo."
2. Resolve the absolute target path as described above. Show the user the resolved path and confirm before proceeding.
3. Check for early-exit conditions in the target folder:
   - If `fabric-init-form.md` exists → **Form-Driven Flow** (see below)
   - If `CLAUDE.md` contains `@.claude/fabric-core.md` → warn: "This folder already has a Fabric instance. Do you want to reinitialize (this will overwrite framework files but preserve team data) or abort?"
4. If neither condition applies, ask: "Would you like to go through setup now, or generate a form you can fill out first?"
   - If form requested → **Form Generation Flow** (see below)
   - Otherwise → proceed with **Interactive Flow**

## Form Generation Flow

When the user wants a form instead of interactive setup:

1. Create the target directory if it doesn't exist.
2. Copy `Fabric/template/fabric-init-form.md` into `<target>/fabric-init-form.md`.
3. Tell the user: "I've created `fabric-init-form.md` in your new folder. Fill it out at your own pace, then run `/init $ARGUMENTS` again and I'll complete the setup from your answers."
4. Stop — do not scaffold anything else yet.

## Form-Driven Flow

When `fabric-init-form.md` exists in the target folder:

1. Read the form. Note any fields still containing placeholder text (`[...]`).
2. If critical fields are blank (Team Name, at least one Member), surface them and ask the user to fill them in before continuing, or offer to ask interactively for just the missing pieces.
3. Use the form answers in place of all interactive questions throughout the Scaffold Steps below.
4. After scaffolding completes, delete `fabric-init-form.md` from the target folder — it has served its purpose.

## Module Selection

In the **Interactive Flow**, ask the user which modules to enable:

- **Core** — always enabled, not optional
- **Triage** — request intake, workflows, rubric evaluation (recommended for most teams)
- **Product** — product definitions and context (recommended if the team owns deliverables)
- **Backlog** — epic/feature/work-item hierarchy (for teams that break work into structured deliverables)
- **Scrum** — sprint ceremonies and daily facilitation (not yet available)

In the **Form-Driven Flow**, read module selections from the form's Modules table.

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

The local TeamFabric path is already known — it's the repo this command is running from. Pre-fill it as a relative path from the new instance (e.g., `../TeamFabric`).

Ask the user:
- "What is the TeamFabric git remote URL?" (used as fallback if the local clone moves or is unavailable)

Copy `Fabric/template/fabric-source.md` into `<target>/.claude/fabric-source.md` and fill in both values. This file is used by `/update-fabric` to find framework updates.

### 4. Generate CLAUDE.md

Start from `Fabric/template/CLAUDE.md`. Modify it:

- Include only the `@` imports for enabled modules (remove lines for disabled modules)
- Replace `{{TEAM_NAME}}` with the team name
- Update the Enabled Modules table to reflect the selections
- Leave **How We Work**, **Knowledge Repositories**, **Notification Rules**, and **Constraints** as placeholder sections — do not attempt to populate them from gathered input. Each section should retain its heading with a brief placeholder comment, e.g.:

  ```
  ## Knowledge Repositories

  <!-- Add your team's knowledge systems here (wikis, repos, shared drives, etc.) -->
  ```

### 5. Guided team setup

After scaffolding, begin the guided team setup conversation:

- Ask for team name, parent organization, and mission statement (1-2 sentences)
- Create `team/team.md` with this information
- Collect initial members: for each, gather name, role, key function, allocation %, and email. Create `team/members/<name>/profile.md` for each.
- If Product module is enabled, ask what products the team owns and create initial `products/<slug>/product.md` files using the template.

### 6. Wrap up

Present the generated structure for review. Tell the user:

"Your Fabric instance is scaffolded. Before your first session, open `CLAUDE.md` and fill in the placeholder sections — **How We Work**, **Knowledge Repositories**, **Notification Rules**, and **Constraints**. These are the team-specific behavioral settings that make Fabric work for your context."

Then suggest next steps:

- "Try `/describe-team` to see how the AI synthesizes your team's information."
- "Start ingesting content with `/ingest` when you're ready."
- "When TeamFabric releases updates, run `/update-fabric` from inside your Fabric instance to apply them."
