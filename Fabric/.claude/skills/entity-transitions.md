# Skill: Entity Transitions

## Purpose

Guard and execute state transitions for backlog entities (epics, features, work items) and requests. Each transition path performs pre-flight checks, surfaces relevant context, and requires human confirmation before writing any state change. Never silently update state.

## Invocation

- **Explicit**: invoked by `/transition [entity] [to-state]`
- **Implicit**: invoked whenever the agent detects intent to change an entity's state in conversation ("let's close this", "mark it active", "we're removing that feature", "this is done")

When invoked implicitly, identify the target entity and desired state from context, then run the appropriate transition path below.

## Entity File Retention

**Never delete entity files.** Setting `State: Removed` is the removal action. Resolved and Closed entities remain in place. Physical cleanup is deferred to a future garbage collection skill. If a user asks to delete an entity file, redirect: "I'll set the state to Removed and leave the file in place — physical cleanup is handled by the garbage collection process."

---

## Transition Paths

### New → Active

**Purpose**: Confirm the entity is ready to begin before committing the team's attention to it.

1. Load the entity file.
2. **Blocker check**: scan `## Blockers` for entries with `Status: Active`. Apply follow-up date filtering — only surface actionable blockers (no follow-up date, or follow-up ≤ today).
3. **Open question check**: scan `## Open Questions` for unchecked items. Apply follow-up date filtering — only surface actionable questions.
4. **Dependency check**: scan `## Items this depends on`. If any named dependency has `State: New` or is blocked, flag it.
5. Surface findings:
   ```
   Ready to activate: [Entity Title]

   ⚠ [N] actionable blocker(s):
   - [cause] (flagged by Name, YYYY-MM-DD)

   ⚠ [N] actionable open question(s):
   - [question text] (asked by Name, YYYY-MM-DD)

   ⚠ [N] dependency/dependencies not yet active:
   - [dependency name] — State: New

   [N] parked blockers/questions (follow-up dates in the future — not listed).

   Proceed with activation? (yes / no)
   ```
   If no issues found: "No blockers, open questions, or unready dependencies found. Activate [Entity Title]? (yes / no)"
6. On confirmation: set `State: Active`. Propose the edit, write on confirmation.

---

### Active → Resolved / Closed

**Purpose**: Confirm the work is genuinely complete before closing the record.

1. Load the entity file. Identify the entity type (epic, feature, work item, task).

2. **Implicit Definition of Done check** (by entity type):

   - **Epic**: walk all child feature files. Count by state. List any that are not Closed, Resolved, or Removed.
     ```
     Child features not yet complete:
     - [feature title] — State: Active
     - [feature title] — State: New
     ```
   - **Feature**: walk all child work item files. Same count and list.
   - **Work item**: two sub-checks:
     - *Acceptance Criteria*: load `## Acceptance Criteria`. Present each criterion and ask the user to confirm it is met. If the section is empty or absent, note it.
     - *Tasks*: check child task files. List any not Closed or Removed.
   - **Task**: no implicit DoD. Proceed to explicit check.

3. **Explicit Definition of Done check**: if the entity has a `## Definition of Done` section with unchecked items (`- [ ]`), walk through each one with the user.

4. **Blocker check**: scan `## Blockers` for any `Status: Active` entry. Warn if any exist.

5. **Open question check**: warn if any unchecked, actionable open questions remain.

6. **Effort prompt**: if the Effort Tracking module is enabled, defer to the backlog module's close prompt behavior (do not duplicate it here).

7. Surface the full picture before asking for confirmation:
   ```
   Closing: [Entity Title]

   Definition of Done:
   ✗ 2 child features still active: [names]       ← implicit, epic/feature
   ✓ Acceptance Criteria: all 4 confirmed met     ← implicit, work item
   ✗ 1 task not yet closed: [task title]          ← implicit, work item
   ? [ ] Documentation updated                    ← explicit, awaiting confirmation
   ✓ [x] API contract reviewed                   ← explicit, already checked

   ⚠ 1 active blocker still open — closing anyway?
   ⚠ 1 open question still unresolved — closing anyway?
   ```

8. If implicit DoD is unmet (children not closed, criteria not confirmed), require explicit acknowledgement before proceeding: "The definition of done is not fully met. Close anyway? (yes / no)"

9. On confirmation: set `State: Resolved` or `State: Closed` as appropriate for the entity type. Update any confirmed explicit DoD checkboxes. Write `Terminated: <today's date>` to the Properties block if not already set.

---

### Any → Removed

**Purpose**: Ensure removal is intentional and that dependents are not silently broken.

1. Load the entity file.
2. **Dependent scan**: search all other entity files for references to this entity in:
   - `## Items this depends on`
   - `## Related Items`
   - `Backlog Epic:` field on requests (if removing an epic)
   Match by entity ID (folder name / file stem) and by title.
3. Surface findings:
   ```
   Removing: [Entity Title]

   ⚠ The following entities reference this item and may be affected:
   - [entity name] — [section where referenced]
   - ...

   Consider updating those items before or after this removal.
   Proceed? (yes / no)
   ```
   If no dependents found: "No other entities reference this item. Proceed with removal? (yes / no)"
4. On confirmation:
   - Set `State: Removed`.
   - Write `Terminated: <today's date>` to the Properties block if not already set.
   - Do NOT delete the file.
   - Suggest a git commit: "Recommend committing this change: `git commit -m 'Remove [entity title]'`"
5. Offer to open the dependent entities to update their references, one at a time.

---

## Tone

- Be direct about issues but not alarmist. A warning is informational; the user decides whether to proceed.
- Do not repeat the same concern multiple times in the same transition.
- Keep confirmation prompts short. The user has already seen the findings.
