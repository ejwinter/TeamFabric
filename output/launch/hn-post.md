# Hacker News Show HN Post

**Title:** Show HN: TeamFabric – file-based working memory for software teams, operated by Claude Code

**URL:** https://github.com/ejwinter/TeamFabric

**Text body:**

---

I built a framework that turns a git repo into a queryable working memory system for software teams. An AI agent (Claude Code) handles the organizing; humans confirm before anything is filed.

The problem I kept running into: teams accumulate knowledge in the wrong places. Meeting notes vanish into shared drives. Critical decisions live in email threads nobody can find. Existing tools — wikis, ticketing systems, project management software — stay current only as long as someone is disciplined enough to maintain them. That discipline erodes under workload. The team ends up knowing more than its documentation reflects.

The insight: don't ask people to maintain documentation. Ask them to have a brief conversation. The AI does the organizing.

**How it works:**

Three ingestion paths, all human-confirmed before anything is filed:
- Quick-file: content + entity hint, one interaction
- Direct-ingest: AI scans existing entities, proposes classification
- Staged-batch: drop files into staging/, trigger a digest, review and edit a structured plan before execution

Slash commands for getting answers out: `/status` (team snapshot), `/describe-team` (narrative synthesis across full history), `/evaluate-request` (rubric-based evaluation on a request), `/refine` (backlog refinement conversation), `/report` (generates self-contained HTML — mindmap, Gantt, effort breakdown).

Six modules: Core, Triage, Backlog, Product, Standup, Retro. Enable only what fits.

The constitution (CLAUDE.md) serves two audiences simultaneously: the AI agent (behavioral rules, nudge triggers, workflow definitions) and the team (onboarding reference, operating agreements, decision log).

**Try it before setting up your own:**

The `Example/` directory contains a fully initialized fictional team (Riverdale Data Engineering) with example requests at different evaluation stages. Open it in Claude Code and run `/status` — no setup needed.

**Background:** I have an MS in Project Management and 20 years of experience in the field. I've been on the receiving end of this problem for a long time. Built this in parallel with its first real deployment.

Happy to answer questions about the entity model, ingestion workflow, or constitution design.
