# Retro Input — Priya Patel — retro-sprint-1-260318

Submitted: 2026-04-01

## What went well this period?

- Census event stream work moved smoothly once the Kafka topic naming was locked down. Coordinating with Marcus on that early was worth it.
- The analytics team gave me clear requirements for the department KPI feed this time — less back-and-forth than usual. Their new data requirements template helped.
- Tableau data source optimization for the census dashboard had a bigger impact than I expected. The dashboard refresh time dropped significantly and the analytics team noticed.

## What didn't go well or felt harder than it should have?

- The census aggregation service had an undocumented dependency on a field in the ADT feed that Marcus is still working on. I was blocked for most of Wednesday waiting to understand whether the field would be stable. This wasn't visible in planning.
- I didn't know Leo was having a rough on-call week until he mentioned it in standup on Thursday. If I'd known earlier I might have pulled in a simpler task to give him a hand.
- The `lineage-metadata-model` work item has a dependency on the census stream that I don't think we've fully scoped. It's going to create a conflict in the next sprint.

## What should we change or improve going forward?

- Cross-item dependencies need to be explicit in the work items, not just understood informally. If my census work depends on an ADT field, that should be in "Items this depends on."
- Some kind of lightweight visibility on on-call load during the sprint — even just Leo flagging in standup "I'm having a heavy on-call day" — so the team can rebalance if needed.

## Action Items

- Add cross-item dependencies to census stream and lineage metadata model work items. Owner: Priya
- Sync with Marcus on the lineage-metadata-model/census stream conflict before next sprint planning. Owner: Priya + Marcus
