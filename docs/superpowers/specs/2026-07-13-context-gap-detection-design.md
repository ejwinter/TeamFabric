# Context Gap Detection — Design Spec

**Date:** 2026-07-13
**Issue:** TBD
**Status:** Draft

---

## Overview

Fabric can already tell you that an entity's summary may be **out of date** (staleness). It cannot tell you that an entity never had a **reason** in the first place.

This spec adds a second dirty flag — a *gap* flag — and wires gap detection into the three lifecycle moments where a human is already engaged: **ingest**, **refine**, and **transition to Active**.

### The problem

A well-written ticket is more dangerous than a badly-written one.

A ticket that says *"do the Riverdale thing"* announces its own insufficiency — someone goes and asks. A ticket with a clear title, a clean scope, and acceptance criteria carries every **surface signal** of a complete instruction. Nothing about it says anything is missing, so nobody asks the question that would recover what the summarizing destroyed.

**Completeness signals have come apart from actual completeness.** Formatting, structure, confidence, and acceptance criteria do not track whether the *why* survived, and all of them read as though they do. As AI makes polished, structured, complete-*looking* artifacts effortless to produce, this gets worse, not better.

### What this feature actually claims

Fabric **cannot** surface an unknown unknown. If the reasoning was never captured, it is not there, and no agent conjures it.

What Fabric can do is surface **that a gap exists** — converting an unknown unknown into a known one.

> **The agent does not answer the question. It tells you that you have one.**

The agent's advantage is not intelligence. It is **attention**: it has read the entire fabric, and no human has. Nobody has ninety minutes to read fourteen pages of meeting minutes against a backlog of forty items, and nobody ever will.

### Existing spec language this closes

`ingestion.md` already defines the context log entry format as:

> *"Summary: lean breadcrumb with **enough 'why' to answer follow-up questions**"*

The requirement is already specified. **Nothing verifies it.** This spec is the verification.

---

## Non-goals

- **Not a gate.** This never blocks. See the friction principle below.
- **Not a new skill.** Every hook is an extension of an existing skill.
- **Not a new command.** A command would be invoked only by people who already suspect something is missing — and not suspecting is the entire problem. This must be an implicit behavior.
- **Not autonomous.** Propose-and-confirm, as everywhere else in Fabric.

---

## Design principle: friction budget scales with commitment

Fabric's thesis is that **every barrier to intake is lost knowledge**. A check that makes `/ingest` more annoying is a check that reduces ingestion, which is a net loss no matter how good the check is.

So the friction budget is not uniform:

| Gate | Friction budget | Why |
|---|---|---|
| **Ingest** | **Near zero.** Never interrogate, never block, never ask a second question. | The user is dumping content. Any resistance here reduces intake. **And it's cheap anyway — the why is usually already *in* the content.** The agent extracts and proposes; the user confirms. They type nothing. |
| **Refine** | Moderate. | Already a deliberate session. *"Why does this exist?"* is native to refinement, and `backlog-refinement.md` already surfaces gaps by design. |
| **Transition → Active** | Highest tolerance. | Someone is about to commit weeks of work. One `⚠ … (yes / skip)` line is cheap against building the wrong thing. |

This mirrors the rule `entity-maintenance.md` already states: *"Staleness is a nudge, not a blocker."*

**Ingest is prevention. Transition is detection.** Catch it at ingest and the why is captured while the source is warm and the person who knows is present. Miss it there and later gates can only report the *absence* — they cannot recover the *content*. If only one hook ships, ship ingest.

---

## The gap flag

A sibling to the existing staleness marker, using the same machinery.

**Existing:**
```
Stale: yes (since YYYY-MM-DD, reason: [brief reason])
```

**New:**
```
Gaps: rationale (since YYYY-MM-DD)
Gaps: rationale, unlinked-context (since YYYY-MM-DD)
```

### Gap types

| Type | Meaning | Detection |
|---|---|---|
| `rationale` | The entity has no traceable *why* — no linked request, no linked decision, no rationale in the context log. | Structural. Cheap. No inference required. |
| `unlinked-context` | Content elsewhere in the fabric appears to relate to this entity and is not linked to it. | Entity/term overlap against ingested context. Inferential. |

**Rendering is the point.** An entity that displays `rationale: none recorded` **has stopped looking complete.** The uncanny valley closes by making *absence visible* — that is a schema-and-rendering change, not an AI problem.

---

## Hook 1 — Ingest (`ingestion.md`)

**Extension point:** the existing **Action Types** list (Append, Update, Conflict, Stale flag, Duplicate, New entity).

**Add a seventh action type:**

- **Gap** — the content supplies, or reveals the absence of, a rationale for an entity.

Two behaviors:

1. **Rationale capture (the high-value case).** When ingested content contains a *reason* for work that exists — a decision, a justification, a customer's stated need — propose attaching it as the entity's rationale, not merely as another context log line.

   > *"This email explains why the ordering API was phased. WI-1187 has no recorded rationale. Attach this as its rationale? (yes / no)"*

   The user types nothing. **The why was always in the content; it just never got linked to the work.**

2. **Gap flag.** If ingestion touches an entity that has no rationale and the content does not supply one, set `Gaps: rationale`. Silent — a flag, not a prompt. **Never interrupt an ingest to ask for a reason.**

---

## Hook 2 — Refine (`backlog-refinement.md`)

**Extension point:** the skill already runs two pressure-test passes (spec→AC, AC→spec) and already loads the parent chain and any linked request. The linkage machinery exists.

**Add a third pass: item → why.**

- If the entity has no rationale and none can be inherited from its parent chain or linked request, surface it as a refinement gap, in the same voice as the existing gap prompts:

  > *"This work item has no recorded rationale, and its parent feature doesn't supply one either. What problem is it solving?"*

- If `unlinked-context` is flagged, surface the candidates **with citations**:

  > *"R-102 and the 2026-06-14 steering minutes both reference the ordering API. Neither is linked to this epic. Link either? (R-102 / minutes / both / no)"*

Consistent with the skill's existing rule: *"Ask about what's missing, not what's already there."*

---

## Hook 3 — Transition to Active (`entity-transitions.md`)

**Extension point:** the New→Active path already runs pre-flight checks (blocker, open question, spec, dependency). The **spec check is already exactly this pattern**:

```
⚠ No spec found for this Story work item.
Create a spec now before activating? (yes / skip)
```

**Add a fifth pre-flight check — the rationale check:**

```
⚠ No recorded rationale for this item.
Nothing in the context log, no linked request, and the parent
feature doesn't supply one.

Record why we're doing this? (record / skip)
```

And where `unlinked-context` is flagged:

```
⚠ 2 items in the fabric appear related and aren't linked:
- R-102 (Readmission Risk Dashboard) — references the ordering API
- Steering minutes 2026-06-14 — decision on ordering API phasing

Review before activating? (review / skip)
```

**`/transition` guards the exit with Definition of Done. This guards the entrance — but as a nudge, not a gate.** `skip` always proceeds.

---

## Two rules

### 1. Never warn without a citation

| | |
|---|---|
| ✅ Structural fact | *"This item has no recorded rationale."* |
| ✅ Finding | *"R-102 and the June 14 minutes both reference the ordering API; neither is linked here."* |
| ❌ Noise | *"Have you considered whether you have enough context?"* |

One of those trains people to ignore the other two forever. **A gap warning must always name the thing.**

### 2. Make the override a capture

If a user skips the rationale check at transition, ask *why they're proceeding anyway* — and file **that** as the rationale.

> *"Skipping. Want to note why? (e.g. 'urgent Riverdale escalation, rationale to follow')"*

**The escape hatch becomes an intake channel.** A recorded *"we don't know why, Brandon asked for it"* is enormously more useful six months later than an empty field — and it is honest.

---

## Build order

1. **`rationale` gap flag + rendering.** Structural, cheap, no inference. Delivers most of the value: an entity that says `rationale: none recorded` no longer looks complete.
2. **Ingest rationale capture.** The highest-leverage hook — prevention, near-zero friction, and the why is already in the content.
3. **Transition rationale check.** Detection. The gate standing between a contextless item and someone's Tuesday.
4. **Refine item→why pass.**
5. **`unlinked-context` detection.** Inferential, most expensive, where the real magic is. Requires relevance matching against ingested content.

---

## Open questions

- **Where does rationale live?** A first-class field on the entity (`Rationale:`), or a typed context log entry? A first-class field is more visible and more checkable; a context log entry is more honest about provenance. **Leaning first-class field with a `Source:` pointer** — but this is the main open design question.
- **Rationale inheritance.** If a parent epic has a rationale, do its children inherit it, or is that exactly the compression that loses the why? Probably: **inheritance satisfies the check but is displayed as inherited**, so it is visible as thin.
- **`spec-sha` interaction.** `ingestion.md` carries `spec-sha` frontmatter with a fenced `<!-- spec:begin -->/<!-- spec:end -->` region. Any change to the spec'd region must go through the fingerprinting flow (see `feat/spec-sha-fingerprinting`).
- **Does `/check` also audit gaps?** `/check` handles reactive instance-wide auditing. A `--gaps` mode is a natural fit and costs little once the flag exists.

---

## Provenance

This design came out of writing the serialized business novel for the content series (`market/team/the-chain.md`) — the fiction surfaced a demand-side hole that the product roadmap had not: *making context retrievable does not help someone who does not know they have a question.*

The story→product loop working as intended.
