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
