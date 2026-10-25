# hooks — Claude Code → Blueprint

Owner: Taylor.

Two hook scripts connect each person's Claude Code to the Blueprint server:

| Script | When it runs | What it does |
|---|---|---|
| `pre-tool-use.mjs` | before every Edit / Write / MultiEdit | asks `GET /status`. Paused → denies the edit with the reason. New decision → passes it to the agent as extra context. |
| `post-tool-use.mjs` | after every Edit / Write / MultiEdit | sends the changed file to `POST /edits`. If that creates a conflict involving you, tells the agent it is paused. |

If the server is down, both hooks do nothing, so they never block real work.

## Installing in a demo-shop clone

1. Copy `example-settings.json` to `demo-shop/.claude/settings.local.json`.
   (Use `settings.local.json` so it isn't committed. The demo's agents shouldn't see Blueprint in the repo.)
2. Replace `/ABSOLUTE/PATH/TO/blueprint` with where you cloned this repo.
   On Windows use forward slashes: `C:/Users/you/blueprint/hooks/pre-tool-use.mjs`.
3. Set `BLUEPRINT_PARTICIPANT` to your name: `alice` or `bob`.
4. Start the server (`pnpm server` in this repo), then start Claude Code in demo-shop.
   Run `/hooks` inside Claude Code to confirm both hooks are listed.

## Not done yet
- `POST /intent` (announcing planned files for drift detection) has no hook yet. Likely a
  `UserPromptSubmit` hook or an instruction in the agent's prompt.
- Hook formats were checked against https://code.claude.com/docs/en/hooks on 2026-10-24.
