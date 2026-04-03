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
