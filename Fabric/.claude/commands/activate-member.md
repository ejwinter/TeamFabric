# /activate-member - Restore a Benched Member

## Purpose
Restore a benched member to Active status.

## Prerequisites
- Meta mode must be active.

## Behavior

1. Accept a member name (fuzzy match, filtered to Benched members).
   - If no benched members exist, inform the user.

2. Optionally update allocation if it has changed since benching.

3. Update the member's profile:
   - Set Status: Active
   - Update Allocation if changed
   - Append to context log: "[date] - Status changed to Active. [allocation note if changed]"

4. Update team/team.md:
   - Restore the member's row to the active members table
   - Recalculate Total Effective Capacity

5. Present changes for confirmation before writing.
