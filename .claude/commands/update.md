# /update — Apply TeamFabric Updates to a Team Instance

## Purpose
Update framework-owned files in an existing Fabric instance. This command runs from the TeamFabric repo after pulling the latest changes.

## Arguments
- `$ARGUMENTS` — the target folder path of the Fabric instance to update (required)

## Pre-Flight

1. Verify `$ARGUMENTS` is provided. If not, ask: "Which Fabric instance should I update? Provide the folder path."
2. Verify the target folder contains a `CLAUDE.md` with at least one `@.claude/fabric-` import. If not, warn: "This doesn't look like a Fabric instance. Run `/init` first."

## What Gets Updated

### Always overwrite

- `.claude/commands/` — all files replaced with latest from `Fabric/.claude/commands/`
- `.claude/skills/` — all files replaced with latest from `Fabric/.claude/skills/`
- `.claude/fabric-core.md` — always present, always updated from `Fabric/template/fabric-core.md`

### Conditionally overwrite (only if the file already exists in the target)

- `.claude/fabric-triage.md` — updated from `Fabric/template/fabric-triage.md`
- `.claude/fabric-product.md` — updated from `Fabric/template/fabric-product.md`
- `.claude/fabric-backlog.md` — updated from `Fabric/template/fabric-backlog.md`
- `.claude/fabric-scrum.md` — updated from `Fabric/template/fabric-scrum.md`

If a module file exists in the target, overwrite it with the latest from `Fabric/template/`. If it does not exist, skip it — modules are not added silently.

### Never touch

- `CLAUDE.md` — team-owned content
- `team/` — team data
- `requests/` — request data and team-customized workflows and rubrics
- `products/` — product data
- `backlog/` — backlog data
- `staging/` — local content
- `.gitignore`

## Reporting

After updating, report:

1. List every file that was updated
2. Note any new commands or skills that were added (present in source but not previously in target)
3. Note any commands or skills that were removed (present in target but not in source)
4. If new module files exist in `Fabric/template/` that are not in the target, mention them: "New module available: [name]. To enable it, add `@.claude/fabric-[name].md` to your CLAUDE.md and re-run `/update`."

## Safety

- Read the target's `CLAUDE.md` before and after to confirm the `@` imports are intact.
- If a `.claude/fabric-*.md` file in the target appears to have been manually modified (ask the user to confirm), warn before overwriting: "fabric-[name].md appears to have been customized locally. Overwriting will replace your changes. Proceed?"
