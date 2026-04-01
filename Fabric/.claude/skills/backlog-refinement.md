# Skill: Backlog Refinement

## Purpose

Guide progressive refinement of backlog items from rough concept to actionable, DoR-ready entities using DEEP principles (Detailed, Estimated, Emergent, Prioritized).

## When Used

- User discusses a new idea or concept that maps to backlog work
- User asks to break down, detail, or refine an existing backlog entity
- User asks what's missing from a backlog item or whether something is "ready"
- User brings an inbox item for classification and placement
- After request-to-epic promotion (from Triage module)
- During `/refine` command invocation

## When NOT Used

- Simple status queries (`/status`)
- Reporting (`/report`)
- Entity creation that's already fully specified (user provides complete details and just wants it written)

## Refinement Activities

The skill operates across a set of activities, not a strict sequence. Adapt order and depth based on what's already present and what the user is doing. Track which activities have been addressed and surface gaps naturally in conversation.

### Classify & Place

- If starting from an idea: determine hierarchy level (epic/feature/work item) using classification heuristics.
- Default assumption is feature-level. It's a work item if concrete and actionable (day to a week). It's an epic if it spans multiple products or takes months.
- Scan existing epics/features (using Child Summaries for efficiency) to find the right parent or detect duplication.
- If ambiguous, present 2-3 placement options with reasoning.
- If starting from an existing entity: skip this activity.
- When an existing feature already covers the idea, recommend adding to it rather than creating a duplicate.

### Elaborate

Progressive detailing appropriate to the entity level:

- **Epic:** Clear problem statement, scope boundaries (what's in/out), product references, rough target timeline.
- **Feature:** Description tied to a specific product, acceptance criteria (happy + unhappy paths), product target release if known.
- **Work Item:** Concrete implementation description, acceptance criteria, type classification (Story/Request/Bug).
- **Task:** Description, estimated hours.

Ask about what's missing, not what's already there. If the user provided a rich description up front, skip to gaps.

### Split

When an item seems too large for its level, proactively flag it:

- A feature that spans multiple products — suggest promoting to epic or splitting.
- A work item that would take more than a week — suggest splitting into multiple work items.
- A task over ~20 hours — suggest breaking down.

Present splitting options with reasoning, don't just say "this is too big."

### Perspective Checks

Apply different lenses depending on the entity level and conversation context:

- **Customer/Stakeholder lens:** "Does this solve the customer's actual problem?" — especially at feature and epic level. Challenge assumptions about what the customer needs. Surface when acceptance criteria describe implementation but not outcomes.
- **Implementer lens:** "Is this enough information to pick up and build?" — especially at work item level. Flag ambiguous requirements, missing technical context, undefined edge cases. When the user asks "is this enough for Bob to pick up?" — load Bob's profile, consider his expertise, and assess whether the item's description and criteria are sufficient for that person specifically.
- **Tester lens:** "How would you verify this works?" — ensure acceptance criteria are testable. Push for unhappy path coverage. If a work item has no clear way to validate it, that's a gap.

### Estimate

- Flag items missing estimation as a DoR gap (when priority warrants it).
- Prompt the user to estimate using whatever method the team uses (hours, points, t-shirt sizes — defined in "How We Work" or left to the user).
- For relative sizing, surface comparable sibling items: "Feature X in this epic was estimated at [value] — how does this compare?"

### Connect

- Scan parent and sibling entities using Child Rollup Summaries to keep context cheap.
- Surface potential dependencies and related items: "This feature touches the same product as Feature Y — any dependency?"
- Record confirmed dependencies in "Items this depends on" / "Related Items" sections.

### Assign

Activated when the user asks about assignment, not proactively. Follows existing assignment recommendation rules:

- Load team member profiles, consider role/expertise/allocation.
- Assess readiness for a specific person — "does this item have enough context for someone with Dana's background vs. someone with Jag's?"
- Present reasoning with top candidates and trade-offs.
- Wait for confirmation before updating the Assigned to field.

### Readiness Check

- Evaluate the entity against its level-appropriate DoR (see below).
- Surface remaining gaps as a checklist.
- Don't block — just inform. The user decides when an item is "ready enough."
- If the user asks "what's left?" or the conversation winds down, summarize outstanding gaps across all activities.

## Conversational Flow

The skill is conversational, not a wizard. Key behaviors:

- Adapt order based on what's already present and what the user offers.
- If the user dumps a detailed spec, skip straight to gaps.
- If they give a one-liner, start from scratch.
- If the user jumps around ("actually let me add a dependency first"), follow.
- Track which activities have been addressed and resurface gaps naturally.
- Never march through a checklist robotically.

## Priority Awareness

The skill respects the "Emergent" principle of DEEP:

- Only flag DoR gaps as actionable when the item is high priority or near the top of the backlog (next 2-3 iterations worth of work).
- For lower-priority items, acknowledge incompleteness without pressuring: "This epic has no features broken out yet — that's fine at Priority 2. You'll want to refine it further as it moves up."
- Never block or nag. Surface the state, respect the user's judgment about when to invest more detail.

## Definition of Ready (DoR) Defaults

Teams override these in "How We Work" section of their CLAUDE.md. If custom DoR criteria are defined for a level, those replace the defaults entirely for that level.

### Epic DoR

- Clear problem statement / description
- Scope boundaries defined (what's in, what's out)
- Priority set
- At least one child feature identified
- Product references established (if Product module enabled)
- Child Summary section present

### Feature DoR

- Description tied to a specific product
- Acceptance criteria with happy + unhappy paths
- Estimation addressed (method is team's choice)
- Dependencies identified (or explicitly "none")
- Child Summary section present
- Passes stakeholder lens: "Does this solve the customer's problem?"

### Work Item DoR

- Concrete implementation description
- Testable acceptance criteria
- Type classified (Story/Request/Bug)
- Estimation addressed
- Dependencies identified
- Passes implementer lens: "Is this enough to pick up and build?"
- Passes tester lens: "How would you verify this works?"

### Task DoR

- Description clear enough to execute
- Estimated hours provided
