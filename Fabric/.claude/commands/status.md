# /status - Team Status Summary

## Purpose
Quick factual snapshot of current team state. Numbers and lists, not narrative.

## Behavior

1. Load:
   - team/team.md (members, allocation, current state)
   - Active member profiles (status, allocation, and `## Capacity Adjustments` for current or upcoming periods)
   - Request counts if available (active engagements, pending triage)
   - If Backlog module is enabled: walk backlog/epics/ and count entities by state

2. Output a concise summary:

```
Team: [name]
Effective Capacity: [X] FTE

Active Members:
  [name] - [role] - [allocation]%
  [name] - [role] - [allocation]% (out YYYY-MM-DD to YYYY-MM-DD)
  [name] - [role] - [allocation]% ([X]% YYYY-MM-DD to YYYY-MM-DD, [reason])
  ...

Benched Members: [list or "none"]

Engagements:
  Active: [n]
  Pending triage: [n]

Backlog:                          ← omit entire section if Backlog module not enabled
  Epics:      Active [n]  New [n]
  Features:   Active [n]  New [n]
  Work Items: Active [n]  New [n]

Staleness: [any entities flagged as stale, or "none detected"]
```

3. Keep it short. If the user wants narrative, point them to /describe-team.

## Notes
- Read-only, no meta mode required.
- If engagement/request data is not yet tracked in Fabric, say so rather than guessing.
- Backlog counts are derived by walking the backlog/ directory tree. Only count Active and New states — Resolved, Closed, and Removed items are excluded from counts.
- When displaying active members, check each member's `## Capacity Adjustments` for rows whose date range includes today or falls within the next 14 days. Show the adjustment inline in the member line. A member fully out today is noted as `(out [start] to [end])`; a member at reduced capacity is noted as `([X]% [start] to [end], [reason])`. Members with no current or upcoming adjustments show baseline allocation only.
