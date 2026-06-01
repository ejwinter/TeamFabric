# /new-release — Scaffold a New Release

## Purpose

Create a new release for a product. Sets up the directory structure, creates the release entity file, copies document templates from the team's `release-templates/` folder, and seeds the Features index from the backlog.

## Arguments

```
/new-release [product-slug] [version]
```

`$ARGUMENTS` is parsed as `<product-slug> <version>` (space-separated). Both are optional — the command will ask interactively for any missing piece.

Examples:
```
/new-release clinical-lake v3.0
/new-release dashboards 2026-Q3
/new-release                     ← interactive: lists products, asks version
```

## Pre-Flight

### 1. Resolve product slug

- If `$ARGUMENTS` includes a product slug, verify that `products/<slug>/product.md` exists.
- If not found, list all available products from `products/` (excluding `template/`) and ask the user to select one.
- If no products exist, stop:
  > "No products found. Create a product first using `/meta` and the product template, then run `/new-release`."

### 2. Resolve version

- If `$ARGUMENTS` includes a version, use it. Accept any string that forms a valid directory name.
- If not provided, ask: "What version should this release be? (e.g., v1.0, v2.3.1, 2026-Q3)"

### 3. Check for existing release

If `products/<slug>/releases/<version>/` already exists:
> "A release folder for `<version>` already exists under `<slug>`. Open and review it, or choose a different version?"

If the user confirms opening, read and present the existing release entity. Stop scaffolding — do not overwrite.

### 4. Confirm before creating

Show the user what will be created:
> "Creating release `<version>` under product `<slug>` at `products/<slug>/releases/<version>/`. Proceed? (yes / no)"

## Scaffold Steps

### Step 1: Create the release directory

```
products/<slug>/releases/<version>/
```

Create `products/<slug>/releases/` if it does not exist.

### Step 2: Resolve release type and copy document templates

Check for `products/<slug>/releases/release-templates/`:

**Subfolders exist (typed templates):**
- List the subfolder names (e.g., `standard`, `emergency`, `hotfix`)
- If more than one exists, ask: "Which release type? (lists subfolders)"
- If only one exists, use it without asking
- Copy all `.md` files from the selected subfolder into the new version folder

**Flat files only (no subfolders):**
- Use all `.md` files in `release-templates/` directly — backwards-compatible with single-type setups
- Copy them into the new version folder

**`release-templates/` does not exist (first release for this product):**
> "No release templates found for `<slug>`. Would you like to seed `release-templates/` from the framework's example templates? This creates `standard/` and `emergency/` type folders you can customize. (yes / no)"
- If yes: locate `Fabric/releases/templates/` using the Local path in `.claude/fabric-source.md`. Copy the full `templates/` directory tree as the new `release-templates/` structure. Then use the `standard` type for this release (copy `standard/*.md` into the version folder).
- If no: proceed without document templates. Skip to Step 3.

If the framework source is not locally available (Local path absent or folder not found):
> "Framework source is not available locally. Clone the TeamFabric repo to seed templates, or add templates manually to `products/<slug>/releases/release-templates/standard/`."
Skip template seeding and proceed.

### Step 3: Collect release metadata

Ask the user:
- **Release name** — what is the display name for this release? Suggest a default: "`<Product Name> <version>`" (e.g., "Clinical Data Lake v3.0")
- **Target date** — YYYY-MM-DD (optional; skip with Enter to leave unset)
- **Owner** — email of the team member responsible; offer to list active team members from `team/members/`; default to the current user (from `git config user.email`)

### Step 4: Create the release entity file

Write `products/<slug>/releases/<version>/<version>.md` using `Fabric/releases/template-release.md` as the base, substituting:
- Title → user-provided release name
- `Product:` → product slug
- `Version:` → version string
- `Status:` → `Planned`
- `Target Date:` → user-provided date (omit line if blank)
- `Owner:` → user-provided email
- `## Documents` → list of copied template files (one line per file in format `- [filename without extension](./filename.md)`)

If no template files were copied, leave `## Documents` with its comment block only.

### Step 5: Seed the Features index (Backlog module only)

If the Backlog module is enabled (`@.claude/fabric-backlog.md` is imported in CLAUDE.md):

1. Scan all feature files under `backlog/epics/` for features where:
   - `Product:` loosely matches the product name (compare lowercased, hyphenated values)
   - `Product Target Release:` exactly matches the version string
2. For each match, build a reference line with a relative path from the release entity to the feature file.
3. If matches are found, propose inserting them into `## Features`:
   > "Found N feature(s) targeting `<version>` for `<product>`. Add them to the Features section? (yes / no)"
4. On confirmation, write the features list.

If no matches are found, leave `## Features` with its comment block only, and note:
> "No backlog features currently target this release. Assign features by setting `Product Target Release: <version>` on feature entities, or ask me to add a specific feature."

### Step 6: Present result

Show the user the created structure:

```
Created:
  products/<slug>/releases/<version>/<version>.md
  products/<slug>/releases/<version>/implementation-plan.md   ← from standard template
  products/<slug>/releases/<version>/communication-plan.md    ← from standard template

Features indexed: N (from backlog)
```

Suggest next steps:
- Refine the release summary in `<version>.md`
- Fill in the document templates
- Assign features by setting `Product Target Release: <version>` on feature entities
- Run `/transition <version> "In Progress"` when work begins

## Notes

- Does not require meta mode. Creating a subdirectory under an existing product directory is not a structural mutation of a protected entity.
- The `release-templates/` folder is team-owned. `/update` will not modify or remove it.
- To resolve the framework source path, read `Local:` from `.claude/fabric-source.md`. If the local path is unavailable, inform the user.
