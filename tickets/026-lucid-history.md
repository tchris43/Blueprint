# 026 · Lucid: click a block to see its history

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [023](023-lucid-panel-conflict-card.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 9, the handoff: a new developer clicks getUser and reads what was planned, decided and built. The map is the documentation.

## What to do
- Use `viewport.hookSelection` (it exists in `ui/viewport.d.ts`) to learn which block is selected; read its `bp_id`.
- Add `renderHistory(node, view): string` to `panelView.ts` and send it to the panel.
- Match `docs/mockup/scene-9-handoff-coverage.png`.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `test/panelView.test.ts`:
- getUser's history in scene 9 renders all 5 entries in order, including Priya's decision
- no selection renders 'Click a box to see its history'
- history text is escaped

## Done when
- [ ] Tests pass
- [ ] Clicking getUser in Lucid shows its history in the panel
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Clicking a history line about the conflict re-opens the conflict card.
