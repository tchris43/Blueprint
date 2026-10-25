# Blueprint

A shared, live map of a codebase that catches the moment one teammate's AI agent breaks another's
work, and brings in the right people to decide. Hackathon project. See `AGENTS.md` for the full idea.

This guide assumes you've never set up a project like this before. Go step by step.

## 1. Install the tools (once per computer)

1. **Node.js**: download the **LTS** version from https://nodejs.org and install it with the default options.
2. **git**: download from https://git-scm.com and install it with the default options.
3. **pnpm** (installs our project's libraries): open a terminal and run
   ```
   corepack enable pnpm
   ```
   On Windows, if that says "permission denied" / EPERM, run this instead:
   ```
   corepack enable pnpm --install-directory "%APPDATA%\npm"
   ```
4. Close the terminal and open a new one. Then check:
   ```
   node --version     # should print v20.19 or higher
   pnpm --version
   git --version
   ```

"Terminal" means PowerShell on Windows, or Terminal on a Mac. In VS Code: View → Terminal.

## 2. Get the code

```
git clone https://github.com/tchris43/Blueprint.git
cd Blueprint
pnpm install
pnpm doctor
```
`pnpm doctor` checks everything. Every line should say **OK**. If one says **FIX**, do what it says.

## 3. Run the web board on the sample data

```
pnpm dev:board
```
Open http://localhost:5173. Press Ctrl+C in the terminal to stop it.
At the start it's a plain list. Partner 2's tasks (`tasks/board/`) turn it into the map.

## 4. Run the server

```
pnpm server
```
It runs on http://localhost:4000. Check it with http://localhost:4000/state in your browser.
Push a sample scene to every connected board (handy for rehearsals):
```
curl -X POST localhost:4000/demo/scene -H "Content-Type: application/json" -d "{\"scene\":3}"
```
The server type-checks against a `demo-shop` folder next to this repo. Only Taylor needs that one.

## 5. Install the hooks (Taylor, Alice's and Bob's laptops on demo day)

See [hooks/README.md](hooks/README.md). In short: copy `hooks/example-settings.json` into
`demo-shop/.claude/settings.local.json`, fix the paths, and set `BLUEPRINT_PARTICIPANT`.

## 6. How we work: branches and pull requests

Never work on `main` directly.
```
git checkout -b partner3/drift      # your-name/what-you're-doing
# ...make changes...
pnpm test
git add -A
git commit -m "drift: what you did"
git push -u origin partner3/drift
```
Then open a pull request on GitHub. Taylor reviews and merges it. Full details are in [docs/workflow.md](docs/workflow.md).

## Useful commands

| Command | What it does |
|---|---|
| `pnpm doctor` | Check your setup |
| `pnpm dev:board` | Run the web board |
| `pnpm server` | Run the Blueprint server |
| `pnpm test` | Run every test (some fail on purpose until their task is done) |
| `pnpm test:board` | Partner 2's board tests |
| `pnpm test:drift` / `test:coverage` / `test:explain` | Partner 3's module tests |
| `pnpm check:contract` | Check the shared data still matches the contract |

## Where things are

| Folder | What | Who |
|---|---|---|
| `shared/` | The contract (data shapes), sample data, plain-English labels | Taylor (labels: partner 3) |
| `server/` | The engine | Taylor; `drift/`, `coverage/`, `explain/`: partner 3 |
| `hooks/` | Claude Code ↔ Blueprint | Taylor |
| `board/` | The visual map (web + Lucid) | Partner 2 |
| `tasks/board/` | Partner 2's task list | Partner 2 |
| `docs/` | Demo script, pitch, competitors, mockups, guides | Partner 3 |

New to working with AI? Read [docs/how-to-work-with-ai.md](docs/how-to-work-with-ai.md).
