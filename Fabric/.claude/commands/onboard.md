# /onboard — New Member Orientation

## Purpose

Guide a new team member through a personalized orientation to the team's Fabric instance. Covers who the team is, how work flows, what the member is responsible for, and how to operate within Fabric day-to-day.

## Usage

- `/onboard` — orient the current user (resolved via git email)
- `/onboard [name]` — orient a specific member by name (useful when a team lead runs it on behalf of someone)

## Behavior

### Step 1 — Identify the member

Resolve the target member:
- If no argument: match `git config user.email` against member profiles.
- If a name argument is provided: find the matching profile in `team/members/`. If ambiguous, ask for clarification.

**If no matching profile is found**, do not proceed with orientation. Instead:

1. Check `team/team.md` for a `## Stakeholders` or team leads section and identify who the team leads are.
2. Tell the user:

   > "I don't have a profile for you yet — a team lead needs to set one up before we can run your orientation. You can ask [name(s)] to run `/add-member` to get you added.
   >
   > Once your profile is created, come back and run `/onboard` again."

3. If no team lead can be identified from `team.md`, give the general guidance:

   > "I don't have a profile for you yet. Ask your team lead to run `/add-member` in this Fabric instance to set up your profile, then run `/onboard` again."

4. Stop — do not attempt a generic orientation without a profile.

If the member's profile has `Status: Onboarding`, note this and proceed. If the profile has any other status, confirm with the user that an onboarding orientation is intended before continuing.

### Step 2 — Load sources

Read the following before generating any output:

- `CLAUDE.md` — constitution: How We Work, Constraints, Knowledge Repositories, Notification Rules, enabled modules, label schema
- `team/team.md` — mission, org context, stakeholders
- The member's own profile — role, responsibilities, expertise, allocation, assignments
- All other active member profiles — teammates, their roles and functions
- `requests/REQUESTS.md` — if Triage module is enabled
- `products/` — all product files, if Product module is enabled
- Active epics and their assigned work items — if Backlog module is enabled, scan for items assigned to this member

### Step 3 — Deliver orientation

Present orientation in clearly labelled sections. Keep each section concise — this is a starting point, not a complete knowledge dump. The member can ask follow-up questions.

#### The Team
- Team name, parent organization, mission statement
- What the team does and why it matters
- Where this team sits in the broader organization

#### Your Role
- The member's role, allocation, and primary responsibilities as described in their profile
- How their function fits into the team's work
- Who their closest collaborators are likely to be (based on team function overlap)

#### Your Teammates
- Brief one-liner per active teammate: name, role, and what they own
- Note anyone currently benched

#### How Work Flows
- Summarize the request intake and triage process if Triage is enabled (how requests come in, what the evaluation stages are, what a decision looks like)
- Summarize the backlog structure if Backlog is enabled (Epic → Feature → Work Item → Task, how items get created and refined)
- Note the standup process if Standup is enabled

#### How We Work
- Key standing decisions from the constitution: norms, tools, techniques, constraints
- Label schema if defined — what labels exist and when to apply them
- Notification rules if defined
- Iteration/sprint setup if configured

#### Products We Own
- Brief summary of each product: what it is, its status, and who owns it
- Omit if Product module is not enabled

#### Your Current Work
- List any backlog work items or tasks assigned to this member
- List any active requests assigned to this member if Triage is enabled
- If nothing is assigned yet, say so and suggest running `/status` and `/refine` to get oriented to the active backlog

#### Getting Started with Fabric
- Key commands they'll use day-to-day (tailored to enabled modules):
  - `/ingest` — how to bring in content
  - `/standup-discussion` — if Standup is enabled
  - `/refine` — if Backlog is enabled
  - `/evaluate-request` — if Triage is enabled
  - `/status` — quick team snapshot
- How to ask Fabric questions conversationally (no command needed)
- How to flag if something in the instance looks wrong or outdated

### Step 4 — Invite questions

Close with:

> "That's a quick tour of how the team works and where you fit in. What questions do you have? I can go deeper on any area, pull up specific backlog items, or walk through a request together."

Remain in conversation — follow-up questions are the expected and valuable part of this flow.

### Step 5 — Update profile status (optional)

If the member's profile `Status` is `Onboarding`, offer to update it to `Active` at the close of the session:

> "When you're ready, I can update your profile status from Onboarding to Active. Just say the word."

Do not update the status without explicit confirmation. This requires meta mode — prompt for it if not already active.

## Notes

- Read-only until Step 5. No meta mode required unless updating profile status.
- This command is personalized — the orientation is shaped by the specific member's role and assignments, not a generic team overview.
- `/describe-team for onboarding` is a complementary view if the member wants a more narrative team portrait after orientation.
