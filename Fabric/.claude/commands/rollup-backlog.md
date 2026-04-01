# /rollup-backlog — Refresh Child Summary Sections

## Purpose
Regenerate Child Summary sections on epics and features to reflect current child entity state.

## Usage
- `/rollup-backlog E-001` — scan a specific epic or feature node
- `/rollup-backlog ehr-pipeline-modernization` — target by folder slug
- `/rollup-backlog` — scan all epics, surface which ones have stale rollups, let user pick which to update
- `/rollup-backlog E-001 --deep` — rollup features under the epic first, then rollup the epic itself (bottom-up)

## Behavior

1. **Resolve the target.**
   - If a target is provided, locate the entity directory. Search `backlog/epics/` and feature subdirectories for matching entity IDs or folder slugs.
   - If not found, ask the user to clarify.
   - If no target is provided, scan all epic directories under `backlog/epics/`. For each, check whether a Child Summary section exists and whether it appears stale (missing children, different child count than subdirectories). Present the list and let the user pick which to update.

2. **Scan children.**
   - List all direct child directories of the target entity.
   - For each child, read the entity file header (everything before the first `##` section) to extract: name (from `# ` title), state, and level.
   - For features: count work item subdirectories and sum estimated hours from task files (if present) for the sizing signal.
   - For epics: count feature subdirectories and note their states.
   - **Label collection (always deep):** Regardless of whether `--deep` is set, traverse *all* descendants (not just direct children) and collect every `Labels:` property value found. Parse each `key=value` pair and aggregate by key with occurrence counts. For boolean keys, count only `true` occurrences.

3. **Compare against existing Child Summary.**
   - If the entity has a `## Child Summary` section, compare the scanned state against it.
   - Identify: new children not in the summary, children whose state changed, children that were removed, estimation changes.
   - If no Child Summary section exists, generate one from scratch.

4. **If `--deep` flag is set:**
   - Process bottom-up: first rollup each child feature's Child Summary (scanning their work items), then rollup the epic's Child Summary (using the freshly updated feature summaries).

5. **Propose updates.**
   - Show the proposed Child Summary section with changes highlighted.
   - Wait for confirmation before writing.

6. **Write on confirmation.**
   - Replace the existing `## Child Summary` section or insert it after the last existing section (before `## Context Log` if present).
   - Update the `Last updated` date to today.
   - If any descendants have labels, include a `Labels (rolled up)` line in the Child Summary. Keys are separated by semicolons. Values within a key are comma-separated with counts in parentheses. Boolean keys show only the `true` count. Omit the line entirely if no descendants have labels. Example format:

     ```text
     - Labels (rolled up): service-type: data-extraction (5), reporting (2); security-sensitive: true (3)
     ```

## Notes

- Requires meta mode (modifies structural entity files).
- The rollup logic is implemented in the entity-maintenance skill. This command handles target resolution, scan orchestration, and the `--deep` flag.
