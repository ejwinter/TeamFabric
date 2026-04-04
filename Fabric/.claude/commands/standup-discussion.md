# /standup-discussion — Daily Standup Conversation

## Usage

```
/standup-discussion [narrative]
```

| Mode | Behavior |
|------|----------|
| *(no argument)* | Q&A mode — agent asks questions across all standup areas |
| `narrative` | Narrative-first mode — member provides a free-form summary, agent follows up on gaps only |

## Behavior

### 1. Identify the Member

Attempt to resolve identity from `git config user.email` matched against `Email:` fields in `team/members/*/profile.md` (excluding `template/`).

- If matched: greet them by name and confirm ("Starting your standup, [Name] — is that right?")
- If not matched: ask which team member they are and let them select from the active member list.

### 2. Load Context (standup-context skill)

Invoke the `standup-context` skill before the conversation begins. It runs silently and returns:

- The member's profile (role, responsibilities, expertise)
- Their `discuss-yesterday.md` if it exists
- Active/In Progress backlog items assigned to them
- Products they are active on, with any recent git contributions detected in discoverable repos
- Any mentions of this member in `team/standup/standup-yesterday.md` (needs, questions directed at them, suggested sync pairings)

Use this context to arrive at the conversation informed. Do not recite it back.

### 3. Roll Over Yesterday's Record

Check whether `team/members/<name-slug>/discuss-today.md` exists and its date.

- **Prior date**: copy to `discuss-yesterday.md`, archive to `discuss-log/YYYY-MM-DD.md` (using the date from the file header). Say: "Rolling over your last standup to the log."
- **Today's date**: inform the member they've already run their standup today and ask whether to update it or start fresh.
- **No file**: proceed without rollover.

### 4. Run the Conversation

---

#### Q&A Mode (default)

Conduct a focused, conversational standup. Weave the areas below into natural dialogue — do not present them as a numbered list or form.

**Follow-ups from the team standup** *(if any were found in context)*

If the `standup-context` skill found mentions of this member in the prior team summary — a question directed at them, a sync pairing, or an unresolved blocker they were involved in — open with these before moving to new material.

> "In the last team standup, [Name] had a question for you about [X] — were you able to connect? Any update there?"

**Product contributions** *(if detected)*

If the context skill found git commits in a product repo since their last standup, surface them naturally:

> "It looks like you contributed to [Product] — want to include what you did there in yesterday's summary?"

**Yesterday** — What did they work on? Reference specific assigned items and any contributions from context. Ask how it went, not just what they did.

**Today** — What are they planning to work on? If they have assigned items, ask about priority and approach.

**Blockers** — Is anything slowing them down? Probe for specifics: what is blocked, what is the dependency, who owns it, is there an ETA? Encourage them to name blockers even if they seem minor.

**Needs & Questions** — Do they need input, a decision, a review, or help from a specific person? Do they have open questions the agent or a teammate might answer?

**Resolving questions in-conversation**: When a member raises something that might be answerable now, check the repo before logging it. If resolved, note it under "Resolved in Standup." If not, log it under "Needs & Questions" with enough context for others to respond.

---

#### Narrative Mode

Open with a brief orientation:

> "Narrative mode — go ahead and share what's on your mind about yesterday and today. You can speak freely; I'll follow up on anything I need to clarify.
>
> **Tip:** Your OS has built-in dictation you can use to speak rather than type:
> - **macOS**: Press Fn twice (or Fn+D on some keyboards) to start dictation
> - **Windows**: Press Win+H to open voice typing
> - **iOS/Android**: Tap the microphone on your keyboard
>
> Paste or type your narrative when ready."

After receiving the narrative:

1. Digest it silently — identify what is covered across yesterday / today / blockers / needs.
2. Call out what you could and could not extract:
   > "Got it. I have a clear picture of your today and blockers. I didn't catch much about yesterday — anything worth noting from the prior day?"
3. Ask follow-up questions only for genuine gaps. If the narrative is complete, skip directly to the end-of-conversation pass.
4. Still surface follow-ups from the team standup and product contributions if context warrants it.

---

### 5. End-of-Conversation: Backlog Note Pass

After the standup conversation wraps, review the full discussion for information worth capturing on a backlog item — discoveries, risks, decisions made, dependencies identified, approach changes. Do not flag routine status updates already captured in the standup record.

For each candidate item, offer once:

> "You mentioned [X] — should we add a note to a backlog item? [If yes: which item, or should I search?]"

- If the item is in context (assigned items): match directly and propose the specific item.
- If the member names an item: locate it by keyword search in `backlog/` and confirm before writing.
- If the member asks the agent to find it: search by keyword, propose the best match, confirm before writing.
- Notes are appended to a `## Notes` section on the entity (`- YYYY-MM-DD [standup]: [note]`). Create the section if absent.
- Do not change status, priority, or any other field — notes only.
- Do not write without explicit confirmation.

### 6. Write the Standup Record

Present a brief preview of `discuss-today.md` and ask for confirmation. The member may request corrections before the file is saved.

Write using the format in `fabric-standup.md`:
- Include today's date in the header.
- Omit "Resolved in Standup" and "Notes" sections if empty.
- Write "None" explicitly under Blockers if the member reported none.

### 7. Close

Confirm the file was written. If not all team members have checked in, mention it. Remind the member that the team summary can be generated with the `standup-report` skill.

## Notes

- Writes only to `team/members/<name-slug>/discuss-today.md`, `discuss-yesterday.md`, `discuss-log/`, and any backlog entity files the member explicitly approves.
- No meta mode required.
- Aim for 5–10 minutes. Keep the tone light — a standup, not an interrogation.
