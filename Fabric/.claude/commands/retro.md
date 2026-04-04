# /retro — Retrospective Commands

## Usage

```
/retro [create | review [retro-id] | report [retro-id] | close [retro-id] | narrative]
```

| Subcommand | Behavior |
|------------|----------|
| *(no argument)* | Q&A input mode — member contributes to the open retro (async, offline) |
| `narrative` | Narrative-first input — member provides a free-form summary, agent follows up on gaps only |
| `create` | Create a new retrospective (lead/PM) |
| `review [retro-id]` | Show participation status and optionally review submitted inputs. Defaults to open retro. |
| `report [retro-id]` | Synthesize member inputs into a draft at `output/retro-<id>.md` for the team review meeting. Defaults to open retro. |
| `close [retro-id]` | Finalize from the annotated draft; write `summary.md` and mark the retro closed. Defaults to open retro. |

---

## `/retro create`

### 1. Identify the Creator

Resolve identity from `git config user.email` matched against member profiles. Greet by name and confirm.

### 2. Gather Retro Parameters

Ask in a single conversational pass — do not interrogate with a form:

**Period**: What time period does this retro cover? If Backlog with iterations is enabled, surface the most recently completed iteration as a default:
> "This would cover the just-completed sprint (YYMMDD–YYMMDD) — does that sound right, or do you want a different range?"

**Name/Title**: Optional. If the retro is tied to an iteration or milestone, offer to include it in the ID:
> "Want to give this retro a name (e.g. 'Sprint 5')? Otherwise I'll use the date."

**Questions**: Use the team's default questions (from constitution or framework default) unless the lead wants to customize:
> "I'll use the standard retro questions. Want to add anything specific for this one, or change the focus?"

If the lead provides custom questions, record them. If they confirm defaults, write `default`.

**Notes**: Any context or goals for this retro? (Optional — skip if the lead has nothing to add.)

### 3. Build the Participant List

Load all active members from `team/members/` (excluding `template/`). Present the list for confirmation — the lead can remove members who shouldn't participate (e.g. someone who just joined).

### 4. Write the Retro

Generate a retro ID: `retro-YYMMDD` or `retro-<slug>-YYMMDD` if a name was given (e.g. `retro-sprint-5-260404`).

Preview `team/retros/<retro-id>/retro.md` and ask for confirmation before writing.

Write the file. Do not create member input files — those are written when each member participates.

### 5. Close

Confirm the retro folder and file were created. Output a ready-to-share line the lead can paste to the team:

> "Retro is open: `/retro` to share your input. Closes when [lead] runs `/retro close`."

---

## `/retro` (Member Input — Q&A Mode)

### 1. Identify the Member

Resolve identity from `git config user.email` matched against `Email:` fields in member profiles.

- If matched: greet by name and confirm.
- If not matched: ask which team member they are.

### 2. Find the Open Retro

Scan `team/retros/*/retro.md` for `Status: Open`.

- **One open retro**: proceed automatically. State the retro period:
  > "There's an open retro covering [period]. Let's capture your input."
- **Multiple open retros**: list them and ask which one.
- **No open retro**: inform the member and suggest asking the lead to run `/retro create`. Stop here.

### 3. Check Prior Submission

Check whether `team/retros/<retro-id>/<member-slug>.md` exists.

- **Exists**: inform the member they've already submitted and ask whether to update it or view it.
- **Not exists**: proceed.

### 4. Load Context

Silently load context to inform the conversation:

- The retro's questions (from `retro.md` — custom list or flag to use defaults).
- The retro period.
- If Backlog module is enabled: closed/Done backlog items assigned to this member during the retro period. Use these to prompt specifics.
- The member's profile (role, responsibilities).
- Prior retro action items assigned to or proposed by this member (scan the most recent `summary.md` in `team/retros/`).

Do not recite this context. Use it to ask informed questions.

### 5. Run the Conversation

Conduct a focused, conversational retro. Work through the retro's questions naturally — do not present them as a numbered form.

**Prior action item follow-up** *(if found in context)*

If the prior retro summary had action items for this member, open with them:
> "Last retro, there was an action item around [X] — did that happen?"

**Working through the questions**

Move through each question conversationally. Reference specific closed work items where relevant:
> "You wrapped up [work item] this sprint — how did that go? Anything about how it was scoped or handed off worth noting?"

Probe vague responses for specifics. If the member says "communication was rough," ask what specifically broke down and what would have helped.

For action items: ask the member to name an owner. If they don't, suggest the most appropriate person based on role or domain. If ownership is genuinely unclear, record it as unowned and flag it for the close step.

**Resolving questions in-conversation**: if the member raises something that can be answered by checking the repo, do so before logging it. If resolved, note it but do not add it as an action item.

### 6. Action Item Pass

After the conversation, review all action items mentioned. For each:

> "You mentioned [action item] — should we track this? Proposed owner: [Name]."

Offer once per item. If the Backlog module is not enabled, skip this pass entirely and note that action items will appear in the retro summary.

### 7. Write the Input File

Preview the member input file and ask for confirmation. The member may request corrections.

Write to `team/retros/<retro-id>/<member-slug>.md` using the format in `fabric-retro.md`.

Update the member's row in `retro.md`'s `## Participants` table from `Pending` to `Submitted`.

### 8. Close

Confirm the files were written. Let the member know who else has submitted (without revealing their content):

> "Submitted. So far: [submitted names]. Still pending: [pending names]."

---

## `/retro narrative`

Same flow as Q&A mode with one change in step 5:

Open with a brief orientation:

> "Narrative mode — go ahead and share your thoughts on this period: what worked, what didn't, and what you'd change. You can speak freely; I'll follow up on anything I need to clarify.
>
> **Tip:** Your OS has built-in dictation you can use to speak rather than type:
> - **macOS**: Press Fn twice (or Fn+D on some keyboards) to start dictation
> - **Windows**: Press Win+H to open voice typing
> - **iOS/Android**: Tap the microphone on your keyboard
>
> Paste or type your narrative when ready."

After receiving the narrative:

1. Digest silently — identify what's covered across each retro question.
2. Call out what was clear and what was missing:
   > "Got it. I have a clear picture of what went well and your improvement ideas. I didn't catch much on what didn't go well — anything worth noting there?"
3. Ask follow-up questions only for genuine gaps.
4. Still run the prior action item follow-up if context warrants it.

Proceed to steps 6–8 as normal.

---

## `/retro review [retro-id]`

### 1. Resolve the Target Retro

- If a retro-id is given: load `team/retros/<retro-id>/retro.md`.
- If not: scan for `Status: Open`. If one open retro, use it. If multiple, ask. If none, list recent closed retros and ask which to review.

### 2. Show Participation Status

Display the retro header (period, iteration if set) and the participation table from `retro.md`.

```
Retro: retro-sprint-5-260404  |  Period: 2026-03-18 to 2026-04-01
Status: Open

Participants:
  ✓ Priya Patel        (submitted 2026-04-02)
  ✓ Marcus Chen        (submitted 2026-04-03)
  ○ Dana Torres        (pending)
  ○ Jordan Wells       (pending)
```

### 3. Offer to Show Inputs

> "Want to see a summary of what's been submitted so far?"

- If yes: read all submitted member input files and present a brief, unattributed theme digest — group by question area, note how many members mentioned each theme. Do not attribute specific comments to specific members.
- If the retro is closed: show the full `summary.md` instead.

---

## `/retro report [retro-id]`

Generates the team synthesis draft to `output/` ahead of the team review meeting. Members should have submitted their input before this is run. The draft is the artifact the team works through together — filling in how each point will be addressed before closing.

### 1. Resolve the Target Retro

Same resolution logic as `/retro review`. Must be an Open retro.

### 2. Check Participation

Load the participant table from `retro.md`. If members are still pending:

> "Still pending: [names]. Generate the report anyway, or wait for their input?"

If the user waits: stop here. If they proceed: note missing members in the draft.

### 3. Generate the Draft

Invoke the `retro-report` skill. Pass it the retro folder path. The skill returns the synthesized content with addressal placeholder sections.

### 4. Write the Draft

Write to `output/retro-<retro-id>.md`. If a draft already exists, ask whether to overwrite it.

Confirm the file was written:

> "Report ready at `output/retro-<retro-id>.md`. Review it as a team, fill in how each point will be addressed, then run `/retro close` to finalize."

---

## `/retro close [retro-id]`

Finalizes the retro from the annotated draft. Expects `output/retro-<retro-id>.md` to exist and have been reviewed. Run this after the team has worked through the draft.

### 1. Resolve the Target Retro

Same resolution logic as `/retro review`. Must be an Open retro.

### 2. Load the Annotated Draft

Check that `output/retro-<retro-id>.md` exists.

- **Exists**: proceed.
- **Not found**: suggest running `/retro report` first to generate the draft:
  > "No draft found at `output/retro-<retro-id>.md`. Run `/retro report` to generate it, review it as a team, then come back to close."

### 3. Review Addressal Completeness

Read the draft. Check whether the addressal sections have been filled in:

- **All filled**: proceed.
- **Some unfilled**: list the gaps and ask:
  > "A few sections haven't been addressed yet: [list]. Close anyway, or fill those in first?"
- If the user wants help: assist inline — read each unfilled theme or action item and ask how it was resolved. Update the draft. Then confirm to proceed.

### 4. Finalize

Write `team/retros/<retro-id>/summary.md` from the annotated draft.

Update `retro.md`:
- Change `Status: Open` to `Status: Closed`
- Add `Closed: YYYY-MM-DD`

### 5. Action Item Routing

If the Backlog module is enabled, offer to route unchecked action items to the backlog inbox:

> "There are [N] open action items. Want to add them to the backlog inbox?"

- If yes (all): create an inbox item for each.
- If selective: offer each item individually.
- Each inbox item written to `team/backlog/inbox/YYYY-MM-DD-retro-<retro-id>-<slug>.md`. Pre-populate title, source (`retro <retro-id>`), and proposed owner.
- Do not write without explicit confirmation.

### 6. Close

> "Retro closed. Summary at `team/retros/<retro-id>/summary.md`."

---

## Notes

- Writes to: `team/retros/<retro-id>/retro.md`, `team/retros/<retro-id>/<member-slug>.md`, `output/retro-<retro-id>.md` (draft), `team/retros/<retro-id>/summary.md` (on close), `team/backlog/inbox/` (if approved).
- The `output/` directory is gitignored (local only). The draft is a working artifact — the finalized `summary.md` in the retro folder is the committed record.
- No meta mode required.
- Aim for 10–15 minutes per member input session. Keep tone constructive — retros surface process problems, not people problems.
