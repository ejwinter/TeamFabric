# Retro Input — Dana Torres — retro-sprint-1-260318

Submitted: 2026-03-31

## What went well this period?

- The Kafka consumer design session with Marcus went really well — having a shared design doc before implementation started meant the code review was straightforward and fast.
- Leo handled the two mid-week pipeline alerts cleanly without needing escalation. That's real progress.
- Marcus and Priya coordinating directly on the shared Kafka topic config saved me from being the middleman.

## What didn't go well or felt harder than it should have?

- I am a bottleneck on code review. Every production pipeline change routes through me, and I had two PRs sitting for two days this sprint because I got pulled into an Epic support call. The team had to wait.
- The Epic API rate limiting issue was a surprise. We started hitting throttling limits on the FHIR extract and had no documented strategy for handling it. Marcus had to stop and do research that should have been done in planning.
- Sprint scope felt light in hindsight — we finished the Kafka scaffold faster than expected and didn't have a clear next item ready to pull in. Lost about a day of momentum.

## What should we change or improve going forward?

- Add Marcus as a co-reviewer for all EHR-adjacent PRs. He has the context and it distributes the load.
- Before we start any new upstream integration work, we should document known API constraints (rate limits, deprecation schedules) as acceptance criteria on the work item — not discover them mid-sprint.
- Keep one ready work item in the backlog as a "pull when capacity opens" buffer so we're not idle when work finishes early.

## Action Items

- Update code review policy to add Marcus as reviewer for EHR and Epic-adjacent changes. Owner: Dana
- Add "document API constraints" to our definition of done for integration work items. Owner: Dana (update team CLAUDE.md)
