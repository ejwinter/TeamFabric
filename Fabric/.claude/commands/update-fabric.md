# /update-fabric — Apply TeamFabric Framework Updates

## Purpose
Update framework-owned files in this Fabric instance from the TeamFabric source repo. Run this after the TeamFabric repo has been updated to pick up the latest behavioral rules, commands, and skills.

## Finding the TeamFabric Source

Read `.claude/fabric-source.md` to find the source:

1. **Try the local path first.** If `Local:` is set and the path exists and contains a `Fabric/template/` directory, use it.
2. **Fall back to the remote URL.** If the local path is missing or broken, clone `Remote:` into a temporary directory, apply updates from there, then delete the temp directory.
3. **Ask the user if both fail.** "I couldn't find the TeamFabric source. Please provide a local path or git URL." Update `.claude/fabric-source.md` with whatever the user provides.

If `.claude/fabric-source.md` doesn't exist, ask the user for both a local path and remote URL, create the file, then proceed.

## What Gets Updated

### Always overwrite
- `.claude/commands/` — all files replaced from `<source>/Fabric/.claude/commands/`
- `.claude/skills/` — all files replaced from `<source>/Fabric/.claude/skills/`
- `.claude/fabric-core.md` — always updated from `<source>/Fabric/template/fabric-core.md`

### Conditionally overwrite (only if the file already exists here)
- `.claude/fabric-triage.md`
- `.claude/fabric-product.md`
- `.claude/fabric-backlog.md`
- `.claude/fabric-scrum.md`

### Never touch
- `CLAUDE.md`
- `.claude/fabric-source.md`
- `team/`
- `requests/`
- `products/`
- `backlog/`
- `staging/`
- `.gitignore`

## Reporting

After updating, report:
1. Every file that was updated
2. New commands or skills that were added (in source but not previously here)
3. Commands or skills that were removed (here but not in source)
4. New module files available in the source that aren't enabled here (e.g., "fabric-scrum.md is now available. Add `@.claude/fabric-scrum.md` to your CLAUDE.md to enable it.")

## Schema & Data Recommendations

After reporting file changes, inspect the instance's existing data against new framework capabilities and surface actionable suggestions. These are advisory — the team decides what applies to them. Do not make any changes automatically.

For each recommendation, briefly explain the new capability and what the team could do to take advantage of it. Only surface a recommendation if the instance actually has relevant data to act on.

### Stakeholder Profiles

Check if `team/team.md` has a `## Stakeholders` table with entries AND `team/stakeholders/` either doesn't exist or has no profile directories.

If so, suggest: "Stakeholder profile directories are now supported at `team/stakeholders/<name>/profile.md`. For stakeholders who are closely engaged with your team, a profile can capture communication preferences, areas of expertise, and an ingestion context log. Based on your current stakeholders table, candidates worth considering: [list names from the table]. You can create profiles via `/meta`."

If `team/stakeholders/` already has profiles, no recommendation needed.
