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
   - For features: count work item subdirectories. If Effort Tracking is enabled, read each child work item's `Effort:` field. For work items without `Effort:`, recurse into their task children and sum task-level `Effort:` values (applying the short-circuit rule: if a task has `Effort:`, use it; otherwise it contributes 0). Flag partial coverage when some descendants are missing effort entirely.
   - For epics: count feature subdirectories and note their states. If Effort Tracking is enabled, read each child feature's `Effort:` field. For features without `Effort:`, recurse into their work item children and apply the same short-circuit rule.
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
   - If any descendants have labels, include a `Labels (rolled up)` line in the Child Summary. Keys are separated by semicolons. Values within a key are comma-separated (unique values only — no counts). Omit the line entirely if no descendants have labels. Example format:

     ```text
     - Labels (rolled up): service-type: data-extraction, reporting; security-sensitive: true
     ```

   If Effort Tracking is enabled, include an effort column in the Child Summary table and an effort total line below it:

     ```text
     | Feature | State | Effort |
     |---------|-------|--------|
     | F-001 Auth redesign | Closed | 32h |
     | F-002 Data pipeline | Active | 18h (partial) |
     | F-003 Reporting | New | — |

     - Effort (rolled up): 50h (1 feature pending)
     ```

   Column values:
   - `Xh` — entity has its own `Effort:` value or a complete subtree sum
   - `Xh (partial)` — subtree sum exists but some descendants have no effort
   - `—` — no effort anywhere in the subtree

   The total line's parenthetical counts direct children with no effort contribution. If Effort Tracking is disabled, omit the effort column and total line entirely.

## Notes

- Does not require meta mode. Child Summary sections are auto-maintained computed output, not structural decisions. (Structural mutations on epics and features — remove, rename, rescope — still require meta mode.)
- The rollup logic is implemented in the entity-maintenance skill. This command handles target resolution, scan orchestration, and the `--deep` flag.
