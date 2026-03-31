# TeamFabric Module: Backlog

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Backlog module provides a hierarchical work tracking structure: Epic > Feature > Work Item > Task. This is for teams that break work into structured deliverables. Teams that manage work informally or through external tools do not need this module.

## Directory Structure

```
backlog/
  epics/
    E-001/
      epic.md
      features/
        F-001/
          feature.md
          work-items/
            WI-001.md
```

## Entity Hierarchy

### Epic
High-level initiative. May originate from an accepted request (Triage module) or be created directly.

```markdown
# E-001: Epic Title
Status: Planned | Active | Complete | Cancelled
Owner: [team member name]
Products: [comma-separated product names, if Product module enabled]
Summary: [2-3 sentence current state]

## Properties
Description: [what this epic delivers]
Origin: [e.g., "Request R-042" or "Team initiative"]
Target: [optional date or milestone]

## Context Log
```

### Feature
Breakdown of an epic into business-facing capabilities.

```markdown
# F-001: Feature Title
Status: Planned | Active | Complete
Owner: [team member name]
Epic: E-001
Summary: [current state]

## Properties
Description: [what this feature delivers to users]
Acceptance Criteria:
- [criterion 1]
- [criterion 2]

## Context Log
```

### Work Item
Breakdown of a feature into assignable implementation work.

```markdown
# WI-001: Work Item Title
Status: Not Started | In Progress | Complete | Blocked
Owner: [team member name]
Feature: F-001
Summary: [current state]

## Properties
Description: [what needs to be built or done]
Estimated Hours: [number]

## Tasks
- [ ] Task description (assigned to: name, hours remaining: N)
- [ ] Task description (assigned to: name, hours remaining: N)

## Context Log
```

## ID Assignment

- Epics: `E-NNN` (sequential, zero-padded to 3 digits minimum)
- Features: `F-NNN`
- Work Items: `WI-NNN`
- IDs are global within the Fabric instance (not scoped to parent entity).

## Behavioral Rules

- Backlog entities are structural and protected by meta mode.
- When creating a new epic, check if it should reference existing products (if Product module is enabled).
- Status rollup: when all child entities are complete, suggest updating the parent's status.
- Do not create backlog entities autonomously. Propose the entity and wait for confirmation.
- Tasks are the finest-grained breakdown. They live inline on work items as checkbox items, not as separate files.

## Relationship to Triage

When both Triage and Backlog modules are enabled, accepted requests can be promoted to epics. The epic's `Origin` field links back to the request. The request entity is not modified — it stays in `requests/` as a historical record.
