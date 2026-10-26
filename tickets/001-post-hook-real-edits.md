# 001 · PostToolUse hook: real agent edits reach the server

**Labels:** `core` · `server` · `build`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Scenes 2–3: every edit Alice's and Bob's agents make shows up on the map while they work. Without this, nothing on the board is live.

## What to do
- `hooks/post-tool-use.mjs` exists and passed a curl smoke test, but has never run inside a real Claude Code session.
- Install it in two demo-shop clones (`alice`, `bob`) using `hooks/README.md`.
- Make a real edit with each agent and confirm the server receives it (add a one-line log in `server/src/index.ts` `POST /edits`).
- Check the real stdin payload for Edit and Write; confirm whether MultiEdit still exists in current Claude Code and drop it from the matcher if not.
- Ignore edits to files outside the project folder (e.g. the agent editing `~/.claude/...`).

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `server/test/hooks/post-tool-use.test.ts`: spawn `node hooks/post-tool-use.mjs` with JSON on stdin and a throwaway HTTP server on a random port (`BLUEPRINT_SERVER`).
- sends `{participant, files:[{path, content}]}` with a repo-relative, forward-slash path and the file's full content
- exits 0 with no output when `BLUEPRINT_PARTICIPANT` is unset
- exits 0 with no output when the server is unreachable (never blocks a real developer)
- prints `{decision:"block", reason}` containing the conflict summary when the reply has `paused: true`
- sends nothing for a file outside `CLAUDE_PROJECT_DIR`

## Done when
- [ ] All tests above pass
- [ ] A real Edit in Alice's clone appears in the server log within 3 seconds
- [ ] Notes on the real payload shape added to `hooks/README.md`
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Batch rapid-fire edits (several within 300 ms) into one `POST /edits` so the check runs once.
