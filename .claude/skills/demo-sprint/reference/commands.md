# Commands: what each one tells you

PowerShell on Windows unless noted. "Broken looks like" is what you'd see if something's wrong.

| Command | What it tells you / does | Broken looks like |
|---|---|---|
| `git pull --rebase` | Gets teammates' commits and puts yours on top (no merge commit) | "CONFLICT": stop, ask Claude to explain both sides before resolving |
| `git status` | What you've changed and haven't committed | Files you didn't mean to touch |
| `git log --oneline -15` | The last 15 commits, one line each: what happened recently | n/a |
| `git diff --stat` | Which files changed and by how much: a quick review of AI work | A huge change in a file you didn't expect |
| `pnpm install` | Installs libraries listed in package.json | Errors about versions: run `pnpm doctor` |
| `pnpm doctor` | The team's setup checker | Any line saying FIX: do what it says |
| `pnpm test` | Tests for *finished* work | Any red = something regressed. Fix before pushing |
| `pnpm test:todo` | Tests for unfinished tickets | Red is expected. It's a to-do list |
| `pnpm test:board` / `test:explain` / `test:engine` | Tests for just one area (faster) | |
| `pnpm server` | Starts the Blueprint server on port 4000 | "EADDRINUSE" = it's already running in another terminal |
| `pnpm dev:board` | Starts the web board on port 5173 | Blank page: open the browser console (F12) |
| Browse `http://localhost:4000/state` | The server's whole memory as JSON. Use it to see what the server *thinks* | Stale or empty = the hooks aren't reaching it |
| `Invoke-RestMethod -Method Post -Uri http://localhost:4000/demo/scene -ContentType application/json -Body '{"scene":3}'` | Pushes a sample scene to every board. Proves server -> board works | Board doesn't change = websocket problem |
| `Invoke-RestMethod -Method Post -Uri http://localhost:4000/reset` | Clears server state | |
| `Get-Content fake.json \| node hooks/pre-tool-use.mjs; echo "exit=$LASTEXITCODE"` | Runs a hook by itself with fake input (no Claude needed) | Error or no output = the hook itself is broken |
| `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json','utf8'))"` | Checks a JSON file parses | "Bad escaped character" = single backslashes in a path |
| `/hooks` (typed inside Claude Code) | Lists the hooks Claude Code actually loaded | Empty = settings file not found or doesn't parse |
| `git tag demo-ready` then `git push --follow-tags` | Marks a known-good commit | |
| `git checkout demo-ready` | Undo everything back to the tag (use in an emergency) | |

**PowerShell vs bash:** in PowerShell, `curl` can be an alias for a different command. Use
`Invoke-RestMethod` or `curl.exe`. `$?`/`$LASTEXITCODE` replace bash's `$?` for exit codes.

**Hook exit codes (Claude Code):** exit 0 = continue (and any JSON printed is read: a
`permissionDecision: "deny"` blocks the tool). Exit 2 = block, and stderr is shown to the agent.
Anything else = a non-blocking error.
