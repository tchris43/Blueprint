# 205 · Move the Lucid spike into the repo and point it at our server

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Plan A for every scene: the board lives inside Lucid. The spike works but lives outside the repo and talks to its own test server.

## What to do
- Lucid spike: `C:\Users\taych\hackathon\lucid-spike` and its `LUCID-FINDINGS.md` (read the Gotchas section first).
- Copy `lucid-spike/blueprint/` to `board/lucid-extension/`. Leave the spike's `server/` behind; our server replaces it.
- Keep it as its own pnpm project (it has its own lockfile); add it to the root `.gitignore`'s exceptions only if needed. Keep the `minimumReleaseAgeExclude` entry.
- Point the panel's WebSocket at `ws://localhost:4000/live`. Messages are now `LiveMessage` (`shared/contract.ts`): for now, recolor each block whose `bp_id` matches a node id using the node's status.
- Update `board/lucid-extension/README.md` with the run commands from the findings.

## Tests
**Check:** `npx lucid-package@latest --mode pnpm build-editor-extension blueprint-board` exits 0 in `board/lucid-extension`. (Real tests arrive in 206.)

## Done when
- [ ] Build exits 0
- [ ] With `pnpm server` running, `curl -X POST localhost:4000/demo/scene -H "Content-Type: application/json" -d '{"scene":3}'` turns the getUser block red in Lucid
- [ ] You've seen it with your own eyes in Chrome
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Remove the scaffold's unused import modal and its `SHOW_MODAL` scope.
