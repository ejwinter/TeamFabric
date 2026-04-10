# /stakeholder - Stakeholder Lifecycle Management

## Purpose
Unified stakeholder lifecycle management — onboarding, profile updates, and departure.

## Usage

```
/stakeholder <subcommand> [args]
```

With no subcommand, list the available subcommands and one-line descriptions.

## Subcommands

| Subcommand | Description |
|---|---|
| add | Guided creation of a new stakeholder profile |
| depart [name] | Set a stakeholder's status to Departed |
| activate [name] | Restore a departed stakeholder to Active |

---

## /stakeholder add

### Purpose
Guided creation of a new stakeholder profile.

### Prerequisites
- Meta mode must be active. If not, prompt the user to enter meta mode first.

### Behavior

1. Collect stakeholder information:
   - Name
   - Role / title
   - Organization (their organization or team)
   - Summary (2-3 sentences describing their relationship to the team, influence, and priorities)
   - Areas of interest (list)
   - Expertise (list)
   - Communication preferences (how they prefer to receive updates — channel, frequency, detail level, tone)
   - Contact info: email (optional), preferred channel

2. Generate the profile:
   - Create directory: team/stakeholders/<name-slug>/
   - Create profile.md with Status: Active

3. Update team/team.md:
   - Add row to Stakeholders table

4. Present changes for confirmation before writing.

### Template
Use team/stakeholders/template/profile.md as the starting point for new profiles. The template directory is not a real stakeholder and should be excluded from stakeholder scans.

### Slug Convention
Stakeholder directory names use lowercase hyphenated full names: `theresa-blount`, `raj-mehta`.

### Valid Status Values
- Active: engaged stakeholder, surfaced in relevant communications and decisions
- Departed: inactive but preserved, excluded from active surfacing

---

## /stakeholder depart

### Purpose
Set a stakeholder's status to Departed. The profile and all context log references are preserved. The stakeholder is excluded from active surfacing in communications, escalations, and decision recommendations.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a stakeholder name (fuzzy match against existing profiles).

2. Confirm the action: "Mark [name] as Departed? They will be excluded from active surfacing in communications and decisions. Their profile and all context references will be preserved."

3. Update the stakeholder's profile:
   - Set Status: Departed
   - Write `Terminated: <today's date>` to the header fields.
   - Append to their context log: "- YYYY-MM-DD - /stakeholder depart: Status changed to Departed. [reason if provided]"

4. Update team/team.md:
   - Mark the stakeholder's row or move to a Departed section in the Stakeholders table

5. Present changes for confirmation before writing.

### Notes
- Departure is reversible via `/stakeholder activate`.
- The AI should never suggest removing or deleting a stakeholder. `/stakeholder depart` is the correct action.
- Context log entries that reference a departed stakeholder remain valid and unchanged.

---

## /stakeholder activate

### Purpose
Restore a departed stakeholder to Active status.

### Prerequisites
- Meta mode must be active.

### Behavior

1. Accept a stakeholder name (fuzzy match, filtered to Departed stakeholders).
   - If no departed stakeholders exist, inform the user.

2. Optionally update role, organization, or communication preferences if they have changed since departure.

3. Update the stakeholder's profile:
   - Set Status: Active
   - Remove the `Terminated:` line entirely from the header fields.
   - Update any changed fields
   - Append to context log: "- YYYY-MM-DD - /stakeholder activate: Status changed to Active. [notes if any]"

4. Update team/team.md:
   - Restore the stakeholder's row to the active Stakeholders table

5. Present changes for confirmation before writing.
