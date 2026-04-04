# Retrospective Summary — Sprint 1 — 2026-04-03

> Period: 2026-03-18 to 2026-03-31  |  Iteration: 260318-260331
> Created by: Dana Torres  |  Closed: 2026-04-03
> Participants (4/4): Dana Torres, Marcus Chen, Priya Patel, Leo Kim
> All members contributed.

---

## What Went Well

### Early design alignment *(3 members)*
- The pre-implementation design doc for the Kafka consumer pattern surfaced edge cases early and made code review fast.
- Marcus and Priya coordinating directly on Kafka topic naming conventions before implementation prevented two conflicting patterns from landing in production.
- The shared design approach was explicitly called out by Dana and Marcus as something worth repeating.

**How addressed:** Adopted as a standing practice. Dana will add a note to the team working norms: for any new integration or shared infrastructure component, a short design doc is expected before implementation begins.

### Leo's on-call independence *(2 members)*
- Leo resolved both mid-sprint pipeline alerts without escalation — a concrete step up from the previous period.
- Proactive monitoring improvements from prior sprint work contributed to earlier detection.

**How addressed:** No action needed — recognize the growth. Will continue to give Leo well-scoped stretch tasks.

### Analytics team requirements quality *(1 member)*
- The analytics team's new data requirements template made Priya's KPI feed work smoother with less back-and-forth.

**How addressed:** Priya will mention this to the analytics team lead as positive feedback and encourage continued use of the template.

---

## What Didn't Go Well

### Code review bottleneck *(3 members)* *(first occurrence — watch for recurrence)*
- Dana is the only reviewer for production pipeline changes. Two PRs waited two full days due to an Epic support call conflict.
- Marcus experienced context-switching loss re-orienting to a returned PR after moving on to other work.
- Root cause: single reviewer policy doesn't match team's current throughput.

**How addressed:** Marcus added as co-reviewer for all EHR and Epic-adjacent PRs, effective immediately. Dana will document an informal 24-hour review SLA target in the team norms. If the bottleneck persists in Sprint 2, revisit expanding reviewer permissions more broadly.

### Epic API rate limiting (undocumented) *(2 members)*
- Team hit Clarity extract throttling limits mid-sprint with no internal documentation to reference.
- Marcus spent two days waiting on an Epic support response for information that should have been captured previously.
- Planning did not surface this risk for the FHIR extract work.

**How addressed:** Marcus will document Epic API rate limits, known unstable fields, and the deprecation schedule in Confluence by end of Sprint 2 (2026-04-14). Dana will add "document known API constraints" to the team's definition of done for all new upstream integration work items.

### On-call load invisible to the sprint *(3 members)*
- Leo lost close to a full day of sprint capacity to on-call pages without the team knowing until Thursday standup.
- Priya noted she might have pulled in a simpler task to help Leo if she'd known earlier.
- Sprint planning did not reserve capacity for on-call response.

**How addressed:** Leo will flag on-call load in daily standup — even a brief "heavy on-call day" is enough. Starting Sprint 2, we will reserve 20% of Leo's iteration capacity for on-call response (roughly 1 day per sprint). Dana to adjust Leo's assignments in the current sprint to reflect this.

### Cross-item dependencies not tracked *(2 members)*
- Priya was blocked on the census aggregation service because of an undocumented dependency on an ADT field Marcus was still building.
- The lineage-metadata-model work item has an unscoped dependency on the census stream that wasn't visible until Priya flagged it.

**How addressed:** Priya and Marcus will sync before Sprint 2 planning to map the lineage/census dependency and update both work items' "Items this depends on" sections. Going forward, dependency sections are expected to be filled in during refinement, not left blank.

### Knowledge discovery friction for Leo *(1 member)*
- Leo spent several hours on the Kafka consumer scaffold not knowing there was an established pattern to reference.

**How addressed:** Quick "is there prior art?" check with Marcus or Dana at task start is now an encouraged norm for Leo — not a formal gate, just a habit. Marcus will also ensure the consumer pattern is documented in the Confluence runbook as a reusable reference.

---

## Improvements

- **Add co-reviewer for EHR PRs** — proposed by: Dana, Marcus
  **Status:** Adopted — Marcus added as reviewer effective 2026-04-03.

- **24-hour informal PR review SLA** — proposed by: Marcus
  **Status:** Adopted — informal target, not enforced. Dana to document in team norms.

- **Reserve on-call buffer in sprint planning** — proposed by: Priya, Leo
  **Status:** Adopted — 20% of Leo's capacity reserved for on-call response in all future iterations.

- **Document API constraints as part of definition of done** — proposed by: Dana
  **Status:** Adopted — Dana to update team CLAUDE.md.

- **Known noisy alerts list in runbook** — proposed by: Leo
  **Status:** Adopted — Leo to create in Confluence with Marcus's input by 2026-04-10.

- **Keep a "ready to pull" backlog buffer** — proposed by: Dana
  **Status:** Deferred — good idea but needs backlog to be more fully refined first. Revisit after Sprint 2 planning.

---

## Action Items

- [x] Add Marcus as co-reviewer for EHR/Epic-adjacent PRs — Owner: Dana *(completed 2026-04-03)*
- [ ] Document Epic API rate limits and constraints in Confluence — Owner: Marcus *(due 2026-04-14)*
- [ ] Add "document API constraints" to definition of done in team CLAUDE.md — Owner: Dana *(due 2026-04-10)*
- [ ] Split `fhir-validation-suite` into smaller work items before Sprint 2 planning — Owner: Marcus *(due 2026-04-07)*
- [ ] Add cross-item dependencies to census stream and lineage metadata model work items — Owner: Priya *(due 2026-04-07)*
- [ ] Sync on lineage-metadata-model / census stream conflict before Sprint 2 planning — Owner: Priya + Marcus *(due 2026-04-07)*
- [ ] Create "known noisy alerts" list in Confluence runbook — Owner: Leo *(due 2026-04-10)*
- [ ] Reserve 20% on-call buffer in Leo's Sprint 2 assignments — Owner: Dana *(due 2026-04-07)*

---
*Generated by Fabric retro-report — 2026-04-03 14:22*
*Reviewed and annotated by the team — 2026-04-03*
