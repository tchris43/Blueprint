# 011 · One command resets everything for a rehearsal

**Labels:** `core` · `server` · `build`  
**Depends on:** [021](021-lucid-render-board.md)  
**Owner:** Taylor

## Why it matters
We'll rehearse the demo 10+ times. Resetting the server, both demo-shop clones and the Lucid board by hand is where demos go wrong.

## What to do
- Add `pnpm rehearse:reset`: `POST /reset`, run `scripts/reset-demo.sh` in each clone listed in an env var, and broadcast an empty board so Lucid clears its `bp_id` blocks.
- Print what it did, one line per step.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
New file `server/test/rehearse-reset.test.ts`:
- `--dry-run` lists the reset steps for every configured clone and changes nothing
- a clone path that doesn't exist is reported, and the other steps still run
- after reset, `GET /state` has no conflicts, no drift, and every agent `idle`

## Done when
- [ ] Tests pass
- [ ] Full reset takes under 10 seconds
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Also clear each clone's Claude Code session so the agents start fresh.
