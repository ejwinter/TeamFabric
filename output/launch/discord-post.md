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
