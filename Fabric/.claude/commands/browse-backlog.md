# /browse-backlog — Launch the Backlog Browser

## Purpose

Start the local Backlog Browser web app so the user can browse, search, and edit the backlog in a browser window. The app is a Flask server with a pre-built Angular frontend — no build step required.

---

## Arguments

```
/browse-backlog
/browse-backlog --port 8080
/browse-backlog --no-open
```

Pass any arguments directly to the server:

| Argument | Effect |
|---|---|
| `--port N` | Use port N instead of the default 8082 |
| `--no-open` | Skip opening the browser automatically |

---

## Step 1: Locate the Browser Directory

Look for `backlog/browser/` relative to the repo root (the directory containing `backlog/`).

- If `backlog/browser/` does not exist: tell the user the Backlog Browser is not installed in this instance and stop. They should ask their team's framework admin to run `/update-fabric`.
- If it exists, continue.

---

## Step 2: Detect the Operating System

Run an OS check to determine whether the user is on macOS/Linux or Windows, since installation steps differ.

- **macOS / Linux:** `uname -s` returns `Darwin` or `Linux`
- **Windows:** `uname` will fail or not exist; the shell is PowerShell or Command Prompt

Use the result to select the appropriate instructions in Steps 3 and 4 below.

---

## Step 3: Check and Install Python 3.12+

### Check first

Run:
```bash
python3 --version    # macOS / Linux
python --version     # Windows (try both if needed)
```

If Python 3.12 or later is already installed, skip to Step 4.

### macOS — installing Python

**Option A (recommended): python.org installer**

1. Go to [python.org/downloads](https://www.python.org/downloads/) and download the latest Python 3.12+ installer for macOS.
2. Open the `.pkg` file and follow the installer prompts.
3. When the installer finishes, open a **new** Terminal window and run `python3 --version` to confirm.

**Option B: Homebrew** (for users who already have Homebrew)
```bash
brew install python@3.12
```

### Windows — installing Python

1. Go to [python.org/downloads](https://www.python.org/downloads/) and download the latest Python 3.12+ installer for Windows.
2. Run the installer. **Important:** on the first screen, check the box that says **"Add Python to PATH"** before clicking Install. If this box is missed, Python commands will not work in the terminal.
3. When the installer finishes, open a **new** PowerShell or Command Prompt window and run `python --version` to confirm.

> If `python --version` still fails after installing, rerun the installer, choose "Modify", and enable the "Add Python to environment variables" option.

---

## Step 4: Check and Install Poetry

Poetry manages the Python environment for the browser. Version 1.8 or later is required.

### Check first

```bash
poetry --version
```

If Poetry 1.8+ is already installed, skip to Step 5.

### macOS / Linux — installing Poetry

Run this in a terminal:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

After it finishes, **close and reopen the terminal**, then run `poetry --version` to confirm.

> If `poetry: command not found` persists after reopening the terminal, the installer will have printed a path to add. Add it to your shell profile (`.zshrc`, `.bashrc`, etc.) — the installer output will say exactly what to add.

### Windows — installing Poetry

Open **PowerShell** (not Command Prompt) and run:
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

After it finishes, **close and reopen PowerShell**, then run `poetry --version` to confirm.

> If `poetry` is not found after reopening, add `%APPDATA%\Python\Scripts` to your system PATH. Instructions: Settings → System → About → Advanced system settings → Environment Variables → edit `Path`.

---

## Step 5: Install Python Dependencies (first time only)

Check whether the virtual environment is already set up:

```bash
ls backlog/browser/.venv        # macOS / Linux
dir backlog\browser\.venv       # Windows
```

If `.venv` does not exist, run:

```bash
cd backlog/browser && poetry install
```

Tell the user: "Installing Python dependencies — this only happens once and takes about 30 seconds."

If `.venv` already exists, skip this step.

---

## Step 6: Start the Server

Run from the repo root so the server auto-detects the `backlog/` directory:

```bash
cd backlog/browser && poetry run python server.py $ARGUMENTS
```

The server opens a browser window automatically at `http://127.0.0.1:8082` (or the port specified with `--port`).

> The app uses `127.0.0.1` rather than `localhost` intentionally. Some corporate web proxies (e.g. Zscaler) block `localhost` with an "Access Denied" error while the numeric IP is bypassed. If you open the URL manually, type `127.0.0.1` not `localhost`.

Tell the user:

```
Backlog Browser is running at http://127.0.0.1:8082
Press Ctrl+C in this terminal to stop it.
```

---

## Troubleshooting

**Port already in use**
Run with a different port:
```bash
poetry run python server.py --port 8080
```

**"Could not find backlog/epics/"**
The server was not started from the repo root. Pass the path explicitly:
```bash
poetry run python server.py --root /path/to/your/team-repo
```

**App shows "Angular app has not been built yet"**
The `app/dist/` folder is missing or empty. A developer on your team needs to build the frontend and commit it:
```bash
cd backlog/browser/app && npm install && npx ng build --configuration production
git add dist/ && git commit -m "chore: build backlog browser frontend"
```

**Push fails — authentication error**
Your git remote credentials need to be configured. For HTTPS on macOS:
```bash
git config --global credential.helper osxkeychain
```

---

## Notes

- The server must stay running while the browser is in use. It blocks the terminal until stopped with `Ctrl+C`.
- Changes saved in the browser are written to disk immediately but **not committed**. Use the Commit button in the browser's bottom bar when ready.
- Node.js is not needed to run the app. The pre-built Angular frontend is included.
