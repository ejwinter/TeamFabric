# Retro Input — Leo Kim — retro-sprint-1-260318

Submitted: 2026-04-01

## What went well this period?

- Handled both pipeline alerts on my own without escalating to Marcus. Felt good to close those independently.
- The Airflow monitoring dashboard improvements I made in the previous sprint actually helped — I caught one of the issues before PagerDuty fired.
- Sprint tasks were sized well for me. The Kafka topic setup task was a good stretch — new territory but not overwhelming.

## What didn't go well or felt harder than it should have?

- On-call was heavier than usual this sprint — three pages across two days on Wednesday and Thursday. I lost almost a full day of sprint work. Nobody knew how behind I was getting until I mentioned it.
- I got stuck on the Kafka consumer scaffold for a few hours because I didn't know we had a pattern established from the previous consumer work. I should have asked sooner but I also didn't know there was existing work to reference.
- The alert for the ADT pipeline on Tuesday turned out to be a known flaky check. We've now seen this twice and I'm not sure where to track that it's a known issue vs. something to actually investigate.

## What should we change or improve going forward?

- I should flag on-call load in standup earlier so the team can adjust. I felt like I was holding things up by not saying something sooner.
- When I start a new task, it would help to have a quick "is there prior art?" check with Marcus or Dana — five minutes up front saves hours of reinventing.
- We should triage known-flaky alerts separately from real incidents. Maybe a simple list in the wiki or runbook of "known noisy checks" so the on-call person knows not to deep-dive immediately.

## Action Items

- Create a "known noisy alerts" list in the Confluence runbook. Owner: Leo (with input from Marcus)
