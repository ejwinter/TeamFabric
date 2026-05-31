# Backlog Browser

A local web app for browsing, searching, and editing your TeamFabric backlog.
No server required beyond your laptop — just Python and git.

---

## Prerequisites

| Tool | Minimum version | Why |
|------|----------------|-----|
| Python | 3.12 | Required by TeamFabric |
| [Poetry](https://python-poetry.org/docs/#installation) | 1.8+ | Manages the Python environment |
| git | any | Required by TeamFabric; used by the Commit/Push buttons |

Node.js is **not** required to run the app. It is only needed if you are rebuilding
the Angular frontend (see [Rebuilding the frontend](#rebuilding-the-frontend) below).

---

## Running the app (BAs, PMs, UX staff)

Open a terminal in your team repo root — the folder that contains the `backlog/` directory.

```bash
cd backlog/browser
poetry install        # first time only — installs Flask
poetry run python server.py
```

Your browser opens automatically at **http://localhost:5000**.

Press `Ctrl+C` in the terminal to stop.

### Options

```
--port 8080      Use a different port (default: 5000)
--no-open        Do not open the browser automatically
--root /path     Point to a different repo root (auto-detected if omitted)
```

Example:
```bash
poetry run python server.py --port 8080
```

---

## What you can do

### Browse
- **Left sidebar** — click "All" for everything, or select a specific Epic to filter the list
- **Center list** — work items grouped by Feature, sorted within their Epics
- **Filter chips** — filter by State (New / Active / Resolved) or Type (Story / Bug / etc.)
- **Show closed** — toggle in the toolbar to reveal or hide Closed/Removed items (hidden by default)

### Search
- Type in the search bar at the top and press Enter
- Searches the full text of every entity file, not just titles
- Results show matched context with the search term highlighted

### View details
- Click any row to open the detail panel on the right
- The panel shows all properties, description, acceptance criteria, and other sections

### Edit
- Click the ✏️ **Edit** button in the detail panel header
- The raw markdown is shown in an editable text area
- Click **Save** to write the changes back to disk
- Changes are not committed automatically — use the Commit button when ready

### Commit and push
- **Bottom bar** — enter a commit message and click **Commit**
  - Stages all changes in `backlog/` and `requests/`
  - Creates a git commit with your message
- Click **Push** to push the commit to your remote
  - Requires that your git remote is configured and you have push access

---

## Rebuilding the frontend (for developers)

The pre-built Angular output in `app/dist/` is checked into git so end users
do not need Node.js. If you make changes to the Angular source code under `app/src/`,
rebuild and commit the new dist:

```bash
cd backlog/browser/app
npm install              # first time only
npx ng build --configuration production
git add dist/
git commit -m "chore: rebuild backlog browser"
```

### Development mode (live reload)

To iterate on the frontend with hot-reload, run the Angular dev server alongside
the Python API server:

```bash
# Terminal 1 — Python API server (no static serving needed)
cd backlog/browser
poetry run python server.py --no-open --port 5000

# Terminal 2 — Angular dev server with proxy to API
cd backlog/browser/app
npx ng serve --proxy-config proxy.conf.json
```

Create `app/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false
  }
}
```

Then open http://localhost:4200.

---

## Troubleshooting

**"Could not find backlog/epics/"**
Run from your team repo root (the folder containing `backlog/`), or pass `--root`:
```bash
poetry run python server.py --root /path/to/your/team-repo
```

**Port already in use**
```bash
poetry run python server.py --port 8080
```

**App shows "Angular app has not been built yet"**
The `app/dist/` directory is missing or empty. Run `npx ng build` (see above).

**Commit fails**
- Make sure you have changes to commit (the browser only stages `backlog/` and `requests/`)
- Verify git is installed: `git --version`

**Push fails — authentication error**
Your git remote credentials need to be configured. If you use SSH, ensure your key
is added to the agent. If you use HTTPS, ensure your credentials are cached:
```bash
git config --global credential.helper osxkeychain   # macOS
```
