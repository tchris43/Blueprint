# Blueprint

A shared, live map of a codebase that catches the moment one teammate's AI agent breaks another's
work, and brings in the right people to decide. Hackathon project. See `AGENTS.md` for the full idea.

Setup takes about 15 minutes. Do the steps in order; each one depends on the one before.

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
At the start it's a plain list of the sample data. The `board-web` tickets turn it into the map.

## 4. Run the server

```
pnpm server
```
It runs on http://localhost:4000. Check it with http://localhost:4000/state in your browser.
Push a sample scene to every connected board (handy for rehearsals):
```
curl -X POST localhost:4000/demo/scene -H "Content-Type: application/json" -d "{\"scene\":3}"
```
The server type-checks against a `demo-shop` folder next to this repo. Only whoever runs the server needs that one.

## 5. Install the hooks (Taylor, Alice's and Bob's laptops on demo day)

See [hooks/README.md](hooks/README.md). In short: copy `hooks/example-settings.json` into
`demo-shop/.claude/settings.local.json`, fix the paths, and set `BLUEPRINT_PARTICIPANT`.

## 6. How we work: everyone on `main`

Work comes from [tickets/](tickets/README.md). Claim one and push the claim. Everyone commits straight to `main`; each ticket stays in one area, so we rarely touch the same files.
```
git pull --rebase                      # get everyone's latest work
# ...make changes...
pnpm test                              # must pass before you push
git add -A
git commit -m "603: flag files that weren't in the plan"
git pull --rebase
git push
```
Push small and often. Full details are in [docs/workflow.md](docs/workflow.md).

## Useful commands

| Command | What it does |
|---|---|
| `pnpm doctor` | Check your setup |
| `pnpm dev:board` | Run the web board |
| `pnpm server` | Run the Blueprint server |
| `pnpm test` | Run the tests for finished work. **Must pass before every push.** |
| `pnpm test:todo` | Run every teammate task's tests. These fail on purpose until each task is done. |
| `pnpm test:board` | The web board's tests only |
| `pnpm test:drift` / `test:coverage` / `test:explain` | One module's tests only |
| `pnpm test:engine` | The combined-check tests only (needs `demo-shop` next to this repo) |
| `pnpm check:contract` | Check the shared data still matches the contract |

## Where things are

| Folder | What | Ticket area |
|---|---|---|
| `tickets/` | The backlog: every piece of remaining work, with owners | all |
| `shared/` | The contract (data shapes), sample data, plain-English labels | `server` (labels: `modules`) |
| `server/` | The engine; `src/drift`, `src/coverage`, `src/explain` are modules | `server`, `modules` |
| `hooks/` | Claude Code ↔ Blueprint | `server` |
| `board/` | The visual map (web + Lucid) | `board-web`, `board-lucid` |
| `tasks/board/` | Step-by-step guides for the web board tickets | `board-web` |
| `docs/` | Demo script, pitch, competitors, mockups, guides | `demo-pitch` |

Team working rules (with or without AI) are in [AGENTS.md](AGENTS.md#working-rules-everyone-every-folder-with-or-without-ai); tips for AI tools are in [docs/how-to-work-with-ai.md](docs/how-to-work-with-ai.md).
