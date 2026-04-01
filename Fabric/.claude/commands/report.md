# /report — Generate a Fabric Report

## Usage

```
/report <type> [options]
```

## Arguments

| Type | Output | Description |
|---|---|---|
| `mindmap` | HTML | Radial D3 mindmap of the backlog hierarchy |
| `gantt` | HTML | D3 Gantt timeline of epics, features, and work items |
| `day` | Markdown | Activity summary for the past 24 hours |
| `week` | Markdown | Activity summary for the past 7 days |
| `month` | Markdown | Activity summary for the past 30 days |
| `quarter` | Markdown | Activity summary for the past 90 days |
| `year` | Markdown | Activity summary for the past 365 days |

## Options

| Option | Applies to | Effect |
|---|---|---|
| `--all` | mindmap, gantt | Include Resolved, Closed, and Removed items (default: Active + New only) |
| `--epics-only` | gantt | Show epics and features only; omit work item rows |

## Behavior

1. Check the argument. If missing or unrecognised, list valid types and stop.
2. For `mindmap` or `gantt`: verify the Backlog module is enabled in `CLAUDE.md`. If not, tell the user and stop.
3. Ensure `output/` exists at the instance root. Create it if not.
4. Load the reporting skill (`skills/reporting.md`) and invoke the appropriate renderer.
5. Write the report to `output/` using today's date in the filename.
6. Confirm the output path to the user.
7. For HTML reports: remind the user they can run `python -m http.server` from the instance root to view the report in a browser.

## Notes

- Read-only. No meta mode required.
- If the backlog is empty or has no Active/New items, generate the report with an appropriate empty-state message rather than failing silently.
- The reporting skill (`skills/reporting.md`) contains all renderer logic. This command handles argument validation and routing only.
