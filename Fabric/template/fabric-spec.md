# TeamFabric Module: Spec

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Spec module provides a first-class home for implementation specs — the technical *how* an engineer writes before coding begins. A `spec.md` lives alongside `workitem.md` in the work item's folder, following the same co-location pattern the Release module uses for planning documents on product folders.

This module is for teams that want engineers to reason through an approach before touching code. It is not required for all work item types; teams typically apply it to Stories and large Bugs. Lightweight or trivial work items do not need a spec.

**Prerequisites**: Backlog module must be enabled. Spec files live inside the backlog hierarchy.

## Directory Structure

```
backlog/
  epics/
    <epic-id>/
      features/
        <feature-id>/
          workitems/
            <workitem-id>/
              workitem.md     # Existing work item entity
              spec.md         # Co-located implementation spec (this module)
              tasks/
```

One `spec.md` per work item. The file is co-located in the work item folder — there is no separate `specs/` directory.

## Spec Entity Structure

```markdown
# [Title — usually mirrors the work item title]

## Properties

- State: Draft | Ready | Approved | Superseded
- Created: YYYY-MM-DD
- Author: [name]
- Approved By: —
- Approved On: —
- Work Item: [relative path to workitem.md]

## Context

[Why is this work needed? What problem does it solve? Link to relevant requests, epics, or external sources.]

## Approach

[How will the work be implemented at a high level? Key design decisions belong here.]

## Components Affected

[Which services, modules, files, or systems will change?]

## Schema Changes

[Database or data model changes. Remove this section if not applicable.]

## API Changes

[New or modified API endpoints, contracts, or interfaces. Remove if not applicable.]

## UI Changes

[Screens, flows, or visual changes. Remove if not applicable.]

## Test Plan

[How will the implementation be verified? Unit tests, integration tests, manual steps.]

## Out of Scope

[Explicit call-outs for what this work does NOT cover.]

## Open Questions

[Questions that emerged during spec writing that need resolution before or during implementation.]

## Decisions

[Design decisions made during the spec phase — use the standard Decisions entry format.]

## Context Log

[Append-only ingestion journal for spec-related context.]
```

## Spec Lifecycle

| State | Meaning |
|-------|---------|
| Draft | Spec is being written. Not ready for review. |
| Ready | All required sections are filled; open questions are resolved. Available for approval. |
| Approved | An approver has confirmed the spec is sound. Safe to begin coding. |
| Superseded | This spec has been replaced by a rewrite. Preserved as history. |

### Transition Rules

**Draft → Ready**: all of Context, Approach, Components Affected, and Test Plan are non-empty, and there are no unresolved `## Open Questions` (all items are checked or the section is empty). The `/spec review` command evaluates these conditions and offers the transition.

**Ready → Approved**: requires explicit approver confirmation via `/spec approve`. The approver's name and the date are recorded in Properties. The agent does not approve silently.

**Any → Superseded**: when the spec has been substantially replaced by a new direction. The agent sets `State: Superseded` and preserves the file as a historical record (git history retains full content). When `/spec create` is run on a work item with an existing `Superseded` spec, the agent offers to overwrite it with a fresh Draft — it does not block on the old file.

## Behavioral Rules

- When the Spec module is active and a work item is loaded, check for a sibling `spec.md`. If found, surface its state prominently in any work item summary: "Spec: Draft / Ready / Approved / Superseded."
- A missing spec is not an error. Not every work item needs one. Surface its absence only when it is relevant — e.g., during a New → Active transition on a Story-type work item (see entity-transitions skill).
- Spec files are co-located framework content but are not structural files. They do not require meta mode to create, edit, or transition. They follow the same propose-confirm-write discipline as entity content.
- `/spec create` pre-fills the Context section from the work item's `## Description` and sets `Work Item:` to the relative path to `workitem.md`. The author is resolved via the `identity` skill.
- Teams may add domain-specific sections (e.g. "Infrastructure Changes", "Rollback Plan") below the default sections in their CLAUDE.md. The agent should accept and preserve any additional sections found in the file.
- After writing or updating a spec, offer to refresh the backlog index: `python fabscripts/backlog_index.py`.

## Relationship to Backlog

Spec files are children of work items within the backlog hierarchy, but they are not backlog entities — they have no State in the backlog sense (Active/Closed/etc.), they do not appear in the entity-transitions rollup, and they are not counted in the backlog index's entity counts. They are attached documents, like release planning documents on a release entity.

The spec's lifecycle (Draft → Approved) is independent of the work item's lifecycle (New → Active → Closed). An Approved spec should typically precede work item activation on Story-type items; a Closed work item may still carry its spec as a permanent record of how the work was approached.

## Commands

| Command | Description |
|---------|-------------|
| `/spec create [wi-id]` | Scaffold a new `spec.md` for the given work item. Pre-fills Context from the work item description. |
| `/spec review [wi-id]` | Walk through the spec sections to assess completeness. Offers to transition to Ready when all conditions are met. |
| `/spec approve [wi-id]` | Record approval on the spec. Requires State: Ready. Records approver and date. |
