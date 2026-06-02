# Skill: Release Management

## Purpose

Provides behavioral guidance for working with release entities: loading context, seeding the features index, driving status transitions, and maintaining document references.

## Context Loading

When a user references a release by version or asks a question about a release:

1. Locate the release entity at `products/<slug>/releases/<version>/<version>.md`.
2. Load the parent product entity at `products/<slug>/product.md` for product context.
3. If the Backlog module is enabled and `## Features` is non-empty, note the count and current states of referenced features.

When the version or product is ambiguous, scan `products/*/releases/*/` and present matching candidates for the user to select.

## Feature Index Maintenance

**Assigning a feature to a release:**

When the user assigns a feature to a release (e.g., "add the FHIR parser feature to v3.0"):

1. Read the feature file and verify its `Product:` field matches the release's product.
2. Propose two writes together as one confirmation:
   - Set `Product Target Release: <version>` on the feature entity
   - Add a line to `## Features` in the release entity: `- [Feature Title](relative/path/to/feature.md) — State: <state>`
3. Show the proposal and wait for confirmation before writing either file.

**Format for Features entries:**

```
- [Feature Title](relative/path/to/feature.md) — State: New | Active | Closed | Resolved | Removed
```

Paths are relative from the release entity file (e.g., `../../../backlog/epics/<epic-id>/features/<feature-id>/feature.md`).

## Status Transition: → In Progress

1. Check for open blockers in `## Blockers` and unchecked items in `## Open Questions`. Surface any found:
   > "Moving `<version>` to In Progress. There is 1 active blocker and 2 unchecked open questions. Proceed?"
2. On confirmation, write `Status: In Progress`.

## Status Transition: In Progress → Released

1. If the Backlog module is enabled and `## Features` is non-empty, walk each referenced feature and read its current `State:`.
2. Report any features that are not Closed, Resolved, or Removed:
   ```
   Releasing: [Release Name]

   ⚠ Features not yet complete:
   - [Feature Title] — State: Active
   - [Feature Title] — State: New

   Proceed with release anyway? (yes / no)
   ```
3. On confirmation:
   - Write `Status: Released`
   - Prompt for `Released Date:` if not already set; default to today
   - Write `Terminated: <today>`
4. Offer a context log entry:
   > "Add a context log entry for this release? (e.g., 'Released to production. Delivered N features.')"

## Status Transition: → Cancelled

1. If the Backlog module is enabled, scan `backlog/` for all features where `Product: <product>` and `Product Target Release: <version>`. This scan supplements `## Features` (which may be incomplete).
2. For each found feature, offer to clear `Product Target Release:` or reassign to a different version:
   ```
   Cancelling release <version>. The following features target it:
   - [Feature Title] (path/to/feature.md) — State: Active

   For each: (c)lear Product Target Release, (r)eassign to another version, or (l)eave as-is?
   ```
3. Write `Status: Cancelled` and `Terminated: <today>`.

## Document Tracking

When a new document is created in a release folder by the user or via conversation, propose adding a line to `## Documents` in the release entity:

> "Add an entry to `## Documents` for this file? Format: `- [Document Title](./filename.md) — [brief purpose]`"

Confirm the title and purpose with the user before writing.

## Check Flags

When `/check` runs, include these release-specific checks:

**`release-missing-product`** — A release folder exists at `products/<slug>/releases/<version>/` but either:
- `products/<slug>/product.md` does not exist, or
- The product's `Status:` is `Retired` or `Sunset`

Finding: "Release `<version>` references a product that is missing or no longer active."

**`feature-target-no-release`** — A feature has `Product Target Release: <version>` set but no folder exists at `products/<slug>/releases/<version>/` for the feature's `Product:` slug.

Finding: "Feature targets release `<version>` for `<product>` but no release folder exists. Run `/new-release <slug> <version>` to create it."

When scanning for `feature-target-no-release`, convert product names to slugs using the same loose matching used by `/new-release` (lowercase, hyphenated).
