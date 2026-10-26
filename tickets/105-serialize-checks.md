# 105 · Run combined checks one at a time

**Labels:** `core` · `server` · `build`  
**Depends on:** [102](102-check-before-edit.md)  
**Owner:** Taylor

## Why it matters
Scene 3: if Alice and Bob save at the same moment, two overlapping checks can create the same conflict twice, so the board shows two red cards.

## What to do
- Queue checks in `server/src/index.ts` (a simple promise chain is enough). Coalesce: if 3 edits are waiting, run one check with the latest overlays.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `server/test/integration.test.ts` (in-process app from 102), or add to it if it exists:
- firing Alice's and Bob's demo edits concurrently produces exactly one conflict
- five rapid edits from one participant run at most two checks

## Done when
- [ ] Tests pass
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show 'checking…' on the board while a check runs.
