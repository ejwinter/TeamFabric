# Welcome to Fabric

Fabric is your team's working memory — a git-based system where an AI agent keeps track of requests, backlog, products, and team context so you don't have to. Instead of hunting through emails and documents to remember where things stand, you talk to the agent.

---

## What Fabric Does

Fabric organizes the things that slow teams down:

- **Request triage** — new asks go through a structured workflow with rubric-based evaluation before the team commits. Each request tracks its What's Next checklist, evaluation status, and promotion to the backlog when accepted.
- **Backlog tracking** — epics break into features, features into work items, work items into tasks. The agent maintains relationships, surfaces blockers, enforces Definition of Done, and tracks effort across the hierarchy.
- **Team templates** — your team can define reusable templates for epics, features, and work items you create repeatedly. The agent suggests them when context matches or applies them on request.
- **Daily standups** — brief async conversations with the agent feed into a team-wide summary.
- **Retrospectives** — structured reflection with individual input and synthesized team summary with themed action items.
- **Working memory** — context accumulates on entities over time so you can ask "where does this stand and why" without digging.

You interact through slash commands (`/standup-discussion`, `/refine`, `/evaluate-request`, `/transition`) or plain conversation. The agent knows your team, your products, and your workflows.

---

## Your First Five Minutes

**See the current state of the team:**
```
/status
```

**Pick up where the standup left off — log your update:**
```
/standup-discussion
```

**Work your backlog:**
```
/refine
```
Give it a new idea or an existing epic to refine. It will classify, elaborate, and propose before writing anything.

**Ask anything in plain language.** The agent knows your team's context — ask about a specific request, what's blocking a feature, who owns what, or what the team worked on last week.

---

## NotebookLM: Deeper Reading and Audio Overviews

A companion NotebookLM project provides a different way to consume team context — documents you can read or listen to on your own time. Content there is continuously updated and may drift from the current state of the codebase; treat it as a supplement, not a reference.

[notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9](https://notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9)

### For Tech Leads and Managers

- **TeamFabric AI Agent Working Memory System** — deep dive on what Fabric is, how it works, and the architectural decisions behind it
- **TeamFabric: The AI Agent Architecture and Governance Framework** — governance model, meta mode, human-in-the-loop design, and how the constitution works
- **Operational Implementation Plan** — a structured guide for transitioning a team to AI-driven working memory

### For Engineers

- **Brief Overview of TeamFabric** — quick orientation before your first session
- **The AI Collaboration Handbook: Mastering the TeamFabric Ingestion Workflow** — how to get content into Fabric efficiently across all three ingestion paths

### Audio Overviews

NotebookLM can generate audio versions of any of the above for commutes, reviews, or async catch-ups. Select a document and choose "Audio Overview" to get a conversational summary you can listen to anywhere.

---

## Where Things Live

| What | Where |
|------|-------|
| Team definition and members | `team/` |
| Request intake and evaluation | `requests/` |
| Backlog (epics, features, work items, tasks) | `backlog/` |
| Team-defined item templates | `backlog/templates/` |
| Product definitions | `products/` |
| Raw content for ingestion | `staging/` (local only, gitignored) |
| Framework behavioral rules | `.claude/fabric-*.md` |

---

## Getting Help

Ask the agent directly — it knows how Fabric is configured for your team:

> "How do I add a new request?"
> "What templates do we have for epics?"
> "Where does standup output go?"
> "How do I close a work item?"

For framework questions, the [TeamFabric README](https://github.com/ejwinter/TeamFabric) is the authoritative reference.
