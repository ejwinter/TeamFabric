# /link-fabric — Link a Product Repo to This Fabric Instance

## Purpose

Install the `fabric-link.md` config and `fabric-aware` skill into a product repo so engineers working there can surface approved specs before coding begins.

Run this command from the Fabric instance. The product repo must be a sibling directory (convention: Fabric instance and all product repos share a parent folder).

## Arguments

`$ARGUMENTS` — the folder name of the product repo (not a path). The repo is resolved as a sibling of this Fabric instance.

Example: if this Fabric instance is at `~/code/MyTeam-Fabric`, then `/link-fabric my-api` resolves the product repo to `~/code/my-api`.

## Steps

1. **Verify the argument.** If `$ARGUMENTS` is empty, ask: "Which product repo should be linked? Provide the folder name (e.g., `my-api`)."

2. **Resolve the product repo path.** Derive the parent directory of this Fabric instance and append `$ARGUMENTS`. Show the user the resolved path and ask for confirmation before proceeding.

3. **Verify it's a git repo.** Check that the resolved path exists and contains a `.git/` directory. If not: "No git repository found at [path]. Check the folder name and try again."

4. **Create `.claude/` if needed.** If `<product-repo>/.claude/` does not exist, create it.

5. **Create `.claude/skills/` if needed.** If `<product-repo>/.claude/skills/` does not exist, create it.

6. **Copy `fabric-link.md`.** Use `Fabric/template/fabric-link.md` as the source. Fill in `{{FABRIC_INSTANCE_NAME}}` with the folder name of this Fabric instance (the last path segment of the Fabric instance's root), producing a `Path:` line like `Path: ../MyTeam-Fabric`. Write to `<product-repo>/.claude/fabric-link.md`.
   - If the file already exists, show the current content and ask: "fabric-link.md already exists. Overwrite? (yes / no)"

7. **Copy `fabric-aware` skill.** Copy the full `product-repo-skills/fabric-aware/` directory from the TeamFabric source to `<product-repo>/.claude/skills/fabric-aware/`.
   - If the directory already exists, show a summary of what changed and ask: "fabric-aware skill already exists. Overwrite with the current framework version? (yes / no)"

8. **Confirm and wrap up.** Tell the user:
   ```
   Linked [product-repo-name] to this Fabric instance.

   Engineers working in [product-repo-name] can now:
   - Ask "what's my spec?" to surface the approved spec before coding
   - The skill will read .claude/fabric-link.md to locate this Fabric instance

   The fabric-aware skill is installed at:
     [product-repo-name]/.claude/skills/fabric-aware.md

   To keep it up to date, re-run /link-fabric [product-repo-name] after running /update-fabric.
   ```
