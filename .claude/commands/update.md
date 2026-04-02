# /update — Apply TeamFabric Updates to a Team Instance

## Purpose
Update framework-owned files in an existing Fabric instance. This command runs from the TeamFabric repo after pulling the latest changes.

## Arguments
- `$ARGUMENTS` — the target folder path of the Fabric instance to update (required)

## Pre-Flight

1. Verify `$ARGUMENTS` is provided. If not, ask: "Which Fabric instance should I update? Provide the folder path."
2. Verify the target folder contains a `CLAUDE.md` with at least one `@.claude/fabric-` import. If not, warn: "This doesn't look like a Fabric instance. Run `/init` first."
3. **Self-update check** — compare the source hash of `Fabric/.claude/commands/update.md` against the stored checksum for `.claude/commands/update.md` in the target. If they differ, copy the new `update.md` to the target immediately and stop:
   > "The update command itself has changed. I've applied that change. Please re-run `/update` to continue with the updated instructions."
   
   This ensures the rest of the update runs under the current command definition, not a stale one.

## Candidate Files

The following framework-owned files are candidates for update:

- `.claude/fabric-core.md` — always a candidate
- `.claude/fabric-triage.md`, `fabric-product.md`, `fabric-backlog.md`, `fabric-scrum.md` — candidate only if the file already exists in the target (modules are not added silently)
- All files under `.claude/commands/` and `.claude/skills/`

### Never touch

- `CLAUDE.md` — team-owned content
- `team/`, `requests/`, `products/`, `backlog/`, `staging/` — team data
- `.gitignore`, `.claude/fabric-source.md` — instance-specific config
- `.claude/fabric-checksums.md` — rewritten as part of this command, not a candidate for source copy

## Checksum-Driven Update

`.claude/fabric-checksums.md` records the SHA-256 hash of each framework file as it was last written by `/init` or `/update`. Use it to drive update decisions:

For each candidate file:

1. **Compute the source hash** — `shasum -a 256 <source-file>`
2. **Look up the stored hash** in `.claude/fabric-checksums.md`
3. **If source hash == stored hash** — no framework change; skip this file
4. **If source hash != stored hash** (or file is new in source):
   a. Compute the instance file hash — `shasum -a 256 <target-file>`
   b. If instance hash == stored hash → file is unchanged locally; overwrite silently
   c. If instance hash != stored hash → file was locally modified; warn before overwriting:
      > "`.claude/fabric-[name].md` has both a framework update and local modifications. Overwriting will replace your local changes. Proceed?"

If `.claude/fabric-checksums.md` does not exist (instance predates checksum support), fall back to overwriting all candidate files, and generate the checksum file afterward.

After all updates are applied, rewrite `.claude/fabric-checksums.md` with the current hashes of all framework files in the target. Use the same format as `/init`.

## Reporting

After updating, report:

1. List every file that was updated (source changed and written to target)
2. List files that were skipped (source unchanged)
3. Note any new commands or skills added (present in source but not previously in target)
4. Note any commands or skills removed (present in target but not in source)
5. If new module files exist in `Fabric/template/` that are not in the target, mention them: "New module available: [name]. To enable it, add `@.claude/fabric-[name].md` to your CLAUDE.md and re-run `/update`."

## Safety

Read the target's `CLAUDE.md` before and after to confirm the `@` imports are intact.
