# Fabric Init Form

<!--
  Fill out this form at your own pace, then run /init again from the TeamFabric repo.
  The agent will read your answers and complete setup without asking questions interactively.

  Instructions:
  - Replace placeholder text in [brackets] with your answers.
  - For yes/no questions, delete the option that doesn't apply.
  - Leave a field as-is if you don't know yet — the agent will flag gaps.
  - For repeating sections (members, products), copy the block as many times as needed.

  Note: Knowledge repositories, notification rules, and constraints are NOT collected here.
  Init will create placeholder sections in CLAUDE.md for you to fill in after setup.
-->

## Team

Team Name: [Your team name]
Organization: [Parent org or department]
Mission: [1-2 sentences describing what your team does and for whom]

## Modules

<!--
  Mark each module Enabled or Disabled.
  Core is always enabled. Scrum is not yet available.
-->

| Module         | Status               | Notes                                            |
|----------------|----------------------|--------------------------------------------------|
| Core           | Enabled              | Always on                                        |
| Triage         | [Enabled / Disabled] | Request intake and rubric evaluation             |
| Product        | [Enabled / Disabled] | Product definitions and context                  |
| Backlog        | [Enabled / Disabled] | Epic/feature/work-item hierarchy                 |
| Standup        | [Enabled / Disabled] | Daily async standup conversations and summary    |
| Retrospective  | [Enabled / Disabled] | Periodic retros with action item routing         |

## Members

<!-- Copy this block for each team member -->

### Member

Name: [Full name]
Role: [Job title or function]
Key Function: [1 sentence — what does this person primarily do]
Allocation: [0-100%]
Email: [email address]

---

## Iterations

<!-- Only needed if Backlog module is Enabled and your team works in fixed sprints/iterations. -->
<!-- Leave blank or remove this section if your team does not use fixed iterations. -->

Does your team work in fixed iterations (sprints)? [Yes / No]

<!-- If Yes, fill in: -->
Iteration Start: [YYYY-MM-DD — the start date of your first (or current) iteration]
Iteration Duration: [e.g. 14 days, 7 days]

---

## Products

<!-- Only needed if Product module is Enabled. Copy this block for each product. -->

### Product

Name: [Product name]
Status: [Active / Planned / Sunset]
Description: [1-2 sentences]

---
