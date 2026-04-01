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
  inbox/
    <item>.md
  epics/
    <epic>/
      epic.md
      features/
        <feature>/
          feature.md
          workitems/
            <workitem>/
              workitem.md
              tasks/
                <task>.md
```

Parent-child relationships are implicit via folder nesting. Each entity level contains a markdown file describing the item and a subfolder for its children.

### Inbox

The `backlog/inbox/` directory is a drop zone for rough work ideas that haven't been classified or placed in the hierarchy yet. Similar to how `staging/` holds raw content for ingestion, inbox holds raw work items for refinement. Inbox items are lightweight — a title, description, and optionally a suggested level (Epic, Feature, Work Item).

Inbox contents are local and transient — they are .gitignored (except the README). Items are removed from the inbox once placed into the hierarchy.

## Entity Hierarchy

Each level represents a different scale of work. The defaults below describe typical usage — teams can refine these definitions, statuses, and properties in the "How We Work" section of their constitution (CLAUDE.md).

### Epic
High-level initiative that can span multiple products and run for months. May originate from an accepted request (Triage module) or be created directly.

Properties:
- State: New | Active | Resolved | Removed | Closed
- External URL: [optional link to an external representation such as ADO url]
- Start Date: [optional]
- Target Date: [optional]
- Duration: [optional]
- Priority: [optional 1(lowest)-5(highest)]
- Area: [optional area path representing a product or service line]

Sections: Description, Related Items, Items this depends on, Child Summary

### Feature
Breakdown of an epic into business-facing capabilities, scoped to a single primary product. A feature is generally tied to a product release (though the release may not be known yet) and is on the scale of weeks.

Properties:
- Product: [the product this feature impacts]
- Product Target Release: [optional]
- State: New | Active | Resolved | Removed | Closed
- External URL: [optional link to an external representation such as ADO url]
- Start Date: [optional]
- Target Date: [optional]
- Duration: [optional]
- Priority: [optional 1(lowest)-5(highest)]
- Area: [optional area path representing a product or service line]

Sections: Description, Acceptance Criteria, Related Items, Items this depends on, Child Summary

### Work Item
Breakdown of a feature into assignable implementation work. A work item should take roughly a day to a week to complete.

Properties:
- State: New | Active | Resolved | Removed | Closed
- Type: Story | Request | Bug
- Iteration: [optional, named iteration or iteration path]
- External URL: [optional link to an external representation such as ADO url]
- Assigned to: [optional]

Sections: Description, Acceptance Criteria, Related Items, Items this depends on

### Task
Finest-grained unit of work. Each task is its own file under its parent work item. Tasks are measured in hours (typically 0.5–20 hours).

Properties:
- State: New | Active | Closed | Removed
- External URL: [optional link to an external representation such as ADO url]
- Assigned to: [optional]
- Estimated Hours: [optional]
- Remaining Hours: [optional]

Sections: Description

## External System Linking

Backlog entities can be linked to external work tracking systems (e.g. Azure DevOps) via the External URL property. This provides a reference point for future sync capabilities. The external system is not authoritative — the Fabric backlog files are the working copy.

## Iterations

An iteration is a named time block (typically two weeks) used to schedule work items. Iterations are referenced by name on work items via the Iteration property — they are not tracked as separate entities in the backlog hierarchy.

Work items may be moved between iterations as priorities shift. This is normal and expected. The Iteration property simply reflects the current plan, not a commitment.

Teams can define their iteration naming convention (e.g. "Sprint 42", "2026-Q2-W1", or an ADO iteration path) in the "How We Work" section of their constitution. The Backlog module does not prescribe a format.

Note: If the Scrum module is enabled, it may extend iterations with ceremonies, velocity tracking, and sprint-level reporting. The Backlog module treats iterations only as a scheduling label.

## Behavioral Rules

- The statuses, types, and scoping definitions above are defaults. Teams can override any of these in the "How We Work" section of their constitution (CLAUDE.md). When custom values are defined there, use those instead of the defaults.
- Backlog entities are structural and protected by meta mode.
- When creating a new feature, check if it should reference an existing product (if Product module is enabled).
- Status rollup: when all child entities are complete, suggest updating the parent's status.
- Do not create backlog entities autonomously. Propose the entity and wait for confirmation.
- Children inherit context from their parent through folder nesting. A work item inherits the scope of its parent feature, which inherits from its parent epic.

Classification, inbox refinement, assignment recommendations, and reclassification guidance are in the backlog-refinement skill.

## Relationship to Triage

When both Triage and Backlog modules are enabled, a user may ask to promote an accepted request to a backlog epic (e.g. "make R-044 an epic so we can start refining it"). This is a conversational action — no special command is needed.

When promoting a request to an epic:

1. **Create the epic** under `backlog/epics/` using the epic template.
2. **Carry forward** the request's description as the epic's description. It can be refined later during backlog breakdown.
3. **Carry forward the External URL** if the request already has one (e.g. an ADO epic link). The backlog epic inherits this link.
4. **Link back to the request** in the epic's Related Items section (e.g. "Originated from request R-044").
5. **Do not modify the request entity.** It stays in `requests/` as a historical record of intake and evaluation. The request's state is not changed by promotion — triage and backlog are independent records.
6. **Confirm before creating.** Propose the epic (title, description, carried-over fields) and wait for the user to approve before writing.

After promotion, the epic is a normal backlog item — the user can immediately begin refinement, breaking it into features and work items.

## Commands

| Command | Description |
|---------|-------------|
| /refine | Enter a backlog refinement conversation. Accepts an entity target, inbox item, or request ID. |
| /rollup-backlog | Refresh Child Summary sections on epics and features. |

## Skills

| Skill | Description |
|-------|-------------|
| backlog-refinement | Progressive refinement of backlog items using DEEP principles. Classification, elaboration, splitting, perspective checks, estimation, dependency scanning, assignment, readiness. |
