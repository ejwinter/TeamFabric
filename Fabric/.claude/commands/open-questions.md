# /open-questions - Open Questions Across the Instance

## Purpose
Surface unchecked open questions that may be blocking progress. Answers "what's holding up X?" and "what questions are still unresolved?"

## Usage

- `/open-questions` — all unchecked questions across the instance, grouped by entity
- `/open-questions [entity]` — scoped to a specific entity (e.g., `/open-questions R-42`, `/open-questions auth-feature`)

## Behavior

1. **Scoped (entity hint provided):**

   Build a connected entity graph centered on the target, then collect open questions across all of it:

   - **The entity itself** — load and read `## Open Questions`
   - **Ancestors** — walk up the backlog hierarchy (work item → feature → epic); load each parent's open questions
   - **Descendants** — walk down to child entities (epic → features → work items); load each child's open questions
   - **Dependencies** — follow any entries in `## Items this depends on`; load open questions from each named dependency
   - **Request ↔ Epic bridge** — if the target is a request with a `Backlog Epic:` field, follow the link to the epic and include the full epic subtree (ancestors: none — epics are top-level; descendants: features, work items). If the target is a backlog entity whose `## Related Items` references an originating request (e.g. "Originated from request R-NNN"), load that request's open questions as well.

   Label each question with its source entity and relationship so the user knows where it lives. Questions on the entity itself appear first, then ancestors, then the linked request or epic (bridge), then dependencies, then descendants.

2. **Instance-wide (no hint):**
   - Walk all entity files that carry an `## Open Questions` section:
     - `requests/` — all request directories
     - `backlog/` — epics, features, work items (skip tasks and inbox items)
     - `products/` — product files
   - Collect all unchecked `- [ ]` items with their entity context.
   - Output grouped by entity, sorted with active/open entities first.

3. **Output format:**

```
## Open Questions for: R-101

### R-101 (this entity)
- [ ] Confirm IRB amendment covers the extended cohort. *(asked by Dana Torres, 2026-04-01)*

### sepsis-prediction-260315 (linked epic)
- [ ] Should we target 4h or 6h lead time for the v1 model? *(asked by Marcus Chen, 2026-03-28)*

### fhir-extraction-260101 (dependency of linked epic)
- [ ] Who owns the token rotation schedule? *(asked by Sam Park, 2026-04-01)*

### sepsis-feature-labeling-260402 (descendant of linked epic)
- [ ] Confirm label source: chart review or consensus panel? *(asked by Eric Winter, 2026-04-03)*

---
[N] open questions across [M] entities.
```

4. After listing, offer: "Want to resolve or log a decision for any of these?"

## Notes
- Read-only, no meta mode required.
- Do not include checked `- [x]` items — those are resolved.
- If a question looks stale (entity is Closed or Resolved), note it as potentially obsolete.
- For the instance-wide view, ancestor/descendant expansion is not applied — each entity is shown as-is to keep output manageable.
