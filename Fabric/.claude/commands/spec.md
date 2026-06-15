# /spec — Implementation Spec Management

## Purpose

Manage implementation specs co-located with work items. Specs capture the technical *how* before coding begins. Dispatches on the first argument: `create`, `review`, or `approve`.

## Prerequisites

Spec module must be enabled. Backlog module must be enabled (specs live inside the backlog hierarchy).

---

## /spec create [wi-id]

Scaffold a new `spec.md` alongside the given work item.

### Steps

1. **Resolve the work item.** Consult `backlog-index.slim.md` first. Locate the work item folder at `backlog/epics/.../workitems/<wi-id>/`. If no match is found, search the backlog tree directly. If still not found, tell the user and stop.

2. **Check for an existing spec.** If `spec.md` already exists in that folder:
   - If `State: Superseded` — offer to overwrite it with a fresh Draft: "A superseded spec already exists. Overwrite with a new Draft? (yes / no)"
   - Any other state — decline: "A spec already exists (State: [state]). Use `/spec review [wi-id]` to continue working on it, or `/spec approve [wi-id]` to approve it."

3. **Resolve the author.** Use the `identity` skill to determine the active user's name.

4. **Pre-fill Context.** Read `## Description` from `workitem.md`. Use it as the starter content for the `## Context` section of the new spec.

5. **Compute the relative path.** The `Work Item:` property should be the relative path from `spec.md` to `workitem.md` — since they are siblings, this is simply `./workitem.md`.

6. **Propose the draft.** Show the proposed `spec.md` content in full and ask for confirmation before writing. Include all default sections with placeholder text. Show the pre-filled Context to the user so they can adjust it.

7. **Write on confirmation.** Create `spec.md` in the work item folder.

8. **Offer index refresh.** After writing: "Refresh the backlog index now? (`python fabscripts/backlog_index.py`) (yes / skip)"

---

## /spec review [wi-id]

Walk through the spec sections to assess completeness. Offer to transition to Ready when all conditions are met.

### Steps

1. **Resolve the work item** (same as create, step 1).

2. **Load spec.md.** If `spec.md` does not exist, tell the user and offer to create it: "No spec found for [wi-id]. Run `/spec create [wi-id]` to create one."

3. **Surface current state.** Show: "Spec for [Work Item Title] — State: [state]"

4. **Load context from the parent chain.** Read up the hierarchy to understand what the spec should satisfy:
   - Work item: `## Description` and `## Acceptance Criteria`
   - Parent feature: `## Description` and `## Acceptance Criteria`
   - Parent epic: `## Description`
   - If the epic or feature carries a `Backlog Epic:` / `Backlog Feature:` cross-reference to a request, read that request's description and acceptance criteria too.
   This context is used in step 6 to pressure-test the spec. Do not recite it back — use it to form questions.

5. **Walk the required sections.** For each of: Context, Approach, Components Affected, Test Plan — present the current content and ask: "Is this section complete? (yes / needs work)"
   - If the user says "needs work", pause and let them describe what's missing. Do not auto-fill content — the spec is the engineer's artifact.
   - Note optional sections (Schema Changes, API Changes, UI Changes) but do not require them.

5a. **AC alignment check.** After walking the sections, cross-reference the spec against the parent chain context:

   - **Spec → AC**: for each significant approach or component in the spec, check whether the work item's acceptance criteria reflect it. Flag gaps: "The spec describes [X] but there's no AC for it — should we add one to the work item?"
   - **AC → spec**: for each AC item on the work item, verify the spec's approach plausibly satisfies it. Flag any AC items not obviously covered: "AC item [N] requires [Y] — the spec doesn't mention how that's handled. Is it implicit, or does the spec need a note?"
   - Ask about each gap individually, conversationally. Do not write changes to the work item's AC or the spec without confirmation.

8. **Surface unresolved Open Questions.** List any unchecked items in `## Open Questions`. These must be resolved before the spec can move to Ready.

9. **Evaluate readiness.** After the walk:
   - All four required sections confirmed complete AND no unresolved Open Questions → offer to transition: "All required sections are complete and no open questions remain. Transition to Ready? (yes / no)"
   - Any gaps remain → summarize what still needs attention. Do not offer the Ready transition.

10. **Write on confirmation.** If transitioning to Ready, set `State: Ready` in the Properties block. Propose the change, write on confirmation.

---

## /spec approve [wi-id]

Record formal approval on a Ready spec.

### Steps

1. **Resolve the work item** (same as create, step 1).

2. **Load spec.md.** If `spec.md` does not exist: "No spec found for [wi-id]."

3. **Check state.** If `State:` is not `Ready`:
   - `Draft` → "The spec is still in Draft. Run `/spec review [wi-id]` to walk it to Ready first."
   - `Approved` → "This spec is already approved (approved by [Approved By] on [Approved On])."
   - `Superseded` → "This spec has been superseded."
   - Stop in all cases.

4. **Resolve the approver.** Use the `identity` skill to determine the active user's name.

5. **Confirm.** Ask:
   ```
   Approve spec for [Work Item Title]?
   Approver: [name]
   Date: [today]
   (yes / no)
   ```

6. **Write on confirmation.** Set `State: Approved`, `Approved By: [name]`, `Approved On: [today]` in the Properties block.

7. **Propose commit.**
   ```
   worklog: approve spec [wi-id]
   Commit with this message? (yes / edit / skip)
   ```
