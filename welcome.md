# Welcome to Team Fabric

Team Fabric is your team's working memory — a git-based system where an AI agent keeps track of requests, backlog, products, and team context so you don't have to. Instead of hunting through emails and documents to remember where things stand, you talk to the agent.

## What Fabric Does

Fabric organizes the things that slow teams down:

- **Request triage** — new asks go through a structured workflow with rubric-based evaluation before the team commits
- **Backlog tracking** — epics break into features, features into work items, work items into tasks; the agent maintains relationships and surfaces blockers
- **Daily standups** — brief async conversations with the agent feed into a team-wide summary
- **Retrospectives** — structured reflection with individual input and synthesized team summary
- **Working memory** — context accumulates on entities over time so you can ask "where does this stand and why" without digging

You interact through slash commands (`/standup-discussion`, `/refine`, `/evaluate-request`, `/transition`) or plain conversation. The agent knows your team, your products, and your workflows.

---

## NotebookLM: Reports and Audio Overviews

The NotebookLM instance is a companion to Fabric for consuming team context in a different format — reports you can read or listen to on your own time.

### For Tech Leads and Managers

- **Weekly team summary** — status of active epics, pending requests, capacity snapshot
- **Request triage briefing** — what's in the queue, what's been evaluated, what needs a decision
- **Escalation digest** — blockers with no follow-up date, actionable open questions, stale entities

### For Engineers

- **Sprint context** — your assigned work items, current iteration scope, open questions on your work
- **Standup prep** — a quick recap of what the team worked on recently before your daily update
- **Backlog overview** — the shape of the work ahead, with blockers and dependencies surfaced

### For Stakeholders

- **Request status** — where your request is in the evaluation workflow and what's next
- **Product update** — current state of the products you care about, in plain language
- **Team capacity briefing** — what the team is focused on and when they can take on new work

### Audio Overviews

NotebookLM can generate audio versions of any of the above for commutes, reviews, or async catch-ups. Ask for an audio overview of the weekly summary, a specific request, or the current sprint state — it reads from the same Fabric data.

---

## Getting Started

1. **For day-to-day work**: open a terminal in your team's Fabric repo and start a conversation with the agent — `/standup-discussion` to log your standup, `/refine` to work your backlog, `/status` for a quick snapshot
2. **For reports and listening**: open the NotebookLM instance and select the report type for your role

Questions about how Fabric is configured for your team? Ask the agent: *"How do I..."* — it knows your setup.
