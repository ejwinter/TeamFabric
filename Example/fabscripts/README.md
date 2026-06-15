# fabscripts

Utility scripts for working with TeamFabric instances.

## Setup

Requires Python 3.12+ and [Poetry](https://python-poetry.org/).

```bash
cd fabscripts
poetry install
```

This creates a virtual environment and installs the project. Because there are currently no third-party dependencies, the main effect is setting up the environment and making the project importable.

## Scripts

### backlog_index.py

Generates `backlog-index.md` at the repo root — a single browsable index of all requests and the epic → feature → work item → task hierarchy. Re-running overwrites the file.

**Run from the repo root:**

```bash
poetry run python fabscripts/backlog_index.py
```

**Custom output path:**

```bash
poetry run python fabscripts/backlog_index.py --out path/to/output.md
```

**What it reads:**

| Path | Content |
|------|---------|
| `requests/R-*/request.md` | Request entities |
| `backlog/epics/*/epic.md` | Epics |
| `backlog/epics/*/features/*/feature.md` | Features |
| `backlog/epics/*/features/*/workitems/*/workitem.md` | Work items |
| `backlog/epics/*/features/*/workitems/*/tasks/*.md` | Tasks |

For each entity it captures the title, state, date fields, and the first paragraph of the `## Description` (or `## Summary` for requests).
