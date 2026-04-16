# Skill: Standup Context

## Purpose

Enrich the context for a `/standup-discussion` session before the conversation begins. Loads assigned work, detects recent product contributions, and surfaces any team standup follow-up items for this member. Returns a structured context bundle — it does not initiate conversation.

## Invocation

Invoked internally by `/standup-discussion` immediately after the member is identified. Runs silently. Results are used to inform the conversation; they are not presented directly to the member.

## Steps

### 1. Load Member Profile

Read `team/members/<name-slug>/profile.md`. Extract:
- Role and team function
- Responsibilities
- Expertise

### 2. Load Prior Standup

Read `team/members/<name-slug>/discuss-yesterday.md` if it exists. Note the date in the header — this is the member's personal "last standup" date, used later for git range detection.

If the file does not exist, note that this may be the member's first standup.

### 3. Load Assigned Backlog Items

Scan backlog entities for items with `Assigned to:` matching this member's name. Limit to Active and In Progress states. Load work items and tasks; also load epics and requests that are directly assigned to this member — they may carry `Repository:` fields needed for Step 3b.

Do not load the full backlog tree. Search by scanning entity files for the `Assigned to:` field. Stop at a reasonable depth — if the backlog is large, note that results may be partial.

### 3b. Detect Engagement Repository Contributions

For each assigned epic or request that has a `Repository:` field:

1. Resolve the local clone path: infer the folder name from the last path segment of the `Repository:` URL (e.g. `https://github.com/org/project-alpha` → `../project-alpha` relative to the Fabric instance root). This follows the same sibling-directory convention as Knowledge Repository path resolution in `fabric-core.md`.
2. If the folder exists and is a git repository:
   - Run: `git log --author=<member-email> --since=<last-standup-date> --oneline`
   - If the entity has a `Repository Path:` field, append `-- <repository-path>` to scope the log to commits touching that subfolder only.
   - Use the date from `discuss-yesterday.md` as `--since`. If no prior standup exists, use 2 days ago as a fallback.
   - If commits are found, record the entity name, repo URL, and a brief summary of the commits (message lines only — do not read diffs).
3. If the folder is not found or not accessible, skip silently.

### 4. Detect Product Contributions

Read `products/` to identify products this member is active on. For each product:

1. Check the product's `product.md` for a `Repo:` field containing a local path or a remote URL that resolves to a local clone.
2. If a discoverable repo path exists and is accessible:
   - Run: `git log --author=<member-email> --since=<last-standup-date> --oneline`
   - If the product or a linked entity has a `Repository Path:` set, append `-- <repository-path>` to scope the log to commits touching that path only.
   - Use the date from `discuss-yesterday.md` as `--since`. If no prior standup exists, use 2 days ago as a fallback.
   - If commits are found, record the product name and a brief summary of the commits (message lines only — do not read diffs).
3. If no `Repo:` field or the path is not accessible, skip silently.

### 5. Assignment Hygiene Check

For each item in `assigned_items`, scan for the following gaps. Use the last team standup date (from `team/standup/standup-yesterday.md` header, if it exists) as the reference point.

**Context log stale** — Find the most recent `- YYYY-MM-DD` date entry in the entity's `## Context Log`. If that date predates the last team standup date, flag it. If no context log exists and the item has been Active for more than one standup cycle, flag it. Include the entity name and the most recent log date (or "no entries").

**Repository gap** — The entity has a `Repository:` field, but Step 3b found no commits from this member in that repo since the last standup. Flag it with the entity name and repo URL.

**State lag** — Scan `discuss-yesterday.md` for language that signals completion of this entity ("finished", "wrapped up", "done with", "completed", "closed out", followed by the entity name or a close synonym). If found, and the entity's `State:` is still Active or New, flag it with the entity name and the relevant phrase from the prior standup.

Collect all gaps into a `hygiene_gaps` list. Each entry has: entity name, gap type, and a suggested question the conversation can use to probe it.

### 6. Check Team Standup for Follow-Ups

Read `team/standup/standup-yesterday.md` if it exists.

Scan for mentions of this member:
- Their name appearing under another member's "Needs & Questions" (someone has an ask directed at them)
- Their name in a "Suggested Syncs & Breakouts" pairing
- Their name as the owner of a blocker someone else is waiting on

Collect each mention with enough context (the other member's name and the topic) to form a natural follow-up question.

## Output

Return a context bundle with the following structure (internal, not shown to member):

```
member:
  name, role, responsibilities, expertise

prior_standup:
  date: YYYY-MM-DD | none
  summary: [brief — yesterday/today/blockers from the prior record]

assigned_items:
  - [item name, state, entity type]

engagement_contributions:
  - entity: [epic or request name]
    repo: [Repository: URL]
    commits: [one-line summaries]

product_contributions:
  - product: [name]
    commits: [one-line summaries]

hygiene_gaps:
  - entity: [item name]
    gap_type: context_log_stale | repository_gap | state_lag
    suggested_question: [specific question to raise in conversation]

team_followups:
  - from: [other member name]
    topic: [what they needed or the sync reason]
    type: need | sync | blocker
```

If any section is empty, include it with an empty value rather than omitting it — the command uses the structure to decide which conversation areas to open.

## Notes

- Read-only. Does not write any files.
- Git log commands are the only shell operations this skill performs. They are scoped to specific repos and date ranges — do not run broad or unbounded git commands.
- If a git command fails (repo not accessible, permission error), skip that product silently and do not surface the error to the member.
