# 012 · Run combined checks one at a time

**Labels:** `core` · `server` · `build`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Scene 3: if Alice and Bob save at the same moment, two overlapping checks can create the same conflict twice, so the board shows two red cards.

## What to do
- Queue checks in `server/src/index.ts` (a simple promise chain is enough). Coalesce: if 3 edits are waiting, run one check with the latest overlays.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `server/test/integration.test.ts` (from 008):
- firing Alice's and Bob's demo edits concurrently produces exactly one conflict
- five rapid edits from one participant run at most two checks

## Done when
- [ ] Tests pass
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show 'checking…' on the board while a check runs.
