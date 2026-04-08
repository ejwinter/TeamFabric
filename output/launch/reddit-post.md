# Reddit Launch Post

**Target subreddits:** r/ClaudeAI, r/ChatGPTCoding
**Post type:** Link post to GitHub + text body
**Title:** I built a file-based working memory system for software teams, operated by Claude Code

---

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
