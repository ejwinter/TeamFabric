# Fabric Integration Tips

These patterns help engineering teams connect their product repos to a Fabric instance so they can pick up where Fabric's backlog breakdown left off — turning acceptance criteria into implementation plans without bringing Fabric into the product repo's internals.

---

## Pattern 1 — Make your product repo Fabric-aware

Add a convention line to your product repo's `CLAUDE.md` that tells Claude Code where to find the Fabric instance. The recommended convention is a sibling folder:

~~~markdown
## Team Fabric

Our team uses [Fabric](https://github.com/your-org/team-fabric) — a file-based working memory system — to manage our backlog. The Fabric instance is at `../team-fabric`.

Work is organized as:

```
backlog/
  epics/<epic-id>/
    epic.md
    features/<feature-id>/
      feature.md
      workitems/<workitem-id>/
        workitem.md
```

When planning implementation work, read the relevant work item from the Fabric backlog. The `## Acceptance Criteria` section defines scope.
~~~

Any path works, but the sibling convention means every engineer on the team can use the same line verbatim without customization.

This is the only setup required. Claude Code can navigate relative paths and read markdown files across repos.

---

## Pattern 2 — The handoff model

Fabric and your product repo have complementary scopes:

| Layer | Owned by | Contains |
|-------|----------|----------|
| What & Why | Fabric | Epics, features, work items, acceptance criteria, business context |
| How | Product repo | Technical specs, implementation plans, code, tests |

Engineers pick up where Fabric's backlog breakdown ends. A work item's `## Acceptance Criteria` section defines what done looks like — without prescribing how the implementation should work. That boundary is the handoff point.

No changes to Fabric are needed for this model to work.

---

## Pattern 3 — Pull a Fabric story into Backlog.md

**Prerequisite:** [Backlog.md](https://backlog.md) initialized in your product repo (`backlog init`).

Use a single prompt to kick off the workflow:

> "Pull in `../team-fabric/backlog/epics/<epic-id>/features/<feature-id>/workitems/<workitem-id>/workitem.md` as a Backlog.md task and start planning an implementation."

Claude will:

1. Read the Fabric work item — title, description, and acceptance criteria
2. Create a Backlog.md task, mapping fields:
   - Fabric `# Title` → task `title`
   - Fabric `## Description` → task body
   - Fabric `## Acceptance Criteria` → `acceptance criteria` frontmatter list
   - Fabric `External URL` → carried over if present (preserves traceability to ADO, Jira, etc.)
3. Begin implementation planning — using the acceptance criteria as the scope boundary

The Backlog.md task becomes the working document for the engineer. The Fabric work item is the source of truth for scope; the product repo task is the source of truth for how.

---

## Pattern 4 — Keeping Fabric current

Since the Fabric path is reachable from your product repo session, you can edit Fabric work items directly as your understanding evolves — refining acceptance criteria as you learn more during implementation, or closing the work item when the feature ships.

**Remember:** Fabric is its own git repository. Changes made to Fabric files during a product repo session need to be committed there separately:

```bash
cd ../team-fabric
git add backlog/...
git commit -m "close: <work item title>"
```

This keeps the Fabric story current without requiring a separate context switch.

---

## Pattern 5 — Install auto-triggering skills in your product repo

The patterns above are intentional: you explicitly ask Claude to read a work item. Pattern 5 goes
ambient — install a skill that auto-triggers whenever you casually mention Fabric, a backlog entity,
or an entity ID during a coding session.

TeamFabric ships ready-made skills for this in `product-repo-skills/`. Copy what you want into
your product repo's `.claude/skills/` directory:

```bash
# From the TeamFabric source repo
cp -r product-repo-skills/fabric-aware /path/to/your-product-repo/.claude/skills/
```

### The `fabric-aware` skill

`fabric-aware` is an ambient context skill. It triggers automatically when you mention Fabric,
backlog, work items, stories, features, epics, acceptance criteria, or a backlog entity ID
(pattern: `word-word-YYMMDD`) — without you having to explicitly invoke a command.

**What it does:**
- Locates your Fabric instance via `.claude/fabric-link.md` (see below) or the sibling-directory convention
- Uses the backlog index for fast entity lookup
- Surfaces the right sections based on what you asked: AC for scope, Description + spec for approach, Open Questions when asking what's unresolved
- Surfaces team constraints once per entity per session (blockers, security labels, hard constraints from the Fabric CLAUDE.md)
- Checks for `spec.md` alongside work items (forward-compatible with the SpecDriven module)
- Offers to write context log entries mid-implementation — but never changes entity state (use `/fabric-backlog wrap` for that)

**Pointing it at your Fabric instance:**

By default the skill uses the sibling-directory convention. To use a custom path, create
`.claude/fabric-link.md` in your product repo:

```
Path: ../AcmeFabric
```

This file is the single source of truth for skills and for manual cross-repo reads — no
duplication needed.

**Example interactions:**

```
"What does the AC say about the retry endpoint?"
→ Finds the work item, surfaces relevant AC items annotated as in/out of scope.

"Is auto-expiry in scope for the auth refresh story?"
→ Loads the work item, checks AC for expiry — flags it if it belongs to a different item.

"I just found that the session format needs to change — worth logging?"
→ Proposes a context log entry on the work item.

"What open questions are still on the retry feature?"
→ Loads the feature, surfaces ## Open Questions.
```

This is the active counterpart to the static patterns above. Patterns 1–4 handle intentional
lookups and lifecycle ceremonies; `fabric-aware` handles ambient, conversational access during
implementation.
