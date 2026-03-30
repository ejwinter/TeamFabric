# Skill: Identity Resolution

## Purpose
Determine which team member is using Fabric and load their context.

## When Used
At the start of every session, and whenever user-specific context is needed.

## Procedure

1. Run `git config user.email` to get the current user's email.

2. Scan member profiles in team/members/*/profile.md for a matching Email field.

3. If matched:
   - Load the member's profile into context.
   - Use their name, role, and responsibilities to tailor responses.
   - Note their allocation percentage for capacity-aware suggestions.
   - Example: If Jag is the active user, prioritize triage-related context. If Eric is active, lean toward infrastructure and tooling context.

4. If not matched:
   - Inform the user: "I couldn't match your git email ([email]) to a team member profile. You can use Fabric, but I won't be able to tailor context to your role."
   - Suggest: "If you're a new team member, ask someone with meta mode access to run /add-member."

## Notes
- Skip team/members/template/ — it is a profile template, not a real member.
- Email matching is case-insensitive.
- A benched member can still be identified but should see a note: "Your profile is currently set to Benched status."
- This skill runs implicitly. Do not ask the user to identify themselves.
