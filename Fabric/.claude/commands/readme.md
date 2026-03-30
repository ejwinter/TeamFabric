# /readme - Regenerate Human-Readable README

## Purpose
Generate a clean, human-readable README.md from the current state of all structural files. This is a generated artifact, not a maintained document.

## Behavior

1. Read all source files:
   - AGENT.md (constitution)
   - team/team.md (team facts)
   - team/members/*/profile.md (all member profiles)
   - Module docs (requests/REQUESTS.md, etc.)

2. Generate README.md at the repository root containing:
   - Team name and mission
   - What this repository is (brief Fabric explanation)
   - Team members with roles and key functions
   - Products and services overview
   - How requests work (plain-language summary of the intake process)
   - Where to find things (knowledge repositories)
   - How to communicate with the team

3. Write in a natural, welcoming tone suitable for someone encountering the team for the first time. No markdown tables unless they genuinely aid readability. Prose over structure.

4. Include a footer: "Generated from Fabric on [date]. Run /readme to regenerate."

## Notes
- Does NOT require meta mode (README.md is a generated output, not a structural file).
- Overwrites any existing README.md without warning (it's always regenerated, never edited).
- Should not include internal details like behavioral rules, nudge configurations, or AI constraints.
