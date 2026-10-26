# 007 · Same-file conflicts reach the board

**Labels:** `core` · `server` · `build`  
**Depends on:** [005](005-conflict-to-nodes.md)  
**Owner:** Taylor

## Why it matters
Judges will ask 'what if both edit the same file?'. Today the combined check detects it and then drops it.

## What to do
- Turn `result.sameFile` in `server/src/index.ts` into a `Conflict` with `kind: "same_file"`.
- Pick the 2–3 options a human would actually want here (that's a judgment call — write them down).

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
Add to `server/test/board.test.ts`:
- two participants editing `checkout/order.ts` produce one conflict with `kind: "same_file"` and both names in `between`
- both agents are `paused`
- the conflict has 2 or 3 options

## Done when
- [ ] Tests pass
- [ ] Verified live with two agents editing the same file
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
If the two edits touch different functions, auto-merge instead of pausing.
