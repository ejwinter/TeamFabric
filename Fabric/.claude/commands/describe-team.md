# /describe-team - Synthesize Team Description

## Purpose
Read all Fabric sources and produce a narrative description of the team. Optionally tailored to a specific audience. Surfaces inconsistencies, gaps, or staleness detected during synthesis.

## Usage
- `/describe-team` - general-purpose summary with issues appended
- `/describe-team for leadership` - concise capabilities pitch
- `/describe-team for collaborator` - what a potential research partner needs to know
- `/describe-team for onboarding` - full walkthrough for a new team member

## Behavior

1. Load all sources:
   - AGENT.md
   - team/team.md
   - All member profiles (active and benched)
   - Module docs (requests/REQUESTS.md, etc.)
   - Current engagement and request counts if available

2. Synthesize a coherent narrative covering:
   - What the team does and why
   - Who is on the team and what each person brings
   - Current capacity and workload
   - How work comes in (request process)
   - Products and services
   - How the team communicates

3. Tailor depth and tone to the audience hint if provided.

4. Append an "Observations" section noting any issues detected:
   - Inconsistencies between sources (e.g., profile says one thing, team.md says another)
   - Missing or incomplete data (empty TODO fields, missing profiles)
   - Capacity mismatches (member allocation vs. engagement assignments)
   - Stale data (summaries that predate recent context log entries)
   - Structural gaps (referenced files that don't exist)

## Notes
- This is a read-only operation. It does not modify any files.
- Output is conversational, not a file. If the user wants a saved version, suggest /readme or offer to write it to a file.
- The observations section is the "audit" value of this command. Don't skip it even if no audience hint is given.
