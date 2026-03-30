# Skill: Request Evaluation

## Purpose
Evaluate a request against its workflow's rubrics. This skill provides the generic evaluation engine. Workflow-specific details — what stages exist, their order, their meaning — are defined by the team in `requests/workflow/<workflow>/evaluation.md`.

## How It Works

### Workflow Resolution
1. Read the request entity's `Workflow` field to determine which workflow applies.
2. If no workflow is specified, use `default`.
3. Load `requests/workflow/<workflow>/evaluation.md` for the workflow's evaluation process.
4. If the evaluation doc or workflow directory doesn't exist, inform the user and suggest they create one or reassign the request to an existing workflow.

### What the Workflow Defines
Each workflow provides an `evaluation.md` that specifies:
- **Stages** — the ordered steps in the evaluation process (names, purpose, who typically performs them).
- **Stage transitions** — which outcomes advance to which stages, and which are terminal.
- **Rubric references** — which rubric file to use for each stage.
- **Any workflow-specific guidance** — conventions, expectations, or behavioral notes the team wants the AI to follow during evaluation.

This skill does not assume stage names, stage count, criteria, or outcome options. It reads all of these from the workflow's evaluation doc and rubric files.

### Rubric Structure
A rubric is a markdown file in the workflow directory that defines:
- **Criteria** — specific questions or dimensions to assess.
- **Guidance** per criterion — what to look for, how to assess.
- **Outcome options** — the possible conclusions for the stage (e.g., advance, reject, defer).

Different workflows may have entirely different rubrics, stage structures, and outcome options.

### Evaluation State
Evaluations are recorded on the request entity itself, under an `## Evaluation` section. The format follows the structure defined by the workflow's rubric:

```markdown
## Evaluation

### [Stage Name]
Status: [Complete | In Progress]
Date: YYYY-MM-DD
Evaluated by: [Team member name]

| Criterion | Assessment | Notes |
|-----------|-----------|-------|
| [Criterion from rubric] | [Assessment] | [Notes] |

Outcome: [One of the stage's defined outcome options]
Notes: [Summary notes from the evaluator]
```

Multiple stages appear as successive subsections as the request progresses through the workflow.

### Running an Evaluation

1. Load the request entity.
2. Load the workflow's `evaluation.md` to understand the stage sequence.
3. Check for existing evaluation state on the request:
   - **No evaluation exists:** Start from the first stage defined in the workflow.
   - **Partial evaluation (last stage in progress):** Offer to continue from where it left off.
   - **Complete evaluation (all stages resolved):** Offer to re-evaluate a specific stage or start fresh.
4. Load the rubric file for the current stage.
5. For each criterion in the rubric:
   - Present the criterion and its guidance to the user.
   - Ask the user for their assessment and any notes.
   - Record the response.
6. After all criteria are assessed:
   - Present the stage summary.
   - Ask the user for the stage outcome (from the rubric's defined outcome options).
   - Record the outcome and any summary notes.
7. If the outcome transitions to another stage (per the workflow's evaluation doc), offer to continue immediately or stop.
8. Write the evaluation to the request entity on confirmation.

### Re-evaluation
When a request already has a completed evaluation for a stage:
- The AI presents the existing assessment and asks whether to keep it, update specific criteria, or redo the stage entirely.
- Re-evaluation appends a note to the context log recording the change and reason.
- The previous evaluation is replaced on the entity. The context log entry preserves the history.

## Behavioral Rules
- The AI guides but does not assess. It presents criteria and records the human's judgment.
- Never auto-fill assessments based on entity data. The human evaluates; the AI organizes.
- If a criterion references data the AI can look up (e.g., team capacity, existing context), offer to pull it but let the human confirm the assessment.
- Staleness: if the request entity is stale, note it before starting evaluation so the user can reconcile first.
- Defer to the workflow's `evaluation.md` for any process questions. If the workflow doc doesn't cover a situation, ask the user rather than assuming.
