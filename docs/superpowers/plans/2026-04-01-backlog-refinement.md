# Backlog Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a conversational backlog refinement skill, `/refine` and `/rollup-backlog` commands, Child Summary schema additions, and a `Backlog Epic` cross-reference on requests.

**Architecture:** Six artifacts — one new skill file, two new command files, and edits to three existing module/skill files. The skill contains all procedural refinement logic (extracted from `fabric-backlog.md`). Commands are thin entry points. The entity-maintenance skill gains rollup logic. Module docs gain schema additions and registration tables.

**Tech Stack:** Markdown (framework behavioral docs, skill definitions, command definitions). No code — all artifacts are instructional markdown consumed by an AI agent.

---

### Task 1: Create the backlog-refinement skill

**Files:**
- Create: `Fabric/.claude/skills/backlog-refinement.md`

This is the largest artifact. It contains all eight refinement activities, conversational flow guidance, DoR defaults, and priority awareness rules. Content is drawn from the spec's "Skill: backlog-refinement" section, reorganized into the skill file format used by existing skills (see `request-evaluation.md` for pattern).

- [ ] **Step 1: Create the skill file**

Write `Fabric/.claude/skills/backlog-refinement.md` with the following content:

```markdown
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
```

- [ ] **Step 2: Verify the file was created**

Run: `cat Fabric/.claude/skills/backlog-refinement.md | head -5`
Expected: Shows the `# Skill: Backlog Refinement` header and Purpose section start.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/backlog-refinement.md
git commit -m "feat: add backlog-refinement skill

Progressive refinement of backlog items using DEEP principles.
Eight activities: classify, elaborate, split, perspective checks,
estimate, connect, assign, readiness check."
```

---

### Task 2: Create the `/refine` command

**Files:**
- Create: `Fabric/.claude/commands/refine.md`

Thin entry point following the pattern in `evaluate-request.md` — resolves target, sets up context, hands off to the skill.

- [ ] **Step 1: Create the command file**

Write `Fabric/.claude/commands/refine.md` with the following content:

```markdown
# /refine — Enter a Backlog Refinement Conversation

## Purpose
Start or continue a refinement conversation, optionally targeting a specific entity.

## Usage
- `/refine` — start from a new idea, no target
- `/refine E-001` — refine a specific epic
- `/refine ehr-pipeline-modernization` — target by folder slug
- `/refine inbox/my-idea` — pick up an inbox item for classification and refinement
- `/refine R-101` — target a request (bridges Triage and Backlog modules)

## Behavior

1. **Resolve the target.**
   - If a target is provided, load the entity. If the target is a folder slug, search `backlog/epics/` and `backlog/epics/*/features/` for a matching directory name.
   - If the target is an inbox item path, load from `backlog/inbox/`.
   - If not found, ask the user to clarify.
   - If no target is provided, ask what the user wants to work on — a new idea, an inbox item, or an existing entity.

2. **If the target is a request (`R-NNN`):**
   - Load the request entity from `requests/<request-id>/request.md`.
   - Check for a `Backlog Epic` field on the request.
   - If no linked epic: propose creating one. Carry forward the request's description, External URL, and link back to the request in Related Items. Do not modify the request entity itself.
   - If the request already has a linked epic: load that epic and proceed to refining it.
   - The request's evaluation data (L1/L2 rubric results, context log) becomes input context for the refinement conversation.

3. **Load parent context.**
   - If the target entity has a parent, load the parent's Child Summary section for sibling context. This keeps context cheap without loading every sibling file.

4. **Run an initial DoR gap scan.**
   - Evaluate the entity against its level-appropriate DoR checklist (from the backlog-refinement skill).
   - Present a brief status: what's present, what's missing, what looks like it might need splitting or further elaboration.

5. **Drop into conversational refinement.**
   - The backlog-refinement skill takes over from here.

## Notes
- Does not require meta mode to start — the refinement conversation is read-only until the user approves a proposed edit, at which point meta mode rules apply as normal.
- All procedural logic lives in the backlog-refinement skill. This command handles target resolution and initial context loading only.
```

- [ ] **Step 2: Verify the file was created**

Run: `cat Fabric/.claude/commands/refine.md | head -5`
Expected: Shows the `# /refine` header.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/refine.md
git commit -m "feat: add /refine command

Lightweight entry point into backlog refinement conversations.
Resolves entity targets including requests, inbox items, and
folder slugs."
```

---

### Task 3: Create the `/rollup-backlog` command

**Files:**
- Create: `Fabric/.claude/commands/rollup-backlog.md`

- [ ] **Step 1: Create the command file**

Write `Fabric/.claude/commands/rollup-backlog.md` with the following content:

```markdown
# /rollup-backlog — Refresh Child Summary Sections

## Purpose
Regenerate Child Summary sections on epics and features to reflect current child entity state.

## Usage
- `/rollup-backlog E-001` — scan a specific epic or feature node
- `/rollup-backlog ehr-pipeline-modernization` — target by folder slug
- `/rollup-backlog` — scan all epics, surface which ones have stale rollups, let user pick which to update
- `/rollup-backlog E-001 --deep` — rollup features under the epic first, then rollup the epic itself (bottom-up)

## Behavior

1. **Resolve the target.**
   - If a target is provided, locate the entity directory. Search `backlog/epics/` and feature subdirectories for matching entity IDs or folder slugs.
   - If not found, ask the user to clarify.
   - If no target is provided, scan all epic directories under `backlog/epics/`. For each, check whether a Child Summary section exists and whether it appears stale (missing children, different child count than subdirectories). Present the list and let the user pick which to update.

2. **Scan children.**
   - List all direct child directories of the target entity.
   - For each child, read the entity file header (everything before the first `##` section) to extract: name (from `# ` title), state, and level.
   - For features: count work item subdirectories and sum estimated hours from task files (if present) for the sizing signal.
   - For epics: count feature subdirectories and note their states.

3. **Compare against existing Child Summary.**
   - If the entity has a `## Child Summary` section, compare the scanned state against it.
   - Identify: new children not in the summary, children whose state changed, children that were removed, estimation changes.
   - If no Child Summary section exists, generate one from scratch.

4. **If `--deep` flag is set:**
   - Process bottom-up: first rollup each child feature's Child Summary (scanning their work items), then rollup the epic's Child Summary (using the freshly updated feature summaries).

5. **Propose updates.**
   - Show the proposed Child Summary section with changes highlighted.
   - Wait for confirmation before writing.

6. **Write on confirmation.**
   - Replace the existing `## Child Summary` section or insert it after the last existing section (before `## Context Log` if present).
   - Update the `Last updated` date to today.

## Notes
- Requires meta mode (modifies structural entity files).
- The rollup logic is implemented in the entity-maintenance skill. This command handles target resolution, scan orchestration, and the `--deep` flag.
```

- [ ] **Step 2: Verify the file was created**

Run: `cat Fabric/.claude/commands/rollup-backlog.md | head -5`
Expected: Shows the `# /rollup-backlog` header.

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/commands/rollup-backlog.md
git commit -m "feat: add /rollup-backlog command

Refresh Child Summary sections on epics and features.
Supports targeting by ID or slug, scan-all mode, and
bottom-up --deep rollup."
```

---

### Task 4: Add rollup summary logic to entity-maintenance skill

**Files:**
- Modify: `Fabric/.claude/skills/entity-maintenance.md`

Append a new section after the existing "Catch-All Context" section (line 47) and before "Notes" (line 51).

- [ ] **Step 1: Add the rollup section**

Open `Fabric/.claude/skills/entity-maintenance.md` and insert the following new section between the `## Catch-All Context` section and the `## Notes` section:

```markdown
## Child Summary Rollup

Generates and maintains Child Summary sections on epics and features. Invoked by the `/rollup-backlog` command or during refinement when the backlog-refinement skill detects a stale or missing rollup.

### Child Summary Format

```
## Child Summary
Last updated: YYYY-MM-DD

- **child-slug** (Level, State) — Brief description. N work items, ~Xh estimated.
- **child-slug** (Level, State) — Brief description. Unestimated.
```

One line per direct child. Contains: name (folder slug), hierarchy level, state, what it does (from the entity's description first sentence or summary), and a sizing signal (child count, hours if known). Enough to understand scope and spot overlaps without loading child files.

### Scanning Process

1. List all direct child directories of the target entity.
2. For each child, read only the entity file header (everything before the first `##` section) to extract: title (from `# ` heading), state (from `State:` property).
3. Read the first sentence of the child's `## Description` section for the brief description.
4. For features as children of an epic: count work item subdirectories under `workitems/`.
5. For work items as children of a feature: count task files under `tasks/` and sum `Estimated Hours` values from task headers.
6. If hours data is unavailable, use "Unestimated" as the sizing signal.

### Comparison and Update

When an existing Child Summary is present:

1. Parse each line to extract the child slug and state.
2. Compare against the scanned children.
3. Flag: new children not in the summary, children whose state changed, children removed from the directory, estimation changes.
4. Propose the updated section showing what changed.

When no Child Summary exists, generate the full section from the scan results.

### Placement

Insert the `## Child Summary` section after `## Items this depends on` (or after the last standard section if that section is absent). If a `## Context Log` section exists, place Child Summary before it.

### Maintenance Rules

- Updated as part of refinement activity or via `/rollup-backlog`, not autonomously.
- Follows the "propose and confirm" pattern — all entity edits require human confirmation.
- Staleness: if a child has been modified outside of refinement, the rollup may be stale. This is flagged during refinement rather than kept perpetually in sync.
```

- [ ] **Step 2: Verify the edit**

Run: `grep "Child Summary Rollup" Fabric/.claude/skills/entity-maintenance.md`
Expected: `## Child Summary Rollup`

- [ ] **Step 3: Commit**

```bash
git add Fabric/.claude/skills/entity-maintenance.md
git commit -m "feat: add child summary rollup logic to entity-maintenance skill

Scanning process, comparison/update rules, and placement
guidance for maintaining Child Summary sections on epics
and features."
```

---

### Task 5: Update `fabric-backlog.md` — extract procedural sections, add schema and registration

**Files:**
- Modify: `Fabric/template/fabric-backlog.md`

This task makes four changes to `fabric-backlog.md`:
1. Remove the four procedural sections (Classification Guidance, Inbox Refinement, Assignment Recommendations, Reclassification and Movement) that now live in the skill
2. Add Child Summary section to Epic and Feature entity schemas
3. Add Commands table
4. Add Skills table

Because the same content exists in `Example/.claude/fabric-backlog.md` (deployed copy), that file needs the same changes. However, since Example uses a copy (not symlink) for module docs, it will be updated when `/update` is run. We only edit the template source.

- [ ] **Step 1: Remove the four procedural subsections from Behavioral Rules**

In `Fabric/template/fabric-backlog.md`, remove the following four subsections entirely (lines 120–155 approximately):
- `### Classification Guidance` (lines 120–129)
- `### Inbox Refinement` (lines 131–137)
- `### Assignment Recommendations` (lines 139–149)
- `### Reclassification and Movement` (lines 151–155)

Leave the `## Behavioral Rules` header and the rules that precede these subsections (lines 113–118) intact. These stay:

```markdown
## Behavioral Rules

- The statuses, types, and scoping definitions above are defaults. Teams can override any of these in the "How We Work" section of their constitution (CLAUDE.md). When custom values are defined there, use those instead of the defaults.
- Backlog entities are structural and protected by meta mode.
- When creating a new feature, check if it should reference an existing product (if Product module enabled).
- Status rollup: when all child entities are complete, suggest updating the parent's status.
- Do not create backlog entities autonomously. Propose the entity and wait for confirmation.
- Children inherit context from their parent through folder nesting. A work item inherits the scope of its parent feature, which inherits from its parent epic.
```

After the last bullet, add a brief pointer:

```markdown

Classification, inbox refinement, assignment recommendations, and reclassification guidance are in the backlog-refinement skill.
```

- [ ] **Step 2: Add Child Summary section to Epic schema**

In the Epic entity section, after `Sections: Description, Related Items, Items this depends on` (line 55), update it to:

```markdown
Sections: Description, Related Items, Items this depends on, Child Summary
```

- [ ] **Step 3: Add Child Summary section to Feature schema**

In the Feature entity section, after `Sections: Description, Acceptance Criteria, Related Items, Items this depends on` (line 70), update it to:

```markdown
Sections: Description, Acceptance Criteria, Related Items, Items this depends on, Child Summary
```

- [ ] **Step 4: Add Commands and Skills tables**

After the `## Relationship to Triage` section (the last section in the file), append:

```markdown

## Commands

| Command | Description |
|---------|-------------|
| /refine | Enter a backlog refinement conversation. Accepts an entity target, inbox item, or request ID. |
| /rollup-backlog | Refresh Child Summary sections on epics and features. |

## Skills

| Skill | Description |
|-------|-------------|
| backlog-refinement | Progressive refinement of backlog items using DEEP principles. Classification, elaboration, splitting, perspective checks, estimation, dependency scanning, assignment, readiness. |
```

- [ ] **Step 5: Verify the changes**

Run the following checks:
- `grep "Classification Guidance" Fabric/template/fabric-backlog.md` — Expected: no output (removed)
- `grep "Inbox Refinement" Fabric/template/fabric-backlog.md` — Expected: no output (removed)
- `grep "Assignment Recommendations" Fabric/template/fabric-backlog.md` — Expected: no output (removed)
- `grep "Reclassification and Movement" Fabric/template/fabric-backlog.md` — Expected: no output (removed)
- `grep "Child Summary" Fabric/template/fabric-backlog.md` — Expected: appears in Epic sections line, Feature sections line, and Commands/Skills area
- `grep "/refine" Fabric/template/fabric-backlog.md` — Expected: appears in Commands table
- `grep "backlog-refinement" Fabric/template/fabric-backlog.md` — Expected: appears in Skills table and pointer line

- [ ] **Step 6: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "refactor: extract procedural guidance from fabric-backlog into skill

Remove Classification Guidance, Inbox Refinement, Assignment
Recommendations, and Reclassification sections (now in
backlog-refinement skill). Add Child Summary to epic/feature
schemas. Add Commands and Skills registration tables."
```

---

### Task 6: Update `fabric-triage.md` — add Backlog Epic field

**Files:**
- Modify: `Fabric/template/fabric-triage.md`

Add the `Backlog Epic` cross-reference field to the triage module doc so that `/refine R-NNN` can follow the link.

- [ ] **Step 1: Add Backlog Epic field to Behavioral Rules**

In `Fabric/template/fabric-triage.md`, after the last behavioral rule bullet (line 55: `- After evaluation, surface the recommendation clearly...`), add:

```markdown

### Request–Backlog Cross-Reference

When a request is promoted to a backlog epic (via the Backlog module's promotion flow), a `Backlog Epic` field may be added to the request entity header:

```
Backlog Epic: E-001
```

This is an optional cross-reference — it does not change the request's triage state or lifecycle. It exists so that `/refine R-NNN` can locate the linked epic without scanning the backlog tree. The field is added to the request during epic creation (proposed and confirmed through the normal flow), not retroactively.
```

- [ ] **Step 2: Verify the change**

Run: `grep "Backlog Epic" Fabric/template/fabric-triage.md`
Expected: Shows the field name in the new section.

- [ ] **Step 3: Commit**

```bash
git add Fabric/template/fabric-triage.md
git commit -m "feat: add Backlog Epic cross-reference field to triage module

Optional field on request entities linking to a promoted
backlog epic. Used by /refine R-NNN to locate the linked epic."
```

---

### Task 7: Update Example instance module docs

**Files:**
- Modify: `Example/.claude/fabric-backlog.md` — apply same changes as Task 5
- Modify: `Example/.claude/fabric-triage.md` — apply same changes as Task 6

The Example instance uses copies of the template module docs (not symlinks). To keep Example testable, apply the same edits. In a real deployment, `/update` would handle this.

- [ ] **Step 1: Apply fabric-backlog.md changes to Example**

Apply the same four changes from Task 5 to `Example/.claude/fabric-backlog.md`:
1. Remove the four procedural subsections (Classification Guidance, Inbox Refinement, Assignment Recommendations, Reclassification and Movement)
2. Add pointer line after Behavioral Rules bullets
3. Update Epic sections line to include Child Summary
4. Update Feature sections line to include Child Summary
5. Add Commands and Skills tables after Relationship to Triage section

- [ ] **Step 2: Apply fabric-triage.md changes to Example**

Apply the same change from Task 6 to `Example/.claude/fabric-triage.md`:
1. Add the Request–Backlog Cross-Reference subsection after the last behavioral rule bullet

- [ ] **Step 3: Verify**

Run:
- `grep "Classification Guidance" Example/.claude/fabric-backlog.md` — Expected: no output
- `grep "/refine" Example/.claude/fabric-backlog.md` — Expected: appears in Commands table
- `grep "Backlog Epic" Example/.claude/fabric-triage.md` — Expected: shows the field

- [ ] **Step 4: Commit**

```bash
git add Example/.claude/fabric-backlog.md Example/.claude/fabric-triage.md
git commit -m "chore: apply backlog refinement changes to Example instance

Mirror template changes: extracted procedural sections,
Child Summary schema additions, command/skill registration,
and Backlog Epic cross-reference."
```
