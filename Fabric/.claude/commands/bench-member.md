# /bench-member - Bench a Team Member

## Purpose
Set a member's status to Benched. The profile and all context log references are preserved. The member is removed from active capacity calculations and staffing suggestions.

## Prerequisites
- Meta mode must be active.

## Behavior

1. Accept a member name (fuzzy match against existing profiles).

2. Confirm the action: "Bench [name]? They will be excluded from capacity calculations and staffing suggestions. Their profile and all context references will be preserved."

3. Update the member's profile:
   - Set Status: Benched
   - Append to their context log: "[date] - Status changed to Benched. [reason if provided]"

4. Update team/team.md:
   - Mark the member's row or move to a Benched section
   - Recalculate Total Effective Capacity

5. Present changes for confirmation before writing.

## Notes
- Benching is reversible via /activate-member.
- The AI should never suggest removing or deleting a member. Benching is the correct action.
- Context log entries that reference a benched member remain valid and unchanged.
