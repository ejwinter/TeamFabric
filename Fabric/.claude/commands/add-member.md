# /add-member - Add a New Team Member

## Purpose
Guided creation of a new member profile.

## Prerequisites
- Meta mode must be active. If not, prompt the user to enter meta mode first.

## Behavior

1. Collect member information:
   - Name
   - Role / title
   - Team function (one-line summary of what they do for this team)
   - Allocation (% of 1 FTE dedicated to this team)
   - Email (must match their `git config user.email` for identity resolution)
   - Responsibilities (list)
   - Expertise / specialties (list)

2. Generate the profile:
   - Create directory: team/members/<name-slug>/
   - Create profile.md with Status: Active

3. Update team/team.md:
   - Add row to Members table
   - Recalculate Total Effective Capacity

4. Present changes for confirmation before writing.

## Template
Use team/members/template/profile.md as the starting point for new profiles. The template directory is not a real member and should be excluded from member scans, capacity calculations, and identity resolution.

## Slug Convention
Member directory names use lowercase hyphenated full names: `jag-balan`, `eric-winter`.

## Valid Status Values
- Active: contributing member, included in capacity calculations
- Benched: inactive but preserved, excluded from capacity calculations
- Onboarding: new member in setup, included in capacity at stated allocation
