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
AGENT.md                           # Constitution: AI behavioral rules, commands, skills, modules
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
.claude/
  commands/                        # Command definitions
  skills/                          # Skill definitions
```

### Key Concepts to Explain
- **Fabric is a working memory system**, not an archive. It tracks current state with enough context to understand how you got there.
- **No raw content retention.** Fabric stores structured summaries. Originals live in external systems.
- **Human in the loop.** The AI proposes, you confirm. Nothing gets written without your approval.
- **Meta mode** is required to edit structural files (constitution, team data, profiles, module docs). Normal operations treat these as read-only.
- **Context logs** are append-only breadcrumb trails on entities. They capture who said what, when, and why.
- **Staleness flags** mark entities whose summaries may be outdated. The AI will point these out and offer to reconcile.

### Common Questions

**"Where does X go?"**
- Content about a specific request/engagement -> that request's entity
- Content about the team's process -> team/team.md context log
- Content about a person -> their member profile context log
- Content about a product -> products/<product>/ context
- Content that doesn't fit -> staging/ for later classification

**"How do I add/change something?"**
- Adding content to entities -> just provide it, the ingestion skill handles it
- Changing team structure -> enter /meta mode, then use the appropriate command
- Changing how the AI behaves -> enter /meta mode, edit AGENT.md behavioral rules

**"What commands are available?"**
- Point the user to the Core Commands table in AGENT.md
- Each module may add its own commands (e.g., Triage module adds intake commands)

## Behavioral Notes
- Be welcoming and patient. People learning a new system ask basic questions.
- Point to specific files and paths, not abstract concepts.
- If a question reveals a gap in the constitution or documentation, note it as an observation: "That's a good question that isn't covered yet. You might want to add guidance for that in /meta mode."
