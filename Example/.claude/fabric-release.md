# TeamFabric Module: Release

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Release module tracks product releases — versioned milestones that collect backlog features and attached planning documents. Releases are scoped to a single product and live under the product's directory.

## Prerequisites

**Product module must be enabled.** Releases live under the product directory and reference the product entity. Do not enable Release without Product.

## Directory Structure

```
products/
  <slug>/
    product.md                          # Product entity (Product module)
    releases/
      release-templates/                # Team-defined document templates (optional)
        standard/                       # One subfolder per release type
          implementation-plan.md
          communication-plan.md
        emergency/
          implementation-plan.md
      <version>/                        # One folder per release
        <version>.md                    # Release entity file
        [attached-document].md          # Zero or more attached documents
```

Examples:
```
products/clinical-lake/releases/v3.0/v3.0.md
products/clinical-lake/releases/v3.0/implementation-plan.md
products/clinical-lake/releases/v3.0/communication-plan.md
products/clinical-lake/releases/release-templates/standard/implementation-plan.md
products/clinical-lake/releases/release-templates/emergency/implementation-plan.md
```

Version folder names follow the version string used in the release entity (e.g., `v1.0`, `v2.3.1`, `2026-Q3`). Any string that forms a valid directory name is acceptable.

## Release Entity Structure

```markdown
# [Release Name]

Product: [product slug]
Version: [version string]
Status: Planned | In Progress | Released | Cancelled
Terminated: [YYYY-MM-DD — set when Status becomes Released or Cancelled]
Target Date: [YYYY-MM-DD]
Released Date: [YYYY-MM-DD — set when Status becomes Released]
Owner: [email of the team member responsible for this release]
Blocked: [Yes — set when a Blockers entry is Active; removed when all resolved]

## Summary

## Features

<!-- Cross-references to backlog features targeting this release.
     Format when Backlog module enabled:
     - [Feature Title](../../relative/path/to/feature.md) — State: Active
     Format without Backlog module:
     - [Feature description] — State: Planned | Delivered
     This section is seeded by /new-release and updated conversationally as features are assigned.
-->

## Documents

<!-- Attached planning documents in this release folder.
     - [Document Title](./filename.md) — [brief purpose]
-->

## Open Questions

## Blockers

## Decisions

## Context Log
```

## Release Status Lifecycle

| Status | Meaning | Terminal? |
|--------|---------|-----------|
| Planned | Release is defined but work has not started | No |
| In Progress | Work is actively underway for this release | No |
| Released | Release has shipped to its intended audience | Yes |
| Cancelled | Release was abandoned before shipping | Yes |

Transitions:
- `Planned → In Progress` — work begins; check for open blockers and questions
- `In Progress → Released` — confirm all targeted features are Closed/Resolved/Removed; set `Released Date:` and `Terminated:`
- `In Progress → Cancelled` — set `Terminated:`; scan for features still targeting this release and offer to reassign or clear their `Product Target Release:` field
- `Planned → Cancelled` — same as above

The `/transition` command handles release status changes using the `release-management` skill.

## Release Templates

Teams store document templates in `products/<slug>/releases/release-templates/`. Subfolders represent release types (e.g., `standard/`, `emergency/`, `hotfix/`). When `/new-release` runs, it asks which type to use and copies documents from that subfolder into the new version folder.

If only one subfolder exists, it is used without asking. If `release-templates/` has flat files (no subfolders), they are used directly — backwards-compatible with single-type setups.

**Framework-provided example templates** live in `Fabric/releases/templates/`. These are not automatically deployed to team instances. `/new-release` offers to seed `release-templates/` from them when the folder does not yet exist. After seeding, `release-templates/` is team-owned and will not be modified by `/update`.

## Feature Association

Backlog features target a release via the `Product Target Release:` field on the feature entity. The value is the version string (e.g., `v3.0`). The `## Features` section in the release entity is a convenience index:

- **Seeded** by `/new-release` by scanning the backlog for features with matching `Product:` and `Product Target Release:`
- **Updated conversationally** — when a feature is assigned to a release, the agent proposes updating both the feature's `Product Target Release:` and the release's `## Features` section in one confirmation
- **Not authoritative** — `Product Target Release:` on the feature is the source of truth; `## Features` is for convenience

When a release is Cancelled, scan the backlog for all features targeting this version and product, and offer to clear or reassign `Product Target Release:` on each one.

## Retention and GC

When `/clean-fabric` runs, release artifacts are included in its scan:

| Artifact | Terminal States | Retention | Action |
|----------|----------------|-----------|--------|
| Release folder | `Released`, `Cancelled` | 1 year | Archive → `products/<slug>/releases/archive/<version>.md` (gravestone), then delete folder |

Teams may override the 1-year default in the `## Fabric GC` table in CLAUDE.md using the key `release`.

Gravestone format for archived releases:

```markdown
# [Release Name] — Archived YYYY-MM-DD

Terminated: YYYY-MM-DD
Status at archive: Released | Cancelled
Product: [slug]

## Properties

[Copy the full header block verbatim]

## Summary

[Copy ## Summary content]

## Features

[Copy ## Features content at time of archive]

*Full history available via `git log -- products/<slug>/releases/<version>/`*
```

## Behavioral Rules

- The version folder name and the entity's `Version:` field must match.
- Release entity files (`<version>.md`) are protected by meta mode. Status transitions and document additions are not structural and do not require meta mode.
- When loading a release, read the parent `products/<slug>/product.md` for product context before answering questions.
- Cross-reference `Owner:` against `team/members/` to resolve name and role when displaying release context.
- When a release is transitioned to `Released`, prompt for `Released Date:` if not already set. Default to today.
- When a release is transitioned to `Cancelled`, scan the backlog for features with `Product Target Release:` set to this version for this product. Propose clearing or reassigning each feature's field.
- When a document is added to a release folder, propose adding a line to `## Documents` in the release entity.
- `/check` includes two release-specific checks: `release-missing-product` and `feature-target-no-release`.

## Commands

| Command | Description |
|---------|-------------|
| `/new-release` | Scaffold a new release for a product. Accepts product slug and version as arguments or interactively. |

## Skills

| Skill | Description |
|-------|-------------|
| `release-management` | Context loading, feature index maintenance, and transition logic for release entities. |
