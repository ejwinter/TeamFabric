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

## First-time setup (engineering team)

After receiving the browser files (via `/init` or `/update-fabric`), a developer on the team must build the frontend once and commit `dist/` to the team repo. Non-developers can then run the app without Node.js.

```bash
cd backlog/browser/app
npm install
npx ng build --configuration production
git add dist/
git commit -m "chore: build backlog browser frontend"
```

This only needs to be repeated when the framework ships Angular source changes (i.e. after running `/update-fabric` and pulling new `app/src/` files).

---

## Running the app (BAs, PMs, UX staff)

Open a terminal in your team repo root — the folder that contains the `backlog/` directory.

```bash
cd backlog/browser
poetry install        # first time only — installs Flask
poetry run python server.py
```

Your browser opens automatically at **http://127.0.0.1:8082**.

> The app uses the `127.0.0.1` IP rather than the hostname `localhost` on purpose:
> some corporate web proxies (e.g. Zscaler) intercept `localhost` and return an
> "Access to localhost was denied / HTTP ERROR 403" page, while the loopback IP is
> bypassed. If you reach the app by typing the URL yourself, use `127.0.0.1`.

Press `Ctrl+C` in the terminal to stop.

### Options

```
--port 8080      Use a different port (default: 8082)
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
