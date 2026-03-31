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

Sections: Description, Related Items, Items this depends on

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

Sections: Description, Acceptance Criteria, Related Items, Items this depends on

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

### Classification Guidance

When classifying a new idea — whether from the inbox, conversation, or a pasted note — use these heuristics:

- **Default assumption is feature-level.** Most ideas people bring to refinement describe a capability or change that maps to a feature. Start there unless the scope clearly points elsewhere.
- **It's a work item if** the idea is already specific and actionable — a concrete change someone could pick up and complete in a day to a week. Work items are broken-down pieces of a feature, not standalone ideas.
- **It's an epic if** the idea spans multiple products, requires multiple distinct capabilities to deliver, or would take months. New epics are relatively rare — more often the idea fits as a feature under an existing or slightly expanded epic.
- **When in doubt, present options.** Classification is often not obvious. Present 2–3 plausible placements with reasoning and let the user choose. For example: "This could be a new feature under Epic X, or it might warrant its own epic if the scope grows. It could also fit as a work item under Feature Y if we narrow it to just the API change."

When an existing feature already covers the idea, recommend adding to it (as a work item or by updating the feature's scope) rather than creating a duplicate.

### Inbox Refinement

- When reviewing inbox items, compare against existing epics and features to recommend placement.
- Propose a classification (epic, feature, or work item) and a location in the tree. Wait for confirmation before moving.
- When an inbox item is confirmed for placement, move it into the correct location in the hierarchy, promote it to the appropriate entity template, and carry the original description forward.
- Inbox items that don't fit anywhere may indicate a new epic is needed — suggest this when appropriate.
- Partial trees are normal. An epic can exist without features, a feature without work items. Do not pressure users to fully decompose in a single session.

### Assignment Recommendations

When asked who should be assigned to a backlog item, review team member profiles (`team/members/`) and consider:

- **Role and responsibilities.** Leads and analysts typically own features. Developers and engineers own work items and tasks.
- **Expertise match.** Compare the item's subject area against member expertise and responsibilities.
- **Work item type matters.** Bugs should typically be assigned to a developer initially, then reassigned to a tester for validation once resolved.
- **Allocation and status.** Prefer members who are Active and have capacity (higher Allocation %). Do not recommend members who are Benched or fully committed.
- **Present reasoning.** When recommending an assignee, briefly explain why they're a good fit. If multiple members could handle the item, present the top candidates with trade-offs.

Assignment recommendations are suggestions — always wait for confirmation before updating the Assigned to field.

### Reclassification and Movement

- A user may ask the agent to move an item to a different parent or reclassify it (e.g. promote a work item to a feature, or move a feature to a different epic). Propose the move with reasoning and wait for confirmation.
- When an item is added, moved, or significantly changed, evaluate whether the parent's description still accurately reflects its children. If the parent's scope has shifted, propose an updated description. The same applies upward — a feature change may affect its epic's description.
- A user may ask the agent to reevaluate an item's placement after the surrounding context has changed (new siblings, revised parent scope, shifted priorities). Review the item against its current parent and nearby alternatives, then present findings.

## Relationship to Triage

When both Triage and Backlog modules are enabled, accepted requests can be promoted to epics. The epic's description or Related Items section links back to the request. The request entity is not modified — it stays in `requests/` as a historical record.
