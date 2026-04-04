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

Scan backlog entities for items with `Assigned to:` matching this member's name. Limit to Active and In Progress states. Load work items and tasks only — do not load epics or features unless they are directly assigned.

Do not load the full backlog tree. Search by scanning entity files for the `Assigned to:` field. Stop at a reasonable depth — if the backlog is large, note that results may be partial.

### 4. Detect Product Contributions

Read `products/` to identify products this member is active on. For each product:

1. Check the product's `product.md` for a `Repo:` field containing a local path or a remote URL that resolves to a local clone.
2. If a discoverable repo path exists and is accessible:
   - Run: `git log --author=<member-email> --since=<last-standup-date> --oneline`
   - Use the date from `discuss-yesterday.md` as `--since`. If no prior standup exists, use 2 days ago as a fallback.
   - If commits are found, record the product name and a brief summary of the commits (message lines only — do not read diffs).
3. If no `Repo:` field or the path is not accessible, skip silently.

### 5. Check Team Standup for Follow-Ups

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

product_contributions:
  - product: [name]
    commits: [one-line summaries]

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
