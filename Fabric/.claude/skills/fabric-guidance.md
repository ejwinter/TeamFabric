# Skill: Fabric Guidance

## Purpose
Help users understand, navigate, and maintain their Fabric installation. This is the "how do I..." skill for the system itself.

## When Used
- User asks about Fabric structure, conventions, or capabilities
- User seems confused about where something lives or how to do something
- User asks "what can you do?" or "how does this work?"
- New team member is getting oriented

## Knowledge This Skill Draws On

### Directory Structure
```
CLAUDE.md                          # Constitution: AI behavioral rules, @imports, team config
team/
  team.md                          # Team facts: identity, members, products, repos, comms, state
  members/<name>/profile.md        # Individual member profiles
requests/
  REQUESTS.md                      # Request module: lifecycle, triage, checkpoints
  <request-id>/                    # Individual request entities
  workflow/default/                # Default workflow rubrics and criteria
staging/
  README.md                        # Marker (only committed file, rest is .gitignored)
products/<product>/                # Product definitions
backlog/
  epics/<epic-id>/
    epic.md
    features/<feature-id>/
      feature.md
      workitems/<workitem-id>/
        workitem.md
        tasks/<task-id>.md
  inbox/                           # Drop zone for unclassified work ideas
  templates/                       # Team-defined backlog item templates (optional)
.claude/
  commands/                        # Command definitions
  skills/                          # Skill definitions
  fabric-*.md                      # Framework behavioral rules (one per module)
```

### Key Concepts to Explain
- **Fabric is a working memory system**, not an archive. It tracks current state with enough context to understand how you got there.
- **No raw content retention.** Fabric stores structured summaries. Originals live in external systems.
- **Human in the loop.** The AI proposes, you confirm. Nothing gets written without your approval.
- **Meta mode** is required to edit structural files (CLAUDE.md, team data, profiles, module docs). Normal operations treat these as read-only.
- **Context logs** are append-only breadcrumb trails on entities. They capture who said what, when, and why.
- **Staleness flags** mark entities whose summaries may be outdated. The AI will point these out and offer to reconcile.
- **Team templates** let teams define reusable backlog item patterns — pre-filled DoD criteria, standard acceptance criteria, optional child stubs. Stored in `backlog/templates/`.
- **Fabric GC** (`/clean-fabric`) scans for terminal-state and stale artifacts and removes or archives them after review. Retention periods are configurable per artifact type in CLAUDE.md.

### Common Questions

**"Where does X go?"**
- Content about a specific request/engagement → that request's entity
- Content about the team's process → team/team.md context log
- Content about a person → their member profile context log
- Content about a product → products/<product>/ context
- Content that doesn't fit → staging/ for later classification
- A new work idea not yet classified → backlog/inbox/ (use `/refine inbox/<item>` to classify it)

**"How do I add/change something?"**
- Adding content to entities → just provide it, the ingestion skill handles it
- Changing team structure → enter /meta mode, then use the appropriate command
- Changing how the AI behaves → enter /meta mode, edit the relevant section of CLAUDE.md

**"How do I create a backlog item?"**
- Use `/refine` — it handles both new ideas and existing entities. It classifies, elaborates, estimates, and writes the entity after your confirmation.
- For a new idea with no parent yet, just describe it: `/refine` will propose the right level (epic/feature/work item) and placement.
- To create from a team template, name it: "create a data pipeline epic" or "use the reporting-dashboard template" — the agent will apply it and propose before writing.

**"What are team templates and how do I use them?"**
- Team templates live in `backlog/templates/` as `<level>-<name>.md` files (e.g., `epic-data-pipeline.md`).
- Each template has a comment block at the top (`Template:`, `Applies To:`, `Suggest When:`, optional `Labels:`) followed by pre-filled entity content.
- The agent scans templates automatically when you create a backlog item and offers a match if one fits the context.
- You can also request one explicitly: "create an epic using the data-pipeline template."
- Templates can include a `## Child Stubs` section to auto-draft child features or work items alongside the parent. Stubs can reference other templates by name.
- If `backlog/templates/` doesn't exist yet, there are no templates — the agent proceeds with the base framework template silently.

**"How do I promote an accepted request to a backlog item?"**
- Promotion is conversational — no special command needed. Tell the agent: "promote R-101 to an epic" or "create a feature from R-101."
- The agent carries forward the description, External URL, Repository, and Labels from the request, links them back to each other, and proposes before writing anything.
- Whether a request promotes to an Epic or Feature is configured in the workflow's `evaluation.md` via the `Promotion Target` field.

**"How do I clean up old closed items?"**
- Run `/clean-fabric`. It scans for terminal-state artifacts past their retention period and proposes removals for your review.
- Default retention: 90 days after `Terminated:` for most artifacts; 1 year for epics and requests.
- Teams can override retention per artifact type by adding a `## Fabric GC` table to CLAUDE.md or team.md.

**"What commands are available?"**
- Point the user to the Core Commands table in the loaded CLAUDE.md (via `@.claude/fabric-core.md`).
- Each module adds its own commands — Backlog adds `/refine` and `/rollup-backlog`; Triage adds `/evaluate-request`; Standup adds `/standup-discussion`; Retrospective adds the `/retro` family.

## Behavioral Notes
- Be welcoming and patient. People learning a new system ask basic questions.
- Point to specific files and paths, not abstract concepts.
- If a question reveals a gap in the constitution or documentation, note it as an observation: "That's a good question that isn't covered yet. You might want to add guidance for that in /meta mode."
