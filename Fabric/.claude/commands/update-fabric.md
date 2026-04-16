# /update-fabric — Apply TeamFabric Framework Updates

## Purpose
Update framework-owned files in this Fabric instance from the TeamFabric source repo. Run this after the TeamFabric repo has been updated to pick up the latest behavioral rules, commands, and skills.

## Finding the TeamFabric Source

Read `.claude/fabric-source.md` to find the source:

1. **Try the local path first.** If `Local:` is set and the path exists and contains a `Fabric/template/` directory, use it.
2. **Fall back to the remote URL.** If the local path is missing or broken, clone `Remote:` into a temporary directory, apply updates from there, then delete the temp directory.
3. **Ask the user if both fail.** "I couldn't find the TeamFabric source. Please provide a local path or git URL." Update `.claude/fabric-source.md` with whatever the user provides.

If `.claude/fabric-source.md` doesn't exist, ask the user for both a local path and remote URL, create the file, then proceed.

## Staleness Check (Local Path Only)

When using a local clone, check whether it is behind the remote before applying updates:

1. Run `git fetch origin` in the local clone directory.
2. Compare `git rev-parse HEAD` to `git rev-parse origin/HEAD` (or the tracking branch).
3. If they differ (local is behind), **stop and warn the user**:

   > "Your local TeamFabric clone at `<path>` appears to be behind the remote. Running the update now would apply an older version of the framework. You can pull the latest changes by running `git pull` in that directory (or type `! git -C <path> pull` here), then re-run `/update-fabric`."

   Offer to run `git pull` automatically: "Would you like me to pull the latest changes now before proceeding?"
   - If the user confirms, run `git -C <path> pull` and continue with the update.
   - If the user declines, abort.

4. If `git fetch` fails (no network, no remote configured, etc.), surface a non-blocking warning — "Could not verify whether the local clone is up to date (fetch failed). Proceeding with the local version." — and continue with the update.

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

1. Read `team/team.md` and collect every stakeholder name from the `## Stakeholders` table.
2. For each name, check whether `team/stakeholders/<name>/profile.md` exists.
3. Build a list of names that have no profile file.

If there are any stakeholders without profiles, suggest: "Stakeholder profile directories are now supported at `team/stakeholders/<name>/profile.md`. For stakeholders who are closely engaged with your team, a profile can capture communication preferences, areas of expertise, and an ingestion context log. The following stakeholders do not yet have profiles: [list only the missing names]. You can create profiles via `/meta`."

If every stakeholder already has a profile, or if the `## Stakeholders` table is absent or empty, output nothing for this section.
