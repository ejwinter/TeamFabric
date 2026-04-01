# Backlog Inbox

Drop rough work ideas here for refinement. Files in this directory (except this README) are in .gitignore and are local to your workstation.

## How to use

- Create a markdown file for each idea. Use the inbox item template or just freeform notes — the goal is to capture enough context for the agent to help classify and place the item.
- You can also describe ideas directly in conversation. The agent will create inbox items or place them directly into the backlog hierarchy.
- During refinement, the agent will review inbox items, compare them against the existing backlog, and recommend where each one fits (epic, feature, or work item). It will present options when the classification is ambiguous.
- Once confirmed, the item is moved into the backlog hierarchy and promoted to the appropriate template. The inbox copy is removed.

## What belongs here

- Ideas that aren't yet clear enough to classify (epic vs. feature vs. work item)
- Work that might fit under an existing feature or epic but you're not sure which
- Rough notes from conversations, meetings, or ad-hoc requests

## What doesn't belong here

- Items you already know where to place — create them directly in the hierarchy
- Raw content for ingestion (that goes in `staging/`)
