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
