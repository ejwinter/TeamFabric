# What's Next Checklist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pre-filled empty evaluation placeholder in request entities with a progressive "What's Next" checklist that reflects where the request actually is in the workflow.

**Architecture:** Add a `## What's Next` section to the request template (static baseline + AI-generated items at creation), document agent-assisted resolution behavior in fabric-triage.md, and add What's Next lifecycle rules to the request-evaluation skill so it generates/replaces the section at each evaluation stage transition. No new files, commands, or skills.

**Tech Stack:** Markdown files only — this is a documentation and behavioral rules update.

---

## File Map

| File | Action | What changes |
|------|--------|--------------|
| `Fabric/requests/workflow/default/request-template.md` | **Create** | Canonical request template with What's Next section; replaces `.gitkeep` as the shipped default |
| `Example/requests/workflow/default/request-template.md` | **Modify** | Update Example instance template to match canonical |
| `Fabric/.claude/skills/request-evaluation.md` | **Modify** | Add `### What's Next Lifecycle` behavioral rules section |
| `Fabric/.claude/commands/evaluate-request.md` | **Modify** | Update step 5 to include What's Next generation in post-eval write |
| `Fabric/template/fabric-triage.md` | **Modify** | Add `### What's Next Section` under Behavioral Rules |
| `Example/.claude/fabric-triage.md` | **Modify** | Sync with updated Fabric/template/fabric-triage.md |
| `Example/requests/R-101/request.md` | **Modify** | Add post-L1 What's Next (L2 evaluation ready to run) |
| `Example/requests/R-102/request.md` | **Modify** | Add pre-L1 What's Next (baseline + AI-generated items for known gaps) |

---

## Task 1: Create the canonical request template

**Files:**
- Create: `Fabric/requests/workflow/default/request-template.md`
- Delete: `Fabric/requests/workflow/default/.gitkeep` (no longer needed)

- [ ] **Step 1: Create the canonical request template**

Write `Fabric/requests/workflow/default/request-template.md` with this exact content:

```markdown
# R-[ID]: [Request Title]

Status: New
Workflow: default
Submitted: YYYY-MM-DD
Requestor: [Name] ([email])
Owner: [Team member responsible for shepherding this request]

## Summary

[2-3 sentence description of what is being requested and why.]

## Properties

Priority: [Not Set | Low | Medium | High | Critical]
Target Date: [date or "None"]
Effort Estimate: [Not Set | Small (< 1 week) | Medium (1-4 weeks) | Large (> 1 month)]
Effort: [hours of planning/discovery work invested in this request — populated on close]
Engagement Model: [Not Set | Full-Service | Collaborative | Advisory]
External: [None | e.g., ADO Epic #1234 — https://dev.azure.com/org/project/_workitems/edit/1234]
Labels: [optional, comma-separated key=value pairs matching the team's label schema, e.g. service-type=data-extraction]

### Requestor Details
Department: [Requestor's department]
Data Scientist Available: [Yes | No]
Funding: [Funded | Unfunded | Unknown]
IRB Status: [Approved (protocol #) | Pending | Not Required | Unknown]

### Technical Details
Data Sources: [What data is needed]
Cohort Description: [Target population or dataset]
AI/ML Goal: [What the requestor wants to achieve]

## Evaluation

## What's Next

Preparing for L1 screening:
- [ ] Confirm data sources are identified and accessible
- [ ] Clarify the AI/ML goal to a specific, evaluable question
- [ ] Determine IRB status
- [ ] Determine funding status
- [ ] Confirm investigator availability for consultation

## Context Log
```

Note: The static baseline checklist above is the pre-L1 default. Teams customize these items in their own copy of this template. The agent omits items already answered by the request's field values when creating a real request.

- [ ] **Step 2: Remove the .gitkeep**

```bash
git rm Fabric/requests/workflow/default/.gitkeep
```

- [ ] **Step 3: Verify the new file reads correctly**

Read `Fabric/requests/workflow/default/request-template.md` and confirm:
- `## Evaluation` section is present and empty (no placeholder comment)
- `## What's Next` section is present with the 5-item pre-L1 baseline checklist
- Section order is: `## Evaluation` → `## What's Next` → `## Context Log`

- [ ] **Step 4: Commit**

```bash
git add Fabric/requests/workflow/default/request-template.md
git commit -m "add canonical request template with What's Next section"
```

---

## Task 2: Update the Example instance request template

**Files:**
- Modify: `Example/requests/workflow/default/request-template.md`

The Example instance has its own copy of the request template. Update it to match the canonical template from Task 1, preserving the team-specific field additions (the Example template has `Requestor Details` and `Technical Details` already — keep those).

- [ ] **Step 1: Read the current Example template**

Read `Example/requests/workflow/default/request-template.md`. Note the current `## Evaluation` section content — it currently has:
```
<!-- Populated by /evaluate-request using the workflow's rubrics -->
```

- [ ] **Step 2: Update the Evaluation and What's Next sections**

Replace:
```markdown
## Evaluation

<!-- Populated by /evaluate-request using the workflow's rubrics -->

## Context Log
```

With:
```markdown
## Evaluation

## What's Next

Preparing for L1 screening:
- [ ] Confirm data sources are identified and accessible
- [ ] Clarify the AI/ML goal to a specific, evaluable question
- [ ] Determine IRB status
- [ ] Determine funding status
- [ ] Confirm investigator availability for consultation

## Context Log
```

- [ ] **Step 3: Verify**

Read the file back and confirm the placeholder comment is gone, the What's Next section is present with the baseline checklist, and the rest of the template is unchanged.

- [ ] **Step 4: Commit**

```bash
git add Example/requests/workflow/default/request-template.md
git commit -m "update Example request template: add What's Next, remove empty rubric placeholder"
```

---

## Task 3: Add What's Next lifecycle rules to the request-evaluation skill

**Files:**
- Modify: `Fabric/.claude/skills/request-evaluation.md`

- [ ] **Step 1: Read the current skill file**

Read `Fabric/.claude/skills/request-evaluation.md`. Find the `## Behavioral Rules` section at the bottom of the file.

- [ ] **Step 2: Append the What's Next Lifecycle section**

Add the following after the last existing behavioral rule (after "Defer to the workflow's `evaluation.md`..." bullet):

```markdown
### What's Next Lifecycle

The `## What's Next` section on a request entity is maintained by this skill at each evaluation stage transition.

**On evaluation write:**
Clear the existing What's Next content and replace it with new content based on the outcome. Present the proposed What's Next alongside the evaluation summary for user confirmation — both are written together on a single confirmation.

**Outcome-based content:**

- **Advance to next stage** (e.g., L1 → L2): Generate a pre-stage checklist for the next stage. Use the next stage's rubric criteria as the basis, supplemented by items tailored to gaps or notes identified in the just-completed evaluation. Omit items already satisfied.

  Example after L1 advances to L2:
  ```markdown
  ## What's Next

  Preparing for L2 consultation:
  - [ ] Schedule consultation meeting with requestor
  - [ ] Review a data sample for quality assessment
  - [ ] Load current team capacity before the staffing discussion
  - [ ] Identify team member(s) with relevant expertise for this request
  ```

- **Needs More Information**: List the specific questions or gaps the evaluator identified during the rubric walkthrough as directly actionable checklist items.

  Example:
  ```markdown
  ## What's Next

  Needs more information before L1 can advance:
  - [ ] Requestor to clarify cohort definition — current description is too vague to assess viability
  - [ ] Confirm whether pre-2022 EHR data is accessible (known system migration)
  - [ ] Get IRB status — unknown at this time
  ```

- **Defer**: Note the specific conditions required to re-enter evaluation, with follow-up date if provided.

  Example:
  ```markdown
  ## What's Next

  Deferred — revisit after 2026-06-01:
  - [ ] IRB approval must be in place before re-screening (pending protocol submission)
  - [ ] Follow up with requestor on 2026-06-01 to check IRB status
  ```

- **Accept** (terminal): Post-decision steps toward active engagement.

  Example:
  ```markdown
  ## What's Next

  Accepted — moving to engagement:
  - [ ] Assign team member owner
  - [ ] Schedule kickoff with requestor
  - [ ] Promote to backlog epic
  - [ ] Confirm engagement model and effort estimate with team
  ```

- **Reject** (terminal): Post-decision communication steps.

  Example:
  ```markdown
  ## What's Next

  Declined — close out:
  - [ ] Notify requestor with rationale (see evaluation notes)
  - [ ] Update request status to Declined
  ```

**Rules:**
- Do not generate generic items. Root each item in the specific evaluation notes, next-stage rubric criteria, or known gaps about this request.
- Omit items already satisfied given the request's current field values.
- The agent proposes What's Next content; the human confirms before it is written.
```

- [ ] **Step 3: Verify**

Read the updated skill file and confirm:
- The new `### What's Next Lifecycle` subsection appears under `## Behavioral Rules`
- All five outcome cases are present (Advance, Needs More Info, Defer, Accept, Reject)
- No existing rules were changed

- [ ] **Step 4: Commit**

```bash
git add Fabric/.claude/skills/request-evaluation.md
git commit -m "add What's Next lifecycle rules to request-evaluation skill"
```

---

## Task 4: Update the evaluate-request command

**Files:**
- Modify: `Fabric/.claude/commands/evaluate-request.md`

- [ ] **Step 1: Read the current command file**

Read `Fabric/.claude/commands/evaluate-request.md`. Find step 5 under `## Behavior`:

```
5. **After evaluation:**
   - Present the completed evaluation for confirmation before writing to the request entity.
   - If the outcome is a terminal state (Accept/Reject), suggest next steps per the workflow.
   - Append an entry to the request's context log noting the evaluation.
```

- [ ] **Step 2: Update step 5**

Replace:
```markdown
5. **After evaluation:**
   - Present the completed evaluation for confirmation before writing to the request entity.
   - If the outcome is a terminal state (Accept/Reject), suggest next steps per the workflow.
   - Append an entry to the request's context log noting the evaluation.
```

With:
```markdown
5. **After evaluation:**
   - Present the completed evaluation for confirmation before writing to the request entity.
   - Present the proposed `## What's Next` update alongside the evaluation (generated by the request-evaluation skill based on the outcome). Both are confirmed and written together.
   - Append an entry to the request's context log noting the evaluation.
```

- [ ] **Step 3: Verify**

Read the file back. Confirm step 5 no longer mentions "suggest next steps per the workflow" (that's now handled by the What's Next section) and instead references the request-evaluation skill for What's Next generation.

- [ ] **Step 4: Commit**

```bash
git add Fabric/.claude/commands/evaluate-request.md
git commit -m "update evaluate-request: include What's Next generation in post-eval write"
```

---

## Task 5: Document What's Next in fabric-triage.md (framework source)

**Files:**
- Modify: `Fabric/template/fabric-triage.md`

- [ ] **Step 1: Read the current fabric-triage.md**

Read `Fabric/template/fabric-triage.md`. Find the `## Behavioral Rules` section. It begins with a list of simple bullet rules, then has subsections `### Blocked Requests`, `### Effort Tracking on Requests`, `### Request–Backlog Cross-Reference`, `### Effort Resolution via Linked Epic`.

- [ ] **Step 2: Fix the Blockers placement instruction**

In the `### Blocked Requests` subsection, find this sentence:

```
The `## Blockers` section should be placed after `## Evaluation` and before `## Context Log` in the request file.
```

Replace it with:

```
The `## Blockers` section should be placed after `## What's Next` and before `## Context Log` in the request file.
```

- [ ] **Step 3: Add the What's Next Section subsection**

After the opening bullet-list rules (the 5 bullets before `### Blocked Requests`) and before `### Blocked Requests`, insert:

```markdown
### What's Next Section

Request entities carry a `## What's Next` section between `## Evaluation` and `## Context Log`. It tracks actionable next steps throughout the request lifecycle.

**At request creation:** Populate with the team's pre-L1 baseline checklist from `request-template.md`, supplemented by AI-generated items for gaps detected in the specific request content. Omit baseline items already answered by the request's field values (e.g., if `IRB Status: Approved`, skip the IRB item).

**During evaluation prep:** As information arrives via ingestion, conversation, or standup, propose checking off resolved items:
- When a checklist item is satisfied, propose: *"IRB status is now confirmed. Check off 'Determine IRB status' on R-NNN?"*
- Do not auto-check items. Always propose and confirm — consistent with entity update rules in fabric-core.
- When all items are checked, suggest running `/evaluate-request`.

**After evaluation:** The section is replaced based on the outcome by the request-evaluation skill. See that skill for outcome-specific behavior.

```

- [ ] **Step 4: Verify**

Read `Fabric/template/fabric-triage.md` and confirm:
- The `### Blocked Requests` subsection now says "after `## What's Next`" (not "after `## Evaluation`")
- The new `### What's Next Section` subsection is present under `## Behavioral Rules`, before `### Blocked Requests`
- The three lifecycle phases (creation, prep, after evaluation) are all documented
- No other content was changed

- [ ] **Step 5: Commit**

```bash
git add Fabric/template/fabric-triage.md
git commit -m "document What's Next section lifecycle in fabric-triage; fix Blockers placement"
```

---

## Task 6: Sync Example instance fabric-triage.md

**Files:**
- Modify: `Example/.claude/fabric-triage.md`

The Example instance carries its own copy of the framework files (as a real deployed instance would). Sync it with the changes from Task 5.

- [ ] **Step 1: Read the current Example fabric-triage.md**

Read `Example/.claude/fabric-triage.md`. Confirm it matches `Fabric/template/fabric-triage.md` from before Task 5's changes (i.e., does not yet have `### What's Next Section`).

- [ ] **Step 2: Apply the same two changes as Task 5**

In `Example/.claude/fabric-triage.md`:
1. In `### Blocked Requests`, replace "after `## Evaluation` and before `## Context Log`" with "after `## What's Next` and before `## Context Log`"
2. After the 5 opening bullet rules and before `### Blocked Requests`, insert the identical `### What's Next Section` block from Task 5 Step 3.

- [ ] **Step 3: Verify**

Read `Example/.claude/fabric-triage.md` and confirm it matches `Fabric/template/fabric-triage.md` exactly (same Blockers placement fix, same new subsection, same placement).

- [ ] **Step 4: Commit**

```bash
git add Example/.claude/fabric-triage.md
git commit -m "sync Example fabric-triage with What's Next section documentation"
```

---

## Task 7: Update R-101 with post-L1 What's Next

**Files:**
- Modify: `Example/requests/R-101/request.md`

R-101 has a completed L1 evaluation (outcome: Advance to L2). The context log also shows an L2 consultation has occurred (March 25) but no L2 evaluation has been written yet. The What's Next should reflect: ready to run `/evaluate-request R-101 L2`, with the key risk from the consultation surfaced as an item.

- [ ] **Step 1: Read R-101**

Read `Example/requests/R-101/request.md` and find the `## Evaluation` and `## Context Log` sections.

- [ ] **Step 2: Add What's Next after the Evaluation section**

The file currently ends with the `## Evaluation` section followed directly by `## Context Log`. Insert the What's Next section between them:

```markdown
## What's Next

Preparing for L2 evaluation:
- [ ] Run `/evaluate-request R-101 L2` to record L2 findings (consultation already held 2026-03-25)
- [ ] Resolve consistent definition of sepsis onset timestamp before L2 — flagged as key risk in consultation notes
```

- [ ] **Step 3: Verify**

Read the file and confirm:
- `## What's Next` appears between `## Evaluation` and `## Context Log`
- The two items reflect the actual state of R-101 (consultation done, L2 eval not yet run, onset timestamp risk)
- Evaluation and Context Log sections are unchanged

- [ ] **Step 4: Commit**

```bash
git add Example/requests/R-101/request.md
git commit -m "add post-L1 What's Next to R-101 (ready for L2 evaluation)"
```

---

## Task 8: Update R-102 with pre-L1 What's Next

**Files:**
- Modify: `Example/requests/R-102/request.md`

R-102 is a new request with several unknowns: funding is Unknown, IRB is Unknown, cohort volume is unknown. Data Scientist is Available (Dr. Anil Mehta). The What's Next should show the baseline checklist with AI-generated items for the known gaps, omitting the investigator availability item (already confirmed available via context log).

- [ ] **Step 1: Read R-102**

Read `Example/requests/R-102/request.md` and find the `## Evaluation` section.

- [ ] **Step 2: Add What's Next after the Evaluation section**

The file currently has `## Evaluation` with a comment, followed by `## Context Log`. Replace:

```markdown
## Evaluation

<!-- No evaluation yet — ready for L1 screening -->

## Context Log
```

With:

```markdown
## Evaluation

## What's Next

Preparing for L1 screening:
- [ ] Confirm data sources are identified and accessible
- [ ] Clarify the AI/ML goal to a specific, evaluable question
- [ ] Determine IRB status
- [ ] Determine funding status
- [ ] Estimate cohort size — volume of heart failure discharges at Riverdale is currently unknown
- [ ] Clarify funding situation with Dr. Whitfield — departmental vs. grant funding affects prioritization

## Context Log
```

Note: "Confirm investigator availability" is omitted — Dr. Whitfield's availability is confirmed in the context log. Data Scientist Available is already set to Yes.

- [ ] **Step 3: Verify**

Read the file and confirm:
- The evaluation placeholder comment is gone
- `## Evaluation` is empty
- `## What's Next` has 6 items: 4 standard baseline items + 2 AI-generated items for R-102's specific gaps
- Investigator availability item is absent (already known)
- Context Log is unchanged

- [ ] **Step 4: Commit**

```bash
git add Example/requests/R-102/request.md
git commit -m "add pre-L1 What's Next to R-102 with request-specific gap items"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|-----------------|------|
| Remove empty rubric placeholder comment | Task 2 (Example template), Task 8 (R-102) |
| Add `## What's Next` to request template with static baseline | Task 1 (canonical), Task 2 (Example) |
| AI-generated items at creation time (supplementing baseline) | Documented in Task 5/6 (fabric-triage behavioral rules) |
| Omit already-answered baseline items | Documented in Task 5/6 and Task 8 demonstrates it |
| Agent-assisted resolution: propose checking off items as info arrives | Task 5/6 (fabric-triage behavioral rules) |
| Suggest `/evaluate-request` when all items checked | Task 5/6 |
| Evaluation start: replace What's Next with rubric in Evaluation | Task 3 (skill) |
| Non-terminal outcomes: generate new What's Next | Task 3 (all 5 outcome cases) |
| Terminal outcomes: post-decision items | Task 3 (Accept and Reject cases) |
| `evaluate-request` command updated for What's Next | Task 4 |
| Example R-101: post-L1 What's Next | Task 7 |
| Example R-102: pre-L1 What's Next | Task 8 |
| Canonical request template created at `Fabric/requests/workflow/default/` | Task 1 |

All spec requirements are covered.

**Placeholder scan:** No TBD, TODO, or vague steps. All file edits include exact content.

**Consistency check:** The `## What's Next` section placement (between `## Evaluation` and `## Context Log`) is consistent across the template (Task 1), skill (Task 3), triage doc (Task 5/6), and example instances (Tasks 7/8). The `## Blockers` section note in fabric-triage ("placed after `## Evaluation` and before `## Context Log`") now conflicts with What's Next sitting in the same slot — check this during Task 5 and update the Blockers placement note to read "after `## What's Next`" if needed.
