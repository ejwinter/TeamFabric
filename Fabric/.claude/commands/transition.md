# /transition — Manage Entity State Transitions

## Usage

```
/transition [entity] [to-state]
```

## Arguments

| Argument | Description |
|---|---|
| `entity` | Entity ID, folder name, or title fragment (e.g. `auth-feature`, `R-42`, `fhir-parser-260315`) |
| `to-state` | Target state: `Active`, `Resolved`, `Closed`, or `Removed` |

## Examples

```
/transition auth-feature Active
/transition fhir-parser-260315 Closed
/transition R-101 Removed
/transition sepsis-prediction-260315 Resolved
```

## Behavior

1. Locate the target entity file. If the argument is ambiguous (multiple matches), list candidates and ask the user to confirm.
2. Load the entity and read its current `State:`.
3. Validate the transition:
   - `New → Active` — allowed
   - `Active → Resolved` or `Active → Closed` — allowed
   - `Any → Removed` — allowed from any non-terminal state
   - `Resolved/Closed → Active` — allowed (reactivation); run the New → Active checks
   - Same-state transitions — note that the entity is already in that state and stop
4. Invoke the `entity-transitions` skill for the appropriate transition path.
5. Write the state change only after the user confirms.

## Notes

- Read-only until confirmation. No meta mode required for state changes on work items, tasks, features, or epics. Meta mode is only required for structural mutations: removing, renaming, or re-scoping epics and features.
- The transition skill is also invoked implicitly when the agent detects state-change intent in conversation — this command is the explicit path.
- Resolved, Closed, and Removed entities are never deleted. Physical cleanup is deferred to the garbage collection process.
