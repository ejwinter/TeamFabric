# Backlog Browser

A local web app for browsing, searching, and editing your TeamFabric backlog.
No server required beyond your laptop — just Python and git.

---

## Prerequisites

| Tool | Minimum version | Why |
|------|----------------|-----|
| Python | 3.12 | Required by TeamFabric |
| [Poetry](https://python-poetry.org/docs/#installation) | 1.8+ | Manages the Python environment |
| Node.js | 18+ | Required to build the Angular frontend (one-time setup) |
| git | any | Required by TeamFabric; used by the Commit/Push buttons |

---

## Running the app

Open a terminal in your team repo root — the folder that contains the `backlog/` directory — and run:

```bash
python backlog/browser/browser.py
```

Your browser opens automatically at **http://127.0.0.1:8082**.

> The app uses the `127.0.0.1` IP rather than the hostname `localhost` on purpose:
> some corporate web proxies (e.g. Zscaler) intercept `localhost` and return an
> "Access to localhost was denied / HTTP ERROR 403" page, while the loopback IP is
> bypassed. If you reach the app by typing the URL yourself, use `127.0.0.1`.

Press `Ctrl+C` in the terminal to stop.

`browser.py` handles everything automatically:
- If `dist/` is missing and `npm` is available, it builds the Angular app first.
- If Flask is not installed, it installs dependencies via Poetry before starting.

### Options

```
--port 8080      Use a different port (default: 8082)
--no-open        Do not open the browser automatically
--root /path     Point to a different repo root (auto-detected if omitted)
```

Example:
```bash
python backlog/browser/browser.py --port 8080
```

---

## First-time setup (engineering team)

`browser.py` can build the frontend automatically if `npm` is available. For a
controlled one-time setup — or to pre-build and commit `dist/` so others can run
without Node.js — build manually:

```bash
cd backlog/browser/app
npm install
npx ng build --configuration production
git add dist/
git commit -m "chore: build backlog browser frontend"
```

This only needs to be repeated when the framework ships Angular source changes
(i.e. after running `/update-fabric` and pulling new `app/src/` files).

---

## Using the app

### Layout

The app has three zones:

```
┌──────────────────────────────────────────────────────────────┐
│  Toolbar:  [≡] Backlog Browser  [search…]  Backlog  Sprint   │
│            Board   Hide closed  [↻]                          │
├─────────────┬──────────────────────────────┬─────────────────┤
│             │                              │                 │
│  Left nav   │  Center panel                │  Detail panel   │
│  (epics /   │  (backlog list or sprint      │  (selected      │
│  sprints)   │   board)                     │   item)         │
│             │                              │                 │
├─────────────┴──────────────────────────────┴─────────────────┤
│  Git bar:  [commit message…]  Commit  Push                   │
└──────────────────────────────────────────────────────────────┘
```

The left and right panels are resizable — drag the dividers between them.

---

### Backlog view

Click **Backlog** in the toolbar (or the ≡ menu icon) to see the flat work-item list.

**Left sidebar — navigation**

| Item | Action |
|------|--------|
| **All** | Show all epics and their work items |
| **Requests** | Show only intake requests (if any exist) |
| *(Epic name)* | Filter the center list to that epic's work items |

**Center list**

Work items appear grouped under their parent Epic and Feature headers. Click any header or row to open it in the detail panel on the right.

- **State filter chips** — click a state pill (New, Active, Resolved…) to show only items in that state; click again to remove the filter. Multiple states can be active at once.
- **Type filter chips** — similarly filter by work-item type (Story, Bug, Request, Support).
- **Hide closed / Closed visible** — toolbar toggle that shows or hides items in Closed or Removed state. Hidden by default to keep the list focused.

---

### Sprint Board view

Click **Sprint Board** in the toolbar to switch to the kanban view.

Work items are assigned to a sprint by adding an `Iteration:` property to the work-item file, for example:

```
- Iteration: 260401-260414
```

**Selecting a sprint**

Sprint chips appear at the top of the board. The most recent sprint is selected by default. Click any chip to switch sprints.

**Columns**

Each column represents a state (New → Active → Resolved → Closed). The number in the column header shows how many items are in that state for the selected sprint.

**Cards**

Each card shows:
- Work-item title
- Epic › Feature breadcrumb
- Type (Story / Bug / etc.) and assignee initials
- Due date (Target Date) if set
- A task list below the card metadata — each task shows a colored dot (blue = New, green = Active, purple = Resolved, grey = Closed) and its current state

Click a card to open the full detail in the right panel.

---

### Search

Type in the search bar at the top and press **Enter**. The search covers the full text of every backlog file — not just titles — and returns results with matched context highlighted. Click any result to open it in the detail panel.

---

### Detail panel

Click any epic, feature, work item, task, or request to open it in the right panel.

- **Properties** — all key/value metadata (State, Assignee, Iteration, Dates, etc.)
- **Description and other sections** — rendered from markdown
- **✏️ Edit** — switches to an editable markdown text area. Click **Save** to write the file to disk. Changes are reflected immediately but are not committed to git until you use the Commit button.
- **Close** — click the × in the panel header (or click the same row again) to dismiss the panel.

---

### Commit and push

The git bar at the bottom is the only place changes enter version control.

1. Make one or more edits via the detail panel.
2. Enter a short commit message in the bottom bar (e.g. `update: mark feature as active`).
3. Click **Commit** — this stages all changes in `backlog/` and `requests/` and creates a git commit.
4. Click **Push** to push the commit to your remote.

> Push requires that your git remote is configured and you have write access. If it fails, ask your team's engineering lead to check your credentials.

---

## Building and updating the frontend (for developers)

`app/dist/` is committed to the **team repo** (not to TeamFabric itself) so non-developers can run the app without Node.js. Rebuild and recommit whenever Angular source changes are pulled in:

```bash
cd backlog/browser/app
npm install              # first time only
npx ng build --configuration production
git add dist/
git commit -m "chore: build backlog browser frontend"
```

### Development mode (live reload)

To iterate on the frontend with hot-reload, run the Angular dev server alongside
the Python API server:

```bash
# Terminal 1 — Python API server (no static serving needed)
cd backlog/browser
poetry run python server.py --no-open --port 8082

# Terminal 2 — Angular dev server with proxy to API
cd backlog/browser/app
npx ng serve --proxy-config proxy.conf.json
```

Create `app/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://127.0.0.1:8082",
    "secure": false
  }
}
```

Then open http://127.0.0.1:4200.

---

## Troubleshooting

**"Could not find backlog/epics/"**
Run from your team repo root (the folder containing `backlog/`), or pass `--root`:
```bash
python backlog/browser/browser.py --root /path/to/your/team-repo
```

**Port already in use**
```bash
python backlog/browser/browser.py --port 8080
```

**App shows "Angular app has not been built yet"**
The `app/dist/` directory is missing or empty. `browser.py` will build it
automatically if `npm` is on your PATH, or run `npx ng build` manually (see above).

**Commit fails**
- Make sure you have changes to commit (the browser only stages `backlog/` and `requests/`)
- Verify git is installed: `git --version`

**Push fails — authentication error**
Your git remote credentials need to be configured. If you use SSH, ensure your key
is added to the agent. If you use HTTPS, ensure your credentials are cached:
```bash
git config --global credential.helper osxkeychain   # macOS
```
