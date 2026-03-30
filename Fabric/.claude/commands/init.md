# /init - First-Time Fabric Setup

## Purpose
Guided creation of the initial Fabric structure for a new team. This command is typically run once.

## Behavior

1. Check if Fabric is already initialized (AGENT.md and team/team.md exist).
   - If yes: warn the user and ask if they want to reinitialize (destructive) or abort.

2. Gather team information through a guided conversation:
   - Team name, parent organization, department
   - Mission statement (1-2 sentences)
   - Team members: for each, collect name, role, key function, allocation %, email
   - Products the team owns (name, status, brief description)
   - Knowledge repositories (where does stuff live today)
   - Communication norms (meeting cadence, channels, notification preferences)

3. Generate structural files:
   - AGENT.md (constitution with sensible defaults)
   - team/team.md (team facts)
   - team/members/<name>/profile.md (one per member)
   - requests/REQUESTS.md (request module doc, if Triage module enabled)
   - staging/README.md (staging directory marker)

4. Present the generated files for review before committing.

5. Suggest next steps:
   - "Review the constitution and adjust behavioral rules to match your team's preferences."
   - "Try /describe-team to see how the AI synthesizes your team's information."
   - "Start ingesting content with /ingest when you're ready."

## Notes
- This command does NOT require meta mode (it's creating the structure that meta mode protects).
- All generated content uses sensible defaults documented in the constitution.
- The user should review and refine the output, especially behavioral rules and notification preferences.
