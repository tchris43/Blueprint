# 028 · Stretch — Lucid: show drift and keep/remove it

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [022](022-lucid-status-styles.md), [008](008-wire-modules.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 8: cardCache.ts appears as a yellow dashed box that nobody planned, and Alice decides from the panel.

## What to do
- Render drift entries as a card in the panel (`renderDriftCard`) with Keep / Remove buttons → `POST /drift/resolve`.
- The drifted file's block uses the drift style from 022.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `test/panelView.test.ts`:
- an unresolved drift card has Keep and Remove buttons; a resolved one shows the outcome and no buttons

## Done when
- [ ] Tests pass
- [ ] Works live with scene 7 → 8
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Animate the block fading out on Remove.
