# 025 · Lucid panel: Product / Code view toggle

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [021](021-lucid-render-board.md), [023](023-lucid-panel-conflict-card.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 4: Priya flips to Product view and every box speaks her language. This is the 'brings in the PM' part of the pitch.

## What to do
- Toggle in the panel → message to the extension → re-apply the plan with the new view.
- Only block text should change; never delete and redraw blocks (people may have moved them).

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `test/plan.test.ts`:
- switching view changes every label and no `bpId`, `x` or `y`

## Done when
- [ ] Tests pass
- [ ] Toggle works live in Lucid, and a block you dragged stays where you put it
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Remember the view per person (Lucid user), so Priya and Alice can see different views at once.
