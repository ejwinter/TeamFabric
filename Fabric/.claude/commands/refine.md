# /refine — Enter a Backlog Refinement Conversation

## Purpose
Start or continue a refinement conversation, optionally targeting a specific entity.

## Usage
- `/refine` — start from a new idea, no target
- `/refine E-001` — refine a specific epic
- `/refine ehr-pipeline-modernization` — target by folder slug
- `/refine inbox/my-idea` — pick up an inbox item for classification and refinement
- `/refine R-101` — target a request (bridges Triage and Backlog modules)

## Behavior

1. **Resolve the target.**
   - If a target is provided, load the entity. If the target is a folder slug, search `backlog/epics/` and `backlog/epics/*/features/` for a matching directory name.
   - If the target is an inbox item path, load from `backlog/inbox/`.
   - If not found, ask the user to clarify.
   - If no target is provided, ask what the user wants to work on — a new idea, an inbox item, or an existing entity.

2. **If the target is a request (`R-NNN`):**
   - Load the request entity from `requests/<request-id>/request.md`.
   - Check for a `Backlog Epic` field on the request.
   - If no linked epic: propose creating one. Carry forward the request's description, External URL, and link back to the request in Related Items. Do not modify the request entity itself.
   - If the request already has a linked epic: load that epic and proceed to refining it.
   - The request's evaluation data (L1/L2 rubric results, context log) becomes input context for the refinement conversation.

3. **Load parent context.**
   - If the target entity has a parent, load the parent's Child Summary section for sibling context. This keeps context cheap without loading every sibling file.

4. **Run an initial DoR gap scan.**
   - Evaluate the entity against its level-appropriate DoR checklist (from the backlog-refinement skill).
   - Present a brief status: what's present, what's missing, what looks like it might need splitting or further elaboration.

5. **Drop into conversational refinement.**
   - The backlog-refinement skill takes over from here.

## Notes
- Does not require meta mode to start — the refinement conversation is read-only until the user approves a proposed edit, at which point meta mode rules apply as normal.
- All procedural logic lives in the backlog-refinement skill. This command handles target resolution and initial context loading only.
