# Backlog Refinement Skill — Design Spec

Date: 2026-04-01

## Summary

A conversational backlog refinement skill that guides progressive elaboration of backlog items from rough concept to actionable, DoR-ready entities using DEEP principles (Detailed, Estimated, Emergent, Prioritized). Paired with a lightweight `/refine` command for explicit entry and a `/rollup-backlog` command for maintaining parent-child context summaries.

## Artifacts

| Artifact | Type | Description |
|----------|------|-------------|
| `backlog-refinement` | Skill | Procedural refinement logic — eight activities: classify & place, elaborate, split, perspective checks, estimate, connect, assign, readiness check |
| `/refine` | Command | Lightweight entry point into a refinement conversation |
| `/rollup-backlog` | Command | Refresh Child Summary sections on epics and features |
| `fabric-backlog.md` | Module doc edit | Extract procedural guidance into skill, add Child Summary to entity schemas |
| `entity-maintenance` | Skill edit | Add rollup summary maintenance logic |
| `fabric-triage.md` | Module doc edit | Add `Backlog Epic` cross-reference field to request entity schema |

## Skill: `backlog-refinement`

### Purpose

Guide progressive refinement of backlog items from rough concept to actionable, DoR-ready entities using DEEP principles.

### When Used (Implicit Activation)

- User discusses a new idea or concept that maps to backlog work
- User asks to break down, detail, or refine an existing backlog entity
- User asks what's missing from a backlog item or whether something is "ready"
- User brings an inbox item for classification and placement
- After request-to-epic promotion (from Triage module)
- During `/refine` command invocation

### When NOT Used

- Simple status queries (`/status`)
- Reporting (`/report`)
- Entity creation that's already fully specified (user provides complete details and just wants it written)

### Refinement Activities

The skill operates across a set of activities, not a strict sequence. The AI adapts order and depth based on what's already present and what the user is doing. It tracks which activities have been addressed and surfaces gaps naturally in conversation.

#### Classify & Place

- If starting from an idea: determine hierarchy level (epic/feature/work item) using classification heuristics
- Default assumption is feature-level. It's a work item if concrete and actionable (day to a week). It's an epic if it spans multiple products or takes months.
- Scan existing epics/features (using Child Summaries for efficiency) to find the right parent or detect duplication
- If ambiguous, present 2-3 placement options with reasoning
- If starting from an existing entity: skip this activity
- When an existing feature already covers the idea, recommend adding to it rather than creating a duplicate

#### Elaborate

Progressive detailing appropriate to the entity level:

- **Epic:** Clear problem statement, scope boundaries (what's in/out), product references, rough target timeline
- **Feature:** Description tied to a specific product, acceptance criteria (happy + unhappy paths), product target release if known
- **Work Item:** Concrete implementation description, acceptance criteria, type classification (Story/Request/Bug)
- **Task:** Description, estimated hours

The AI asks about what's missing, not what's already there. If the user provided a rich description up front, skip to gaps.

#### Split

When an item seems too large for its level, proactively flag it:

- A feature that spans multiple products — suggest promoting to epic or splitting
- A work item that would take more than a week — suggest splitting into multiple work items
- A task over ~20 hours — suggest breaking down

Present splitting options with reasoning, don't just say "this is too big."

#### Perspective Checks

Apply different lenses depending on the entity level and conversation context:

- **Customer/Stakeholder lens:** "Does this solve the customer's actual problem?" — especially at feature and epic level. Challenge assumptions about what the customer needs. Surface when acceptance criteria describe implementation but not outcomes.
- **Implementer lens:** "Is this enough information to pick up and build?" — especially at work item level. Flag ambiguous requirements, missing technical context, undefined edge cases. When the user asks "is this enough for Bob to pick up?" — load Bob's profile, consider his expertise, and assess whether the item's description and criteria are sufficient for that person specifically.
- **Tester lens:** "How would you verify this works?" — ensure acceptance criteria are testable. Push for unhappy path coverage. If a work item has no clear way to validate it, that's a gap.

#### Estimate

- Flag items missing estimation as a DoR gap (when priority warrants it)
- Prompt the user to estimate using whatever method the team uses (hours, points, t-shirt sizes — defined in "How We Work" or left to the user)
- For relative sizing, surface comparable sibling items: "Feature X in this epic was estimated at [value] — how does this compare?"

#### Connect

- Scan parent and sibling entities using Child Rollup Summaries to keep context cheap
- Surface potential dependencies and related items: "This feature touches the same product as Feature Y — any dependency?"
- Record confirmed dependencies in "Items this depends on" / "Related Items" sections

#### Assign

Activated when the user asks about assignment, not proactively. Follows existing assignment recommendation rules:

- Load team member profiles, consider role/expertise/allocation
- Assess readiness for a specific person — "does this item have enough context for someone with Dana's background vs. someone with Jag's?"
- Present reasoning with top candidates and trade-offs
- Wait for confirmation before updating the Assigned to field

#### Readiness Check

- Evaluate the entity against its level-appropriate DoR (see below)
- Surface remaining gaps as a checklist
- Don't block — just inform. The user decides when an item is "ready enough"
- If the user asks "what's left?" or the conversation winds down, summarize outstanding gaps across all activities

### Conversational Flow

The skill is conversational, not a wizard. Key behaviors:

- Adapt order based on what's already present and what the user offers
- If the user dumps a detailed spec, skip straight to gaps
- If they give a one-liner, start from scratch
- If the user jumps around ("actually let me add a dependency first"), follow
- Track which activities have been addressed and resurface gaps naturally
- Never march through a checklist robotically

### Priority Awareness

The skill respects the "Emergent" principle of DEEP:

- Only flag DoR gaps as actionable when the item is high priority or near the top of the backlog (next 2-3 iterations worth of work)
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

## Command: `/refine`

### Purpose

Enter a backlog refinement conversation, optionally targeting a specific entity.

### Usage

- `/refine` — start from a new idea, no target
- `/refine E-001` — refine a specific epic
- `/refine ehr-pipeline-modernization` — target by folder slug
- `/refine inbox/my-idea` — pick up an inbox item for classification and refinement
- `/refine R-101` — target a request (bridges Triage and Backlog modules)

### Behavior

1. If a target is provided, load the entity and its parent's rollup summary for context
2. If the target is a request (`R-NNN`):
   - If the request has no linked backlog epic, propose creating one (carry forward description, External URL, link back to request, don't modify the request entity)
   - If the request already has a linked epic, jump to refining that epic
   - The request's evaluation data (L1/L2 rubric results, context log) becomes input context for the refinement conversation
3. Run an initial DoR gap scan against the level-appropriate checklist
4. Present a brief status: what's present, what's missing, what looks like it might need splitting or further elaboration
5. Drop into conversational refinement — the skill takes over from here
6. If no target, ask what the user wants to work on — a new idea, an inbox item, or an existing entity

### Notes

- Does not require meta mode to start — the refinement conversation is read-only until the user approves a proposed edit, at which point meta mode rules apply as normal
- The command is a thin entry point. All procedural logic lives in the skill.

## Command: `/rollup-backlog`

### Purpose

Refresh Child Summary sections on epics and features.

### Usage

- `/rollup-backlog E-001` — scan a specific epic or feature node
- `/rollup-backlog ehr-pipeline-modernization` — target by folder slug
- `/rollup-backlog` — scan all epics, surface which ones have stale rollups, let user pick which to update
- `/rollup-backlog E-001 --deep` — rollup features under the epic first, then rollup the epic itself (bottom-up)

### Behavior

1. Scan all direct children of the target entity
2. Compare against the existing Child Summary section
3. Propose updates for anything that's changed (new children, status changes, re-estimation, removed items)
4. Wait for confirmation before writing

### Implementation

The rollup logic lives in the `entity-maintenance` skill. This command invokes that skill.

## Schema Additions

### Child Summary Section (Epics and Features)

New section added to epic and feature entity schemas:

```markdown
## Child Summary
Last updated: YYYY-MM-DD

- **child-slug** (Level, State) — Brief description. N work items, ~Xh estimated.
- **child-slug** (Level, State) — Brief description. Unestimated.
```

One line per direct child. Contains: name, hierarchy level, state, what it does, and a sizing signal (child count, hours if known). Enough to understand scope and spot overlaps without loading child files.

**Maintenance rules:**
- Updated as part of refinement activity or via `/rollup-backlog`, not autonomously
- Follows the "propose and confirm" pattern as all entity edits
- Staleness: if a child has been modified outside of refinement, the rollup may be stale. Flagged during refinement rather than kept perpetually in sync.

### Backlog Epic Field on Requests

New optional field on request entities:

```markdown
Backlog Epic: E-001
```

A cross-reference added to the request when it's promoted to a backlog epic. Does not modify the request's triage state — just adds a pointer so `/refine R-101` knows where to go.

## Module Doc Changes

### `fabric-backlog.md` — Sections to Extract

The following procedural sections move from `fabric-backlog.md` into the `backlog-refinement` skill:

- **Classification Guidance** — default-to-feature heuristic, level determination rules, "present 2-3 options" guidance
- **Inbox Refinement** — compare against existing, propose classification, carry description forward
- **Assignment Recommendations** — role/expertise/allocation matching logic
- **Reclassification and Movement** — move items, re-evaluate placement, parent scope update

### `fabric-backlog.md` — Sections Remaining

- Entity hierarchy definitions (Epic/Feature/Work Item/Task schemas and properties)
- State values and defaults
- Directory structure
- Behavioral rules (meta mode, status rollup, propose-and-confirm)
- Relationship to Triage (request promotion mechanics)
- Iteration definitions
- External system linking

### `fabric-backlog.md` — New Additions

- Child Summary section added to Epic and Feature entity schemas
- `/refine` registered in Commands table
- `/rollup-backlog` registered in Commands table
- `backlog-refinement` registered in Skills table
- Reference to entity-maintenance skill for rollup logic

### `fabric-triage.md` — New Addition

- `Backlog Epic` field added to request entity schema as an optional cross-reference

### `entity-maintenance` Skill — New Addition

- Rollup summary logic: scan children of an epic or feature, generate/compare Child Summary section, propose updates

## Registration

### Commands (registered in `fabric-backlog.md`)

| Command | Description |
|---------|-------------|
| /refine | Enter a backlog refinement conversation. Accepts an entity target, inbox item, or request ID. |
| /rollup-backlog | Refresh Child Summary sections on epics and features. |

### Skills (registered in `fabric-backlog.md`)

| Skill | Description |
|-------|-------------|
| backlog-refinement | Progressive refinement of backlog items using DEEP principles. Classification, elaboration, splitting, perspective checks, estimation, dependency scanning, assignment, readiness. |
