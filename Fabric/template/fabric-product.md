# TeamFabric Module: Product

<!--
  Framework-owned file. Do not edit directly.
  Updates to this file are applied by running /update from the TeamFabric repo.
-->

## Overview

The Product module tracks the cohesive components or deliverables a team owns. Products are often components of a larger platform. Each product gets a directory under `products/` with a `product.md` entity file.

## Directory Structure

```
products/
  <slug>/
    product.md                   # Product entity file
```

## Product Entity Structure

Products follow the standard Fabric layered entity structure:

```markdown
# Product Name
Status: Active | Sunset | Planned
Owner: [team member name]
Repository: [optional — relative path, git URL, or omit entirely]
Summary: [2-3 sentence current state, last updated date]

## Properties
Description: [what this product is and does]
Stakeholders: [who cares about this product]
Key Repositories: [optional — additional repos beyond the primary]

## Context Log
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference]
```

### Key Fields

- **Status**: Active, Sunset, Planned — reflects current lifecycle stage.
- **Owner**: The team member responsible for this product.
- **Repository**: Optional. The git remote URL for this product's source repo. When set, Fabric assumes the repo exists as a sibling folder next to this Fabric instance, named after the repo (e.g. a remote of `https://github.com/org/portal-api` is expected at `../portal-api`). Teams are responsible for keeping that clone present and up to date.
- **The `Repository` field is informational.** Fabric does not clone, sync, or validate the linked repo unless explicitly asked to look there.
- **Context Log**: Product-level strategic context — competitive info, stakeholder decisions, roadmap changes. Not tied to specific backlog items.

## Behavioral Rules

- Product files are structural entities protected by meta mode.
- When ingesting content that mentions a product, check if a product entity exists. If not, suggest creating one.
- Product context logs capture strategic-level information. Tactical work details belong on backlog entities (if Backlog module is enabled) or request entities (if Triage module is enabled).
- When a product has a `Repository` set and the user asks to look at or reference code, check for a sibling folder matching the repo name (e.g. `../portal-api`). If the folder is absent, note that the repo isn't cloned locally rather than failing silently.

## Relationship to Backlog

Products and backlog are independent modules. When both are enabled, backlog epics reference products through a `Products:` field (e.g., `Products: Portal, Data Pipeline`). This supports many-to-many relationships — an epic can span multiple products.
