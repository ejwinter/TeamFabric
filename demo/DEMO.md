# Demo Script

Open Claude Code in the `Example/` directory for all steps.

---

## Flow 1 — Ingest + L2 Evaluate (R-101, Sepsis Prediction)

**Context:** R-101 passed L1 screening. A consultation was held March 25. The main open question was how sepsis onset would be labeled for training. Dr. Okonkwo followed up with a detailed email.

**Step 1 — Ingest the email**

Copy the email into staging:
```
cp ../demo/r101-okonkwo-label-clarification.md staging/
```

Then run:
```
/ingest
```

The agent will recognize this as a follow-up to R-101, extract key new facts (label methodology, cohort breakdown, data contacts, timeline pressure), and propose appending them to R-101's context log. Review and confirm.

**Step 2 — Evaluate at L2**

```
/evaluate-request R-101
```

The agent will run the L2 rubric against everything in R-101 — including the new context just ingested. Expect the label ambiguity risk to come up under Technical Feasibility, with the follow-up email providing the mitigation. Likely outcome: Accept with Conditions (August timeline is aggressive relative to the work).

---

## Flow 2 — Ingest + L1 Evaluate (R-102, Heart Failure Readmission)

**Context:** R-102 was filed after a Slack conversation and a brief email. Key gaps at intake: cohort size unknown, funding unclear, IRB not started. Dr. Whitfield followed up with a detailed email.

**Step 1 — Ingest the email**

```
cp ../demo/r102-whitfield-details.md staging/
```

Then run:
```
/ingest
```

The agent will identify this as new context for R-102, extract: cohort size (~4,000-4,500 encounters, ~22% readmission rate), data scientist availability (Dr. Mehta, 50% effort), funding status (unfunded now, QIF application planned for June), IRB status (not submitted, expedited review planned). Review and confirm.

**Step 2 — Evaluate at L1**

```
/evaluate-request R-102
```

The agent will run the L1 rubric. Expect a nuanced outcome — the request is clearer after the follow-up, cohort is viable, investigator has a data scientist, but funding is Unknown and IRB hasn't started. Likely outcome: Needs More Information or Advance to L2 with a note to resolve funding before committing team capacity.

---

## What to Watch For

- **Identity resolution** — the agent will identify you from git config and address you accordingly
- **Deduplication** — R-101's email references the March 25 consultation that's already in the context log; the agent should note what's new vs. already known
- **Rubric grounding** — evaluation criteria come from the rubric files, not the agent's general knowledge; you can show the rubric files to demonstrate this
- **Proposed plan before execution** — in batch mode, the agent shows a plan before writing anything; you approve before anything changes
