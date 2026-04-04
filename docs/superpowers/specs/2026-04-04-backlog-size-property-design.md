# Design: Backlog `Size` Property

**Date:** 2026-04-04  
**Status:** Approved  

---

## Overview

Add an optional `Size:` property to epics, features, and work items in the Backlog module. Size is a relative estimate used for backlog prioritization — distinct from `Effort` (actual hours recorded) and task-level `Estimated Hours` / `Remaining Hours` (planning fields).

---

## Property Definition

**Field:** `Size:`  
**Valid values:** Any numeric value, or `?` (unknown). Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced.  
**Required:** No — omit the field entirely when not set.  
**Applies to:** Epic, Feature, Work Item. Not applicable to Tasks (tasks use hour-based estimation).

---

## Changes to `fabric-backlog.md`

Add `Size: [optional]` to the Properties section of Epic, Feature, and Work Item, with this description:

> Relative size estimate. Any numeric value or `?`. Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is conventional but not enforced. Distinct from `Effort` (actual hours) and task hour fields.

Add one behavioral rule:

> `Size:` is a relative estimate for backlog prioritization. Do not infer or suggest values — only set it when the user provides one.

---

## Files Changed

| File | Action |
|------|--------|
| `Fabric/template/fabric-backlog.md` | Add `Size:` to epic, feature, and work item properties + behavioral rule |
| `Example/.claude/fabric-backlog.md` | Same (deployed instance copy) |
