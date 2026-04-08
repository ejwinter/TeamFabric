# TeamFabric Distribution Strategy

**Date:** 2026-04-07
**Author:** Eric Winter

---

## Context

TeamFabric is a file-based working memory system for software teams, operated by an AI agent (currently Claude Code). It is fully built — 19 commands, 11 skills, 6 modules, an Example instance with fictional team data, and at least one real-world deployment. The goal of this strategy is to get it into the hands of teams worldwide, with active stewardship from the author.

**Author background:** Master of Science in Project Management, 20 years of experience in the field. Built this tool as a practitioner who understands the problem firsthand.

---

## Positioning and Audience

### Primary Audience (now)
Technical operators — senior engineers, tech leads, engineering managers who use Claude Code and are responsible for their team's working memory problem. They feel the pain directly and can adopt without permission from above.

### Secondary Audience (now, via thought leadership)
PMs and engineering leaders who control adoption decisions. Reached by framing the *problem*, not the *tool*. The author's MS in Project Management and 20 years of experience is the credibility that earns this audience's attention.

### Tertiary Audience (later)
PMs as direct operators, as UX matures and the tool becomes accessible without a technical delegate. Currently, a technical delegate is required — Claude Code and Git are high bars for low-tech adopters.

### Differentiation
Built by a practitioner with an MS in Project Management and 20 years of experience *and* the technical depth to implement it. Most AI tools in this space are built by engineers guessing at the problem. TeamFabric is not.

### Story by Audience
- **To technical operators:** "Stop managing your team's context manually. One conversation with your AI agent, and it's filed, structured, and queryable. Here's how to set it up."
- **To PMs and leaders:** "Your team knows more than its documentation reflects. Here's why that happens and what a working memory system looks like."

---

## Home Base: GitHub

The public GitHub repo is the anchor for everything. All promotion points here.

### What must be in place at launch

**License:** MIT with an attribution expectation stated clearly in README. Legally MIT does not require attribution, but an explicit "please credit TeamFabric" norm stated in README is generally respected in communities where reputation matters. (Alternative: CC-BY-SA enforces attribution legally but is unusual for software — not recommended.)

**README additions:**
- "Who built this" section — author background, 20 years PM, MS in Project Management
- Roadmap section — multi-agent support, Scrum module, PM-accessible UX as future phases
- "Built with TeamFabric" badge convention for adopters

**GitHub Discussions:** Enable as the community space. Issues for bugs and features, Discussions for questions and showcase.

**CONTRIBUTING.md:** Brief guide for fork authors and contributors. Establishes community norms early.

**Multi-agent intent statement:** A section in README or a `ROADMAP.md` stating that the framework is designed around Claude Code today but the architecture is intentionally agent-agnostic. Invites adapter authors. Signals longevity to skeptics concerned about Claude Code lock-in.

### What is not needed at launch
Separate website, logo, or domain. Get the repo right first.

---

## Launch Channels

### Phase 1 — Claude Code community (launch week)

The highest-signal audience first. These people already have Claude Code, already feel the pain, and are actively looking for things to do with it.

- **Anthropic Discord** — `#projects` or `#show-and-tell` channels. Personal, conversational post. Lead with the problem and the Example/ demo, not the feature list.
- **r/ClaudeAI and r/ChatGPTCoding** — Show HN-style post. "I built a file-based working memory system for teams, operated by Claude Code." Link to Example/ as the fastest onramp.
- **Claude Code GitHub** — Watch discussions where people ask "what can I do with this?" Drop a contextual reference, not a cold promo.

### Phase 2 — Broader developer community (weeks 2–4)

- **Hacker News Show HN** — The biggest single shot. Write carefully. Lead with the problem (team knowledge erodes under workload), explain the insight (invert the model — AI does the organizing), show the Example/ demo. HN rewards genuine practitioners who built something real. The author's background is an asset.
- **Dev newsletters** — TLDR, Pointer, Software Lead Weekly. Most accept community submissions. Software Lead Weekly is particularly well-matched — targets engineering leads who are exactly the primary audience.

### Phase 3 — PM and leadership audience (ongoing, thought leadership)

Not tool promotion — problem framing. LinkedIn articles and posts under the author's name:
- *"Why team documentation always falls behind — and what I think changes with AI agents"*
- *"What working memory means for software teams, and why it matters more as teams grow"*

These establish the author as a credible voice in the problem space. People who resonate with the problem find the tool.

---

## Active Stewardship Model

### Community cadence
- Respond to GitHub Issues and Discussions within a few days. Speed matters most in the first 60 days when community norms are forming.
- Monthly changelog post (GitHub Releases + brief note in Discord/Reddit) keeps the project visibly alive. Dead-looking repos lose adopters.
- Curate a `SHOWCASE.md` or GitHub Discussions thread where adopters can share their instances. Social proof compounds.

### Roadmap as a stewardship tool
Publish a clear roadmap — a direction, not a commitment. Items already in view form a coherent arc:
- Scrum module
- Query commands (`personal-summary`, `team-summary`)
- Azure DevOps sync
- Multi-agent support
- PM-accessible UX (future phase)

A visible roadmap tells potential adopters the project has a future and gives contributors something to attach to.

### Attribution in practice
State clearly in README that teams using Fabric are encouraged to credit TeamFabric in their repo. A simple badge or README note. Cannot be legally enforced under MIT, but can be modeled and asked for explicitly.

### Multi-agent positioning
State that Claude Code is the first supported agent, and that the file-based, agent-agnostic architecture is intentional. Welcome adapter authors explicitly. This future-proofs the positioning as the agent landscape evolves.

---

## Phased Summary

| Phase | Audience | Channel | Timing |
|-------|----------|---------|--------|
| 0 | — | GitHub repo preparation | Before launch |
| 1 | Claude Code users | Anthropic Discord, r/ClaudeAI, r/ChatGPTCoding | Launch week |
| 2 | Developers, eng leads | Hacker News Show HN, dev newsletters | Weeks 2–4 |
| 3 | PMs, leaders | LinkedIn thought leadership | Ongoing |
| 4 | PMs as operators | TBD, as UX matures | Future |
