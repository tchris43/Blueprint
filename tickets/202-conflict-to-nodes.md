# 202 · Edits and conflicts update the map's boxes and history

**Labels:** `core` · `server` · `build`  
**Depends on:** [201](201-code-map-ts-morph.md)  
**Owner:** Taylor

## Why it matters
Scenes 2–6: boxes turn dashed while being built, red in the collision, purple when decided, and getUser's history fills up for the handoff in scene 9.

## What to do
- Move the board-update logic out of `server/src/index.ts` into a pure function in `server/src/board.ts`: `applyEdit(board, participant, changedFiles, checkResult)` → new board.
- Edited existing function → `changing` + owner. New file/function → `in_progress` + owner.
- Conflict → `nodeIds` = [node of the changed symbol, node containing the affected line]; both get status `conflict`, plus a history entry.
- Decision → both nodes `resolved`, history entry with the decision text.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `server/test/board.test.ts` (pure function, no tsc needed — build a fake `CheckResult`):
- Bob editing `account/user.ts` marks `account/user.ts#getUser` as `changing` with owner `bob`
- a conflict on `checkout/order.ts:47` with changed symbol `getUser` gets `nodeIds` `[account/user.ts#getUser, checkout/order.ts#placeOrder]`, both `conflict`
- `agentStatus` of a third participant (`sam`) is untouched
- deciding the conflict sets both nodes to `resolved` and appends a history entry containing the decision text
- the board still passes `BoardStateSchema` after each step

## Done when
- [ ] All tests above pass
- [ ] Live run: the web board or Lucid shows getUser turn red when the conflict happens
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Mark a node `built` once its owner's overlay passes the combined check with everyone else's.
