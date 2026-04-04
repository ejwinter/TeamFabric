# /submit-idea — Submit an Idea or Suggestion to TeamFabric

## Purpose

Let anyone using TeamFabric submit an idea, suggestion, or improvement to the upstream
[ejwinter/TeamFabric](https://github.com/ejwinter/TeamFabric) repository as a GitHub issue.

## Behavior

### Step 0 — Confirm intent (always run this first)

Before asking for any details, display this message and wait for the user to confirm:

> **Before you continue:**
>
> This command submits feedback to the **TeamFabric framework project** — the open-source tool
> your team is using. It is the right place for ideas about how Fabric itself could work better.
>
> It is **not** the right place for:
> - Questions or issues specific to how your team has configured Fabric
> - Internal team concerns, backlog items, or process feedback
> - Anything confidential about your organization or work
>
> Issues submitted here are **public** on GitHub. Please do not include any sensitive,
> proprietary, or identifying information about your team, clients, or internal systems.
>
> The TeamFabric maintainers are not responsible for the content of submitted issues.
>
> Does your idea relate to the Fabric framework itself? (yes / no)

- If the user says **no** → stop and suggest they raise the topic internally with their team.
- If the user says **yes** → proceed to Step 1.

### Step 1 — Gather input

Ask the user two questions (can be asked together):

1. **Title** — one sentence summarizing the idea
2. **Description** — what's the idea, and what problem does it solve or opportunity does it address?

If the user provided text with `/submit-idea <text>`, treat it as a starting point but still
confirm or expand before submitting.

### Step 2 — Detect gh CLI

Run:

```bash
gh auth status 2>&1
```

- If the command succeeds and shows an authenticated account → **gh path** (Step 3a)
- If the command fails or is not found → **URL path** (Step 3b)

### Step 3a — Submit via gh CLI

Run:

```bash
gh issue create \
  --repo ejwinter/TeamFabric \
  --title "<title>" \
  --body "<description>\n\n---\n_Submitted via /submit-idea_" \
  --label "idea"
```

Show the returned issue URL to the user. Done.

> Note: the `idea` label may not exist in the repo. If `gh` returns a label-not-found error,
> retry without `--label`.

### Step 3b — Submit via pre-filled URL

Build a URL in this format (URL-encode title and body):

```
https://github.com/ejwinter/TeamFabric/issues/new?title=<encoded-title>&body=<encoded-body>
```

The body should include the description plus a footer line:
```
<description>

---
_Submitted via /submit-idea_
```

Tell the user:

> "You don't have the `gh` CLI set up, but you can submit this idea directly in your browser.
> Open this link (it pre-fills the form for you):
>
> <url>"

## Notes

- Read-only from Fabric's perspective — this command does not write any files to the instance.
- No meta mode required.
- This command is intentionally simple — it is a lightweight feedback channel, not a full
  issue-management workflow.
