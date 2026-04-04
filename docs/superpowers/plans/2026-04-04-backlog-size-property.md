# Backlog Size Property Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `Size:` property to epics, features, and work items in the Backlog module for relative backlog sizing.

**Architecture:** Two identical edits to `fabric-backlog.md` — one in the template source and one in the deployed Example instance. Add `Size:` to the properties list of epic, feature, and work item, and add one behavioral rule prohibiting AI-inferred values.

**Tech Stack:** Markdown, git

---

## File Map

| File | Action |
|------|--------|
| `Fabric/template/fabric-backlog.md` | Add `Size:` to epic, feature, work item properties + behavioral rule |
| `Example/.claude/fabric-backlog.md` | Same edits (deployed instance copy) |

---

## Task 1: Add `Size:` to `Fabric/template/fabric-backlog.md`

**Files:**
- Modify: `Fabric/template/fabric-backlog.md`

- [ ] **Step 1: Add `Size:` to Epic properties**

Find the Epic properties block. It currently ends with:

```markdown
- Effort: [optional, direct hours at the epic level — planning, analysis, or coordination work not captured in child features]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

Insert `Size:` between `Priority:` and `Area:`:

```markdown
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
```

- [ ] **Step 2: Add `Size:` to Feature properties**

Find the Feature properties block. It currently has:

```markdown
- Priority: [optional 1(lowest)-5(highest)]
- Area: [optional area path representing a product or service line]
- Effort: [optional, direct hours at the feature level — refinement, design, or coordination work not captured in child work items; also used by teams that track at the feature level without breaking down further]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

Insert `Size:` between `Priority:` and `Area:`:

```markdown
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
```

- [ ] **Step 3: Add `Size:` to Work Item properties**

Find the Work Item properties block. It currently ends with:

```markdown
- Assigned to: [optional]
- Effort: [optional, direct hours at the work item level — review, coordination, or work not captured in child tasks; also used by teams that track at the work item level without breaking down further]
- Labels: [optional, comma-separated key=value pairs e.g. service-type=data-extraction]
```

Insert `Size:` between `Assigned to:` and `Effort:`:

```markdown
- Assigned to: [optional]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Effort: [optional, direct hours at the work item level — review, coordination, or work not captured in child tasks; also used by teams that track at the work item level without breaking down further]
```

- [ ] **Step 4: Add behavioral rule**

Find the `## Behavioral Rules` section (around line 212). Add the following as the second-to-last bullet (before the label suggestion rule):

```markdown
- `Size:` is a relative estimate for backlog prioritization. Do not infer or suggest values — only set it when the user provides one.
```

- [ ] **Step 5: Verify**

Read `Fabric/template/fabric-backlog.md` and confirm:
- `Size:` appears in epic, feature, and work item properties (3 occurrences)
- `Size:` does NOT appear in task properties
- The behavioral rule is present in `## Behavioral Rules`
- No occurrences of "TBD" or placeholder text

- [ ] **Step 6: Commit**

```bash
git add Fabric/template/fabric-backlog.md
git commit -m "add Size property to epic, feature, and work item"
```

---

## Task 2: Apply identical edits to `Example/.claude/fabric-backlog.md`

**Files:**
- Modify: `Example/.claude/fabric-backlog.md`

- [ ] **Step 1: Add `Size:` to Epic properties**

Find the Epic properties block. Insert `Size:` between `Priority:` and `Area:`:

```markdown
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
```

- [ ] **Step 2: Add `Size:` to Feature properties**

Insert `Size:` between `Priority:` and `Area:`:

```markdown
- Priority: [optional 1(lowest)-5(highest)]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Area: [optional area path representing a product or service line]
```

- [ ] **Step 3: Add `Size:` to Work Item properties**

Insert `Size:` between `Assigned to:` and `Effort:`:

```markdown
- Assigned to: [optional]
- Size: [optional, relative size estimate — any numeric value or ?. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from Effort and task hour fields.]
- Effort: [optional, direct hours at the work item level — review, coordination, or work not captured in child tasks; also used by teams that track at the work item level without breaking down further]
```

- [ ] **Step 4: Add behavioral rule**

Add to `## Behavioral Rules`:

```markdown
- `Size:` is a relative estimate for backlog prioritization. Do not infer or suggest values — only set it when the user provides one.
```

- [ ] **Step 5: Verify**

Read `Example/.claude/fabric-backlog.md` and confirm:
- `Size:` appears in epic, feature, and work item properties (3 occurrences)
- `Size:` does NOT appear in task properties
- The behavioral rule is present

- [ ] **Step 6: Commit**

```bash
git add Example/.claude/fabric-backlog.md
git commit -m "apply Size property to Example deployed backlog module"
```
