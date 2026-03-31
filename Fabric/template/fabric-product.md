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

The product file is the primary — and sometimes only — representation of a product in Fabric. It should be detailed enough that Fabric can answer questions about the product without digging into external code or content unless explicitly asked.

```markdown
# Product Name
Status: Active | Sunset | Planned
Owners: [email addresses of team members who primarily own this product]
Repository: [optional — git remote URL]

## Status
[2-3 sentence current state, last updated date]

## Description
[what this product is and does; scope and system boundary]

## Interactions
[how this product interacts with other products or external systems]

## Stakeholders
- [person or group — their interest in this product]

## Fabric Instructions
[special instructions for how Fabric should work with this product]

## Context Log
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference]
```

### Key Fields

- **Status** (header): Active, Sunset, Planned — lifecycle stage.
- **Owners**: Email addresses of the team members primarily responsible for this product. Multiple owners are comma-separated. Email format allows cross-referencing member profiles.
- **Repository**: Optional. Git remote URL. When set, the repo is expected as a sibling folder next to this Fabric instance, named after the repo (e.g. `https://github.com/org/portal-api` → `../portal-api`). Teams are responsible for keeping that clone present.
- **## Status**: Current state narrative — 2-3 sentences, include last updated date.
- **## Description**: What the product is, what it does, and where its scope and system boundary lies.
- **## Interactions**: How this product interacts with other products or external systems. Helps Fabric understand cross-product context when ingesting or querying.
- **## Stakeholders**: List of people or groups with an interest in this product and what that interest is.
- **## Fabric Instructions**: Team-specified guidance for how Fabric should behave when working with this product — e.g. "always check the backlog before suggesting new work" or "this product has a separate on-call rotation."
- **## Context Log**: Append-only breadcrumb trail of strategic-level events — stakeholder decisions, roadmap changes, competitive context. Not for tactical work details.

## Behavioral Rules

- Product files are structural entities protected by meta mode.
- When ingesting content that mentions a product, check if a product entity exists. If not, suggest creating one.
- Before working with a product, read its `## Fabric Instructions` section if present and apply any product-specific guidance for that session.
- Product context logs capture strategic-level information. Tactical work details belong on backlog entities (if Backlog module is enabled) or request entities (if Triage module is enabled).
- When a product has a `Repository` set and the user asks to look at or reference code, check for a sibling folder matching the repo name (e.g. `../portal-api`). If the folder is absent, note that the repo isn't cloned locally rather than failing silently.
- `Owners` contains email addresses. Cross-reference against member profiles in `team/members/` to resolve names and roles.

## Relationship to Backlog

Products and backlog are independent modules. When both are enabled, backlog epics reference products through a `Products:` field (e.g., `Products: Portal, Data Pipeline`). This supports many-to-many relationships — an epic can span multiple products.
