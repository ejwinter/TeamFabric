# TeamFabric

## Your team's working memory. Operated by AI.

A file-based framework that lives in a git repository. Drop in raw content — meeting notes, emails, decisions — and an AI agent organizes it into structured, queryable knowledge your whole team can act on.

> **Go deeper:** A NotebookLM project with audio overviews, deep dives, and generated implementation guides is maintained at [notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9](https://notebooklm.google.com/notebook/7288a5b1-773a-4dfa-86b5-3e8296cf4cd9). Content there is continuously updated and may drift from the current codebase.

---

## The Problem

- **Your team knows more than its documentation reflects.** Meeting notes vanish into shared drives. Critical decisions live in email threads nobody can find later. When someone leaves, their context leaves with them.

- **You already have wikis, ticketing systems, and project management tools.** None of them stay current under real workload. Keeping them honest requires discipline — and discipline erodes.

- **Your AI assistant is only as smart as what it can see.** Ask it about your team's work and it draws a blank. Most teams have no structured way to give AI the context it needs to be genuinely useful.

---

## The Insight

The problem isn't that teams don't care about documentation. It's that maintaining it competes with doing actual work — and work always wins.

Fabric inverts the model. Instead of asking people to maintain documentation, it asks them to have a brief conversation. The AI does the organizing. The result is a working memory system that stays current because the maintenance cost is near zero.

---

## What's Inside

**Modules** — Enable only what fits your team. Start with Core (team identity, members, ingestion, basic queries). Add Triage for structured request intake with customizable rubric-based evaluation. Add Backlog for epic-to-task tracking with Definition of Done enforcement and team-defined item templates. Add Product for ownership context. Add Standup for async daily standups with team-wide summaries. Add Retro for structured retrospectives with themed synthesis and action item routing.

**Commands** — Slash commands your AI runs on demand: `/ingest` to file new content, `/status` for a team snapshot, `/evaluate-request` to run a structured rubric, `/describe-team` for a narrative synthesis, `/refine` to break down backlog work collaboratively, `/standup-discussion` for async daily standups, `/retro` for structured retrospectives, `/transition` to guard entity state changes with Definition of Done checks, `/open-questions` to surface unresolved blockers, and `/clean-fabric` to retire stale artifacts automatically.

**Reports** — Your Fabric data is structured markdown — which means it's queryable. `/report` generates self-contained HTML files from your working memory: an interactive mindmap of your backlog, a Gantt timeline, or an effort breakdown by any label dimension your team defines. The data you're already maintaining becomes management-ready output on demand. No BI platform, no export, no pipeline.

**Skills** — Implicit AI behaviors running behind the scenes: three-path ingestion with deduplication, staleness detection on curated content, rubric-based request evaluation, identity resolution (the AI knows who it's talking to), and self-help for Fabric itself.

**The Constitution** — A living document that serves two audiences simultaneously: the AI (behavioral rules, nudge triggers, workflow definitions) and your team (onboarding reference, operating agreements, decision log). One document, always current.

---

## How It Works

**1. Drop content in.**
Paste a meeting summary, forward an email thread, or drop files into a staging directory. The AI classifies the content against your team's existing knowledge and proposes a summary.

**2. You confirm.**
The AI proposes; you approve. First-class fields — status, owner, decisions — are always human-confirmed before anything is filed. The AI is a collaborator, not an autonomous actor.

**3. Ask anything.**
`/status` for a quick team snapshot. `/describe-team` for a narrative synthesis across your full history. `/evaluate-request` to run a structured rubric on something your team has been asked to do. The AI draws from everything your team has filed.

---

## Works For Teams Like Yours

Fabric ships with sensible defaults and gets out of the way. Define your own request workflows and evaluation rubrics. Set your own Definition of Done criteria. Create item templates for the types of epics and features your team creates repeatedly. Customize the constitution to reflect how your team actually operates — who gets notified about what, where things live, what your decision-making process looks like.

Fabric adapts to how your team works, not the other way around.

Already running at a real team. Proven against messy, real-world content.

---

## Get Started

**Prerequisites:** [Claude Code](https://claude.ai/code) (CLI or IDE extension) + Git

1. Clone this repository
2. Run `/init MyTeamName` from the TeamFabric repo — a guided wizard walks you through your team profile, constitution, and first member setup

**Not ready to commit?** The `Example/` directory contains a fully initialized fictional team (Riverdale Data Engineering) with real requests at different stages of evaluation. Open it in Claude Code and run `/status` to see Fabric in action before setting up your own instance.

---

*TeamFabric is open and free to use. Built in parallel with its first real deployment.*
