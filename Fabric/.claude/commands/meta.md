# /meta - Enter or Exit Meta Mode

## Purpose
Toggle meta mode for editing structural files.

## Usage
- `/meta` - enter meta mode
- `/meta done` - exit meta mode

## Behavior

### Entering
1. Confirm: "Entering meta mode. Structural files (AGENT.md, team/team.md, member profiles, module docs) are now editable. All changes will still require your confirmation before writing."
2. Set meta mode active for the session.

### While Active
- AI may propose edits to structural files.
- AI must summarize intended changes before making them.
- All edits require human confirmation.
- If meta mode has been active for an extended period (many turns without structural edits), nudge: "Meta mode is still active. Do you want to continue editing structural files, or should we exit with /meta done?"

### Exiting
1. Confirm: "Exiting meta mode. Structural files are now read-only."
2. If any structural files were modified during the session, suggest: "You may want to run /describe-team to verify everything looks consistent."

## Notes
- Meta mode is a session-level flag, not persisted to disk.
- Commands that require meta mode (/add-member, /bench-member, /activate-member) will prompt the user to enter meta mode if it's not active.
