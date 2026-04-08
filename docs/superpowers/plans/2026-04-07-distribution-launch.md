# TeamFabric Distribution Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the public GitHub repo and execute a phased launch across Claude Code community, broader developer channels, and PM thought leadership channels.

**Architecture:** Four phases — repo preparation (files and content), GitHub configuration (manual), launch content creation (posts and articles), and thought leadership (LinkedIn articles). Phases 0–1 unblock Phases 2–3.

**Tech Stack:** Markdown, Git, GitHub (Issues, Discussions, Releases), Anthropic Discord, Reddit, Hacker News, LinkedIn, dev newsletter submission forms.

**Repo:** `ejwinter/TeamFabric` — already public on GitHub.

---

## File Map

**Created:**
- `LICENSE` — MIT license text
- `CONTRIBUTING.md` — fork and contribution norms
- `ROADMAP.md` — direction statement with multi-agent intent
- `SHOWCASE.md` — adopter showcase, seeded with Example/ entry
- `docs/launch/discord-post.md` — draft post for Anthropic Discord
- `docs/launch/reddit-post.md` — draft post for r/ClaudeAI and r/ChatGPTCoding
- `docs/launch/hn-post.md` — Show HN title and body
- `docs/launch/newsletter-submissions.md` — TLDR, Pointer, Software Lead Weekly drafts
- `docs/launch/linkedin-article-1.md` — "Why team documentation always falls behind"
- `docs/launch/linkedin-article-2.md` — "What working memory means for software teams"

**Modified:**
- `README.md` — add "Who built this", roadmap section, attribution convention, multi-agent intent

---

## Task 1: Add MIT License

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create LICENSE file**

```
MIT License

Copyright (c) 2026 Eric Winter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Write this to `LICENSE` at the repo root.

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "add MIT license"
```

---

## Task 2: Update README — Who Built This

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add "Who Built This" section**

Add this section to `README.md` after the "Design Principles" section and before any closing content:

```markdown
---

## Who Built This

TeamFabric was built by Eric Winter — a project management practitioner with a Master of Science in Project Management and 20 years of experience leading and supporting software delivery teams. The framework was built in parallel with its first real-world deployment, solving a problem the author has felt firsthand across two decades of team work.

The premise: most AI tools for teams are built by engineers guessing at the problem. TeamFabric is built by someone who lived it.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "add who built this section to README"
```

---

## Task 3: Update README — Attribution Convention

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add attribution section**

Add this section to `README.md` after "Who Built This":

```markdown
---

## Attribution

TeamFabric is MIT licensed and free to use. If your team is running on Fabric, a mention in your repo README is appreciated — it helps others find the framework and builds the community.

Suggested badge:

```markdown
<!-- Working memory powered by [TeamFabric](https://github.com/ejwinter/TeamFabric) -->
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "add attribution convention to README"
```

---

## Task 4: Update README — Roadmap and Multi-Agent Intent

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add roadmap section**

Add this section to `README.md` after the "What's Not Built Yet" section (replacing or augmenting it):

```markdown
---

## Roadmap

| Item | Status |
|------|--------|
| Scrum module — sprint planning, velocity tracking, ceremony facilitation | Planned |
| Query commands — `personal-summary`, `team-summary` by time period | Planned |
| Azure DevOps sync — bidirectional backlog synchronization | Planned |
| Multi-agent support — adapters for agents beyond Claude Code | Planned |
| PM-accessible UX — lower the barrier for non-technical team members | Future |

**On multi-agent support:** TeamFabric is built around Claude Code today, but the file-based, agent-agnostic architecture is intentional. The markdown entity model, ingestion workflow, and command patterns are designed to be portable. If you want to build an adapter for another agent (Copilot, Cursor, Gemini CLI, etc.), open an Issue — this is actively wanted.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "add roadmap and multi-agent intent to README"
```

---

## Task 5: Create CONTRIBUTING.md

**Files:**
- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Write CONTRIBUTING.md**

```markdown
# Contributing to TeamFabric

Thanks for your interest in TeamFabric.

## Issues and Discussions

**Bugs and feature requests** — open a GitHub Issue.

**Questions, ideas, and team showcases** — use GitHub Discussions.

## Forks and Adapters

TeamFabric is MIT licensed. You're welcome to fork it, adapt it, and build on it. A few asks:

- Credit TeamFabric in your fork's README (see the Attribution section in the main README)
- If you build an adapter for another AI agent, consider opening an Issue or PR so others can find it
- If your fork introduces significant structural changes, consider whether they'd be worth contributing back upstream

## Pull Requests

PRs are welcome for:
- Bug fixes
- New module implementations (see `Fabric/template/` for the pattern — each module is a `fabric-<name>.md` file following the same structure as existing modules)
- Agent adapters
- Documentation improvements

Before opening a PR for a significant feature, open an Issue to discuss the approach. This avoids wasted effort on directions that don't fit the framework's design.

## Design Principles

Before proposing changes, read `fabric-design-summary.md`. The key constraints:

- **File-based and git-native** — everything lives in markdown files in a git repo
- **Human in the loop** — the AI proposes, the human confirms; no autonomous filing
- **No raw content retention** — structured summaries only, raw content discarded after processing
- **Token-efficient entity structure** — lightweight headers for cheap scanning, full context on demand
- **Nudges, not blockers** — the AI enforces team norms gently; it never blocks work

Changes that undermine these principles are unlikely to be accepted upstream, but make excellent forks.
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "add CONTRIBUTING.md"
```

---

## Task 6: Create ROADMAP.md

**Files:**
- Create: `ROADMAP.md`

- [ ] **Step 1: Write ROADMAP.md**

```markdown
# TeamFabric Roadmap

This is a direction, not a commitment. Items move based on real-world adoption needs and contributor interest.

## Near Term

### Scrum Module
Sprint planning, velocity tracking, and formal ceremony facilitation. Extends the existing Backlog module with sprint-level entities and AI-facilitated standup, planning, and retro ceremonies.

### Query Commands
- `/personal-summary` — "What should I know this morning?" Synthesizes assigned work, recent updates, and follow-ups for the active member.
- `/team-summary` — Configurable by period (day/week/month/quarter). Generates a narrative summary across the team's full history for the specified window.

### Azure DevOps Sync
Bidirectional synchronization between Fabric's backlog hierarchy and Azure DevOps work items. Teams can use Fabric as their working memory layer while keeping their formal ticketing system in sync.

## Medium Term

### Multi-Agent Support
Claude Code is the first supported agent. The framework's file-based, agent-agnostic architecture is intentional — the markdown entity model, ingestion workflow, and command patterns are designed to be portable.

**Wanted: adapter authors.** If you want to build an adapter for Copilot, Cursor, Gemini CLI, or another agent-based tool, open an Issue. This is a stated priority.

### PM-Accessible UX
The current tool requires a technical operator — Claude Code and Git are high bars for non-technical team members. A future phase targets PMs and other team members as direct operators, via a wrapper that abstracts the technical layer.

## Future

- Multi-instance management — framework versioning across deployed instances
- External system integrations beyond Azure DevOps (Jira, Linear, GitHub Issues)
- Web interface for non-technical team members

---

*Last updated: 2026-04-07. To propose an addition, open a GitHub Issue.*
```

- [ ] **Step 2: Commit**

```bash
git add ROADMAP.md
git commit -m "add ROADMAP.md"
```

---

## Task 7: Create SHOWCASE.md

**Files:**
- Create: `SHOWCASE.md`

- [ ] **Step 1: Write SHOWCASE.md**

```markdown
# TeamFabric Showcase

Teams running TeamFabric in the wild. If your team is using Fabric, open a PR to add your entry — or share in [GitHub Discussions](https://github.com/ejwinter/TeamFabric/discussions).

## Live Deployments

*Be the first. Open a PR to add your team.*

| Team | Description | Modules Enabled |
|------|-------------|-----------------|
| — | — | — |

## Example Instance

Not a real team, but a complete demonstration of a deployed Fabric instance:

**Riverdale Data Engineering** — Fictional data engineering team. Located in `Example/`. Two example requests at different evaluation stages (R-101 at L1 complete, R-102 newly submitted), a populated backlog with epics and features, team member profiles, and product definitions.

Open `Example/` in Claude Code and try:
- `/status` — team snapshot
- `/evaluate-request R-102` — run L1 screening on a new request
- `/refine` — start a backlog refinement conversation

---

*To add your team: fork this repo, add a row to the table, and open a pull request. Team name and a brief description is enough — no sensitive information required.*
```

- [ ] **Step 2: Commit**

```bash
git add SHOWCASE.md
git commit -m "add SHOWCASE.md for adopter showcase"
```

---

## Task 8: Enable GitHub Discussions (Manual)

**Files:** None — GitHub UI configuration.

- [ ] **Step 1: Enable GitHub Discussions**

Go to: https://github.com/ejwinter/TeamFabric/settings

Under "Features", check "Discussions". Save.

- [ ] **Step 2: Create a pinned Showcase discussion**

Go to: https://github.com/ejwinter/TeamFabric/discussions/new

- Category: Show and Tell (or create one called "Showcase")
- Title: `Share your TeamFabric instance`
- Body:

```
Using TeamFabric with your team? Share it here.

Tell us:
- What kind of team you are (size, function, tech stack)
- Which modules you're using
- Anything you've customized

No sensitive details needed. We'll pull notable entries into SHOWCASE.md.
```

Pin this discussion.

---

## Task 9: Write Phase 1 Launch Content (Discord + Reddit)

**Files:**
- Create: `docs/launch/discord-post.md`
- Create: `docs/launch/reddit-post.md`

- [ ] **Step 1: Create docs/launch/ directory and write Discord post**

```bash
mkdir -p docs/launch
```

Write to `docs/launch/discord-post.md`:

```markdown
# Anthropic Discord Launch Post

**Target channels:** #projects, #show-and-tell
**Tone:** Personal, conversational. Lead with the problem and the demo.

---

Hey everyone — I built a file-based working memory system for software teams, operated by Claude Code. It's called TeamFabric.

**The problem it solves:** Teams accumulate knowledge in the wrong places. Meeting notes vanish into shared drives. Critical decisions live in email threads nobody can find. Existing tools — wikis, ticketing systems, project management software — stay current only as long as someone maintains them. That discipline erodes. The team knows more than its documentation reflects.

**The insight:** Don't ask people to maintain documentation. Ask them to have a brief conversation. The AI does the organizing.

**How it works:**
- Drop raw content in (meeting notes, emails, decisions) — three ingestion paths, all human-confirmed before filing
- `/status` for a team snapshot, `/describe-team` for narrative synthesis, `/evaluate-request` for rubric-based request screening, `/refine` for backlog refinement
- Six modules: Core, Triage, Backlog, Product, Standup, Retro — enable what fits
- Everything lives in a git repo as structured markdown

**Try it first:** The `Example/` directory is a fully initialized fictional team. Open it in Claude Code and run `/status` — no setup needed.

GitHub: https://github.com/ejwinter/TeamFabric

Happy to answer questions about the design.

*Background: I have an MS in Project Management and 20 years of experience in the field. Built this in parallel with its first real deployment.*
```

- [ ] **Step 2: Write Reddit post**

Write to `docs/launch/reddit-post.md`:

```markdown
# Reddit Launch Post

**Target subreddits:** r/ClaudeAI, r/ChatGPTCoding
**Post type:** Link post to GitHub + text body
**Title:** I built a file-based working memory system for software teams, operated by Claude Code

---

**Body:**

The problem: teams accumulate knowledge in the wrong places. Meeting notes vanish into shared drives. Critical decisions live in email threads nobody can find later. New team members spend weeks piecing together context. Existing tools — wikis, project management software — stay current only as long as someone is disciplined enough to maintain them. That discipline erodes under workload.

**Fabric inverts the model.** Instead of asking people to maintain documentation, it asks them to have a brief conversation. The AI agent does the organizing.

**How it works:**
- Three ingestion paths: quick-file (content + entity hint, one interaction), direct-ingest (AI classifies), staged-batch (drop files, review a digest plan)
- All filing is human-confirmed — AI proposes, you approve
- Six modules: Core, Triage, Backlog, Product, Standup, Retro
- 19 slash commands, 11 skills
- Everything lives in a git repo as structured markdown — queryable, diffable, portable

**Try it before setting up your own:** `Example/` contains a fully initialized fictional team with real requests at different evaluation stages. Open it in Claude Code and run `/status`.

**Get started:** Clone the repo and run `/init MyTeamName` — a wizard walks you through team profile, modules, and constitution setup.

GitHub: https://github.com/ejwinter/TeamFabric

*Background: MS in Project Management, 20 years of experience. Built this in parallel with its first real deployment.*
```

- [ ] **Step 3: Commit**

```bash
git add docs/launch/
git commit -m "add Phase 1 launch content drafts (Discord, Reddit)"
```

---

## Task 10: Write Hacker News Show HN Post

**Files:**
- Create: `docs/launch/hn-post.md`

- [ ] **Step 1: Write HN post**

Write to `docs/launch/hn-post.md`:

```markdown
# Hacker News Show HN Post

**Title:** Show HN: TeamFabric – file-based working memory for software teams, operated by Claude Code

**URL:** https://github.com/ejwinter/TeamFabric

**Text body (optional on Show HN, but worth including):**

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
```

- [ ] **Step 2: Commit**

```bash
git add docs/launch/hn-post.md
git commit -m "add HN Show HN post draft"
```

---

## Task 11: Write Newsletter Submission Drafts

**Files:**
- Create: `docs/launch/newsletter-submissions.md`

- [ ] **Step 1: Write newsletter submissions**

Write to `docs/launch/newsletter-submissions.md`:

```markdown
# Newsletter Submission Drafts

## TLDR Newsletter

**Submission URL:** https://tldr.tech/submit

**Category:** AI / Dev Tools

**Title:** TeamFabric – file-based working memory for software teams, operated by Claude Code

**Description (under 200 words):**
TeamFabric is an open-source framework that turns a git repo into a queryable working memory system for software teams. An AI agent (Claude Code) handles the organizing; humans confirm before anything is filed.

The core insight: don't ask teams to maintain documentation. Ask them to have a brief conversation. The AI classifies, summarizes, and files raw content (meeting notes, emails, decisions) into structured markdown entities — with human approval at every step.

Six modules (Core, Triage, Backlog, Product, Standup, Retro), 19 slash commands, and 11 skills. The constitution (CLAUDE.md) serves two audiences simultaneously: the AI (behavioral rules) and the team (onboarding reference, operating agreements).

The Example/ directory contains a fully initialized fictional team — open it in Claude Code and run /status before committing to setup.

GitHub: https://github.com/ejwinter/TeamFabric

---

## Pointer Newsletter

**Submission URL:** https://www.pointer.io/submissions/

**Title:** TeamFabric – AI-operated working memory for software teams

**Description:**
An open-source framework that turns a git repo into a queryable knowledge base for software teams. Drop in meeting notes, emails, and decisions — the AI organizes it. Everything human-confirmed before filing. Built by someone with 20 years of project management experience.

https://github.com/ejwinter/TeamFabric

---

## Software Lead Weekly

**Submission URL:** http://softwareleadweekly.com/submit

**Title:** TeamFabric – file-based working memory for software teams, operated by AI

**Description:**
Open-source framework for engineering leads who are tired of team knowledge living in the wrong places. A git repo becomes a queryable working memory system: drop in meeting notes and decisions, an AI agent organizes them with human confirmation, slash commands give you team snapshots and narrative synthesis. Six modules, 19 commands. MIT licensed. Built by a PM practitioner with 20 years of experience.

https://github.com/ejwinter/TeamFabric

**Why this is right for SLW:** Targets engineering leads and senior engineers who feel the team knowledge problem directly and have the Claude Code access to adopt it. The PM background angle is a differentiator from typical dev-tool launches.
```

- [ ] **Step 2: Commit**

```bash
git add docs/launch/newsletter-submissions.md
git commit -m "add newsletter submission drafts"
```

---

## Task 12: Draft LinkedIn Article 1 — Why Documentation Falls Behind

**Files:**
- Create: `docs/launch/linkedin-article-1.md`

- [ ] **Step 1: Write article draft**

Write to `docs/launch/linkedin-article-1.md`:

```markdown
# LinkedIn Article 1

**Title:** Why team documentation always falls behind — and what I think changes with AI agents

**Target audience:** PMs, engineering leaders, anyone who has felt this problem
**Tone:** Practitioner voice. No tool pitch. Frame the problem.

---

I've spent 20 years watching teams maintain documentation with the best of intentions and watch it drift out of date within weeks.

The pattern is always the same. A team adopts a wiki. Everyone agrees it's important. For the first few months, people actually use it. Then a deadline hits. Then another one. The wiki updates become the first thing to skip. Within a year, it's an artifact museum — accurate as of whenever someone had a slow week.

This isn't a discipline problem. It's a design problem.

Maintaining documentation competes with doing actual work. Work always wins. No amount of process, tooling, or team commitment changes that fundamental arithmetic. The cost of keeping documentation current is paid continuously, in small amounts, by people who have other things to do.

I've seen this at every scale. Small startup teams who care deeply. Large enterprise teams with dedicated process owners. The degradation rate varies — but the direction is always the same.

**The real cost**

The cost isn't that the wiki is out of date. The cost is what teams have to do to compensate.

New team members spend weeks piecing together context that should have taken days. Senior members carry institutional knowledge in their heads that disappears when they leave. Decisions get relitigated because nobody can find where the last decision was made. Status meetings run long because the status isn't written down anywhere current.

Your team knows more than its documentation reflects. That gap has a real cost.

**What changes with AI agents**

I've been building a framework that tries a different approach, and the insight behind it is simple: don't ask people to maintain documentation. Ask them to have a brief conversation.

When someone finishes a meeting, they paste their notes into a conversation. The AI classifies the content, proposes summaries, and files it against the right entities — with the human confirming before anything is stored. The cost of the interaction is one conversation, not a structured documentation session.

This isn't magic. The AI needs a well-structured system to file things against. But a well-structured system is something you build once and maintain at the framework level — not something every team member has to maintain continuously.

The arithmetic changes: the marginal cost of keeping things current becomes near zero, because the AI absorbs most of the work.

**What this makes possible**

When the maintenance cost drops, the query value goes up. Ask the AI what changed on a project last week. Ask it to synthesize your team's full history on a request. Ask it who said what in Tuesday's meeting. These are questions that aren't worth asking when the answer is "the documentation is probably out of date anyway."

I think this is one of the more underappreciated shifts that AI agents make possible — not the flashy automation, but the structural change to the economics of keeping team knowledge current.

---

*I've been building a framework called TeamFabric that implements this approach. If you want to see what it looks like in practice: github.com/ejwinter/TeamFabric*
```

- [ ] **Step 2: Commit**

```bash
git add docs/launch/linkedin-article-1.md
git commit -m "add LinkedIn article 1 draft"
```

---

## Task 13: Draft LinkedIn Article 2 — What Working Memory Means for Teams

**Files:**
- Create: `docs/launch/linkedin-article-2.md`

- [ ] **Step 1: Write article draft**

Write to `docs/launch/linkedin-article-2.md`:

```markdown
# LinkedIn Article 2

**Title:** What working memory means for software teams — and why it matters more as teams grow

**Target audience:** PMs, engineering managers, team leads
**Tone:** Practitioner voice. Conceptual, not promotional.

---

In cognitive psychology, working memory is the system that holds and manipulates information you're actively using — as opposed to long-term memory, which stores things for later recall.

Most teams don't have working memory. They have archives.

**The archive problem**

When teams document things, they tend to document finished work — decisions after they've been made, features after they've shipped, retrospectives after the sprint closes. This is long-term memory: useful for looking back, but not for operating in the present.

Working memory is different. It's the current state of things: what's in flight, what's blocked, what changed last week, who said what in Tuesday's meeting. It's the context you need to pick up work without a briefing, answer a question without a meeting, and make a decision without relitigating the last one.

The gap between "what the team knows" and "what's written down anywhere current" is the working memory deficit. Every team has one. Larger teams have larger ones.

**Why it compounds as teams grow**

On a three-person team, the working memory lives in people's heads and gets shared naturally — you're in the same room, working on the same things, and context transfers through proximity.

Scale to ten people, and the informal transfer breaks down. You're not in the same room. You're not working on the same things. Someone's context about why a decision was made three months ago doesn't naturally make it to the person who needs it today.

Knowledge becomes siloed. Not because anyone is hoarding it — because the cost of sharing it continuously exceeds what people can reasonably do on top of their actual work.

**What a working memory system looks like**

A working memory system for a team has a few properties:

It captures the current state of things, not just the historical record. Entities (projects, requests, decisions, people) have live status fields that reflect what's true now — not what was true at the last formal update.

It's structured, so it can be queried. "What's blocked?" has a different answer than "what changed last week?" A system that can answer both correctly is structured enough for an AI to reason across.

It's maintained at near-zero cost. If the cost of keeping it current is meaningful, it won't stay current. This is the part most systems get wrong.

The AI piece is what makes the last property achievable. When the AI handles classification, summarization, and filing — with human confirmation before anything is stored — the cost of an update becomes a brief conversation rather than a documentation session.

**The PM perspective**

I've managed projects for 20 years. The working memory problem isn't new — we've had versions of it since long before AI. Standups exist partly to refresh distributed working memory. Status reports exist because the working memory isn't written down anywhere. Onboarding takes so long because the new team member has to build working memory from scratch.

What's new is that the economics of maintaining a structured working memory system have changed. The AI absorbs the work that previously exceeded what teams could sustain.

That's the shift I think is underappreciated.

---

*I've been building a framework called TeamFabric that implements this approach for software teams. github.com/ejwinter/TeamFabric*
```

- [ ] **Step 2: Commit**

```bash
git add docs/launch/linkedin-article-2.md
git commit -m "add LinkedIn article 2 draft"
```

---

## Task 14: Push and Verify

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push origin develop
```

- [ ] **Step 2: Verify on GitHub**

Open https://github.com/ejwinter/TeamFabric and confirm:
- LICENSE appears in the repo root
- README shows "Who Built This", roadmap, attribution sections
- CONTRIBUTING.md and ROADMAP.md and SHOWCASE.md appear in root
- GitHub Discussions tab is visible
- The pinned Showcase discussion appears

- [ ] **Step 3: Merge to main when ready**

The launch content lives on `develop`. Merge to `main` when you're ready to treat the public repo as the launch-ready state.

```bash
git checkout main
git merge develop
git push origin main
```

---

## Launch Execution Checklist (Post-Plan)

These are actions to take after the plan is implemented. Not file tasks — human-action tasks.

- [ ] Post `docs/launch/discord-post.md` content to Anthropic Discord #show-and-tell
- [ ] Post `docs/launch/reddit-post.md` content to r/ClaudeAI
- [ ] Post `docs/launch/reddit-post.md` content to r/ChatGPTCoding
- [ ] Submit `docs/launch/hn-post.md` as a Show HN on Hacker News
- [ ] Submit to TLDR newsletter (https://tldr.tech/submit)
- [ ] Submit to Pointer newsletter (https://www.pointer.io/submissions/)
- [ ] Submit to Software Lead Weekly (http://softwareleadweekly.com/submit)
- [ ] Publish LinkedIn Article 1 from `docs/launch/linkedin-article-1.md`
- [ ] Publish LinkedIn Article 2 from `docs/launch/linkedin-article-2.md`
- [ ] Set a monthly reminder to post a changelog entry (GitHub Releases + brief community note)
