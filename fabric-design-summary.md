# Team Fabric - Design Summary

## What Fabric Is

Fabric is a file-based team collaboration framework designed to live in a git repository and be operated on
by an AI agent (initially Claude Code). Its core value proposition is **lowering the friction of keeping team
knowledge current and actionable**. People dump raw content in, AI organizes it. People ask questions, AI
synthesizes across structured data.

Fabric is a **working memory system**, not an archive or content management system. It tracks the current
state of things and enough context to understand how you got there. Original artifacts (emails, documents,
recordings) live in external systems (SharePoint, email, shared drives). Fabric retains lean breadcrumbs
with enough "why" to answer follow-up questions without needing the source.

## Core Design Principles

- **No raw content retention.** Fabric stores structured summaries, not original content. Raw content is
  discarded after processing unless explicitly told otherwise.
- **Human in the loop.** The AI proposes, the human confirms. Summaries are reviewed before filing.
  First-class fields are curated by humans with AI assistance, not written autonomously.
- **Sensible defaults, team-refined.** Every aspect of Fabric ships with reasonable starting configuration
  that teams are encouraged to customize.
- **Constitution as living document.** The team constitution (AGENT.md) serves two audiences: the AI
  (behavioral rules) and humans (onboarding/reference). It should be good enough for both.
- **Token-efficient by design.** Entity files are structured so lightweight headers/summaries can be
  scanned cheaply, with full context available on demand.

## Entity Model

### Hierarchy

- **Team** - the top-level container, defined by the constitution
- **Member** - team members with roles, responsibilities, and personal context
- **Product** - broad deliverables the team owns
- **Request** - something someone has asked the team to work on, evaluated via workflows and rubrics
- **Epic** - high-level initiative, may originate from an accepted request
- **Feature** - breakdown of an epic into business-facing capabilities
- **Work Item** - breakdown of a feature into assignable implementation work
- **Task** - finest-grained breakdown (name, status, assigned to, hours remaining, initial hours)
- **Document/Rubric** - supporting evidence and evaluation criteria attached to other entities

### Entity File Structure

Each entity uses a layered information architecture:

1. **Lightweight header/summary** - cheap to load, enough for AI to identify relevance quickly
2. **First-class structured fields** - curated artifacts (description, acceptance criteria, status, owner)
   that are maintained through human-guided refinement, not just free text
3. **Context log** - append-only breadcrumb trail of sourced summaries from ingested content

Example structure:
```markdown
# WI-1234: Implement OAuth Flow
Status: In Progress
Owner: Sarah
Product: Portal
Summary: [2-3 sentence current state, last updated date]

## Properties
Description: ...
Acceptance Criteria: ...

## Context Log
- 2026-03-21 15:00 - Bill (bill@email.com) via email: Deadline moved to
  April 30, vendor cited staffing delays on integration team.
  Source: [SharePoint/Project-X/vendor-correspondence]
- 2026-03-18 - Sprint planning: Team agreed to split this into two work items.
  See also WI-1240.
```

### Staleness Detection

When new content is ingested against an entity, its summary (and potentially ancestor summaries) may become
outdated. Preferred approach: **dirty flag / roll-up on read**. Don't proactively rewrite summaries. Instead,
flag entities as potentially stale when new context arrives. When someone queries that entity, the AI notes
the staleness and offers to reconcile. Avoids unsupervised changes to curated content.

## Modules

### Core (always enabled)
Team definition, members, constitution, basic ingestion and query capabilities.

### Product
Product definitions and context. Teams usually but not always produce products.

### Backlog
Epic > Feature > Work Item > Task hierarchy. Skills for managing and potentially syncing with
external tools (Azure DevOps).

### Triage
Request intake, workflows, and rubric-based evaluation. Requests may evolve into epics.

### Scrum (deferred)
Daily communication facilitation. Lower priority than other modules for initial teams.

## Ingestion Workflow

### Three Paths

**Quick file:** User provides content plus an entity hint (e.g., "this is for WI-1234"). AI summarizes
against that entity's context, user confirms, done. Single interaction. This is the encouraged default.

**Direct ingest:** User provides content with no hint. AI classifies by scanning existing entity headers,
proposes classification and summary, user confirms or redirects. Slightly longer dialog.

**Staged batch:** User drops one or more pieces of content into a staging directory over time, then
triggers a digest. AI produces a structured plan, user reviews/edits, then executes. Best for complex
multi-entity content like meeting notes.

### The Staging Directory

- Lives in the repo directory structure
- All contents except a marker file (README.md) are in .gitignore
- Content is inherently per-workstation (effectively per-member)
- Explicitly temporary: cleared after content is digested and filed
- Serves as the "dump and run" solution: drop content, process later
- The digest output is a structured plan document listing proposed actions

### Digest Plan Format

The AI produces a structured plan showing every proposed action:

```markdown
## Staging Digest - 2026-03-28

### Request R-42: Vendor API Timeline
**Action:** Append to context log
**Summary:** [proposed summary]

### WI-1234: OAuth Implementation
**Action:** Update field (Target Date: April 15 -> April 30), Append to context log
**Summary:** [proposed summary]

### NEW: Possible request - Data migration concerns
**Action:** Create new request
**Summary:** [proposed summary]
```

### Action Types in Plans

- **Append** - new context, no field changes
- **Update** - proposes changing a first-class field, shows old and new values
- **Conflict** - surfaces a contradiction, requires human resolution
- **Stale flag** - marks something for refinement
- **Duplicate** - notes redundancy with existing context, recommends skipping
- **New entity** - proposes creating something that doesn't exist yet

### Duplicate Detection

When incoming content overlaps with existing context log entries, the AI should surface it:
"Kathy noted a similar point on March 15. Is this confirming that, updating it, or a separate concern?"

### Context Log Entry Format

Lean breadcrumbs with enough "why" to answer follow-up questions:
```
- 2026-03-21 15:00 - Bill (bill@email.com) via email: Deadline moved to
  April 30, vendor cited staffing delays on integration team.
  Source: [SharePoint/Project-X/vendor-correspondence] or
  [Email, subject: "RE: API Timeline Update"]
```

Entries include: timestamp, who, channel (email/meeting/slack), summarized content with reasoning,
optional source reference for finding the original artifact.

### Catch-All Filing

Content that doesn't map to a specific entity can be filed at directory levels:
- Team-level context (process discussions, general announcements)
- Member-level context (individual growth, personal notes)
- Product-level context (competitive analysis, market info not tied to specific work)

## Constitution (AGENT.md)

### Purpose
Serves two audiences simultaneously:
- **AI agent:** Behavioral rules, nudge triggers, workflow definitions
- **Humans:** Onboarding document, team reference, operating agreements

### Proposed Sections (with sensible defaults)

1. **Team Identity** - who we are, what we do, what products we own
2. **Members** - reference to members directory, key roles noted
3. **How We Work** - request intake process, prioritization approach, workflow definitions
4. **Knowledge Repositories** - where things live (SharePoint locations, shared drives, wikis, repos).
   Drives AI nudge behavior: "Per team norms, this should also go in SharePoint."
5. **Communication Norms** - who gets notified about what, preferred channels, cadence
6. **Enabled Modules** - which Fabric modules are active for this team
7. **Decision Log** - lightweight running record of significant team-level decisions

### Constitution as Behavioral Contract

The AI reads the constitution during operations and uses it to generate contextual nudges:
- "Based on team norms, you may also want to notify the product owner about this deadline change."
- "Per the team constitution, vendor correspondence should be archived in SharePoint. Have you done that?"

Nudges, not blockers. The AI is a gentle enforcer of team norms.

## Directory Structure

```
AGENT.md                          # Team constitution
.agent/ or .claude/
  skills/                         # AI skills for Fabric operations
  commands/                       # Slash commands (ingest, summary, etc.)
  rules/                          # Rules broken out from constitution
team/
  members/
    <n>/
      profile.md              # Role, responsibilities, contact, etc.
                              # Future: standups, personal notes, capacity
staging/
  README.md                       # Marker file (only committed file)
  [raw content files]             # .gitignored, temporary
requests/
  <request-id>/                   # Per-request folder with supporting docs
  archive/                        # Completed/rejected requests
  workflows/
    <workflow>/                   # Workflow definitions
backlog/
  epics/<id>/
    features/<id>/
      work-items/<id>/
        tasks/<id>.md
products/<product>/               # Per-product definitions and context
```

## Open Threads for Future Chats

### Query and Summary Commands
- personal-summary: "What should I know this morning?"
- team-summary: customizable by period (day/week/month/quarter)
- How these pull from the layered entity structure
- Staleness handling in summaries

### Refinement Workflow
- The "check for new context before picking up work" pattern
- How the AI guides humans through updating first-class fields
- When and how the AI advises loading full entity context

### Cross-Cutting Content
- Whether meetings/emails get a canonical home beyond decomposed breadcrumbs
- How to handle "what did we decide in Tuesday's meeting?" queries

### Implementation
- Claude Code skills and slash commands
- Initialization workflow ("tell me about your team")
- Constitution template with defaults
- Entity templates for each type

### External Tool Integration
- Azure DevOps sync for backlog items
- SharePoint/shared drive references
- Source hints in context log entries

### Constitution Refinement
- Detailed section content and defaults
- How the AI uses each section behaviorally
- The feedback loop: new member questions reveal constitution gaps
- Decision log maintenance during ingestion
