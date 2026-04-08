# LinkedIn Article 2

**Title:** What working memory means for software teams — and why it matters more as teams grow

**Target audience:** PMs, engineering managers, team leads
**Tone:** Practitioner voice. Conceptual, not promotional.

---

In cognitive psychology, working memory is the system that holds and manipulates information you're actively using — as opposed to long-term memory, which stores things for later recall.

Most teams don't have working memory. They have archives.

**The archive problem**

When teams document things, they tend to document finished work — decisions after they've been made, features after they've shipped, retrospectives after the sprint closes. This is long-term memory: useful for looking back, but not for operating in the present.

Working memory is different. It's the current state of things: what's in flight, what's blocked, what changed last week, who said what in Tuesday's meeting. It's the context you need to pick up work without a briefing, answer a question without a meeting, and make a decision without relitigating the last one.

The gap between "what the team knows" and "what's written down anywhere current" is the working memory deficit. Every team has one. Larger teams have larger ones.

**Why it compounds as teams grow**

On a three-person team, the working memory lives in people's heads and gets shared naturally — you're in the same room, working on the same things, and context transfers through proximity.

Scale to ten people, and the informal transfer breaks down. You're not in the same room. You're not working on the same things. Someone's context about why a decision was made three months ago doesn't naturally make it to the person who needs it today.

Knowledge becomes siloed. Not because anyone is hoarding it — because the cost of sharing it continuously exceeds what people can reasonably do on top of their actual work.

**What a working memory system looks like**

A working memory system for a team has a few properties:

It captures the current state of things, not just the historical record. Entities (projects, requests, decisions, people) have live status fields that reflect what's true now — not what was true at the last formal update.

It's structured, so it can be queried. "What's blocked?" has a different answer than "what changed last week?" A system that can answer both correctly is structured enough for an AI to reason across.

It's maintained at near-zero cost. If the cost of keeping it current is meaningful, it won't stay current. This is the part most systems get wrong.

The AI piece is what makes the last property achievable. When the AI handles classification, summarization, and filing — with human confirmation before anything is stored — the cost of an update becomes a brief conversation rather than a documentation session.

**The PM perspective**

I've managed projects for 20 years. The working memory problem isn't new — we've had versions of it since long before AI. Standups exist partly to refresh distributed working memory. Status reports exist because the working memory isn't written down anywhere. Onboarding takes so long because the new team member has to build working memory from scratch.

What's new is that the economics of maintaining a structured working memory system have changed. The AI absorbs the work that previously exceeded what teams could sustain.

That's the shift I think is underappreciated.

---

*I've been building a framework called TeamFabric that implements this approach for software teams. https://github.com/ejwinter/TeamFabric*
