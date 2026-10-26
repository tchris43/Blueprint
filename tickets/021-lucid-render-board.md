# 021 · Lucid: draw the whole map from BoardState, in columns

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [020](020-lucid-move-spike.md)  
**Owner:** _unclaimed_

## Why it matters
Scenes 1–9: the map in Lucid shows every box and arrow, and new boxes (like 'Create an account' in scene 6) appear without redrawing everything.

## What to do
- Create `board/lucid-extension/editorextensions/blueprint-board/src/plan.ts` with pure functions (no SDK imports): `planBlocks(state, view)` → `[{bpId, label, x, y, w, h}]` and `planLines(state)` → `[{from, to}]`.
- In `extension.ts`, apply a plan: create missing blocks, update text/position of existing ones (found by `bp_id`), delete blocks whose node is gone. Same for lines.
- Origin from `viewport.findAvailableSpace`, never hard-coded coordinates (see the findings).

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `board/lucid-extension/editorextensions/blueprint-board/test/plan.test.ts` (vitest, using `shared/sample-state.json`):
- scene 1 gives 6 blocks whose `bpId`s equal the node ids
- nodes in the same column share an `x`; columns don't overlap
- `planLines` gives one line per edge, from/to node ids
- product view uses `plainName` as the label; code view uses `symbol`
- going from scene 4 to scene 6 adds exactly the SignUpPrompt block and removes none

## Done when
- [ ] Tests pass
- [ ] Clicking through `/demo/scene` 0–8 in Lucid redraws correctly, no duplicate blocks
- [ ] Lines stay attached when you drag a block
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Draw a header label above each column.
