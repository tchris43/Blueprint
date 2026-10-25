# 022 · Lucid: status styles that match the mockup legend

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [021](021-lucid-render-board.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 4 is read in one glance: dashed = in progress, red = conflict, green = built, yellow dashed = not in plan. If the colors are wrong, the story is lost.

## What to do
- Add `styleFor(node, owner, layer)` to `plan.ts` → `{fill, stroke, dashed, tag}`. Start from the mockup colors (`docs/mockup/scene-4-collision.png`); 050 may change them.
- Find the SDK properties for line color and dashed borders in the installed `.d.ts` files (the findings explain where).
- Put the tag ('CONFLICT · DECIDE') on its own line; note the findings' warning about ProcessBlock's single text area.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `test/plan.test.ts`:
- `conflict` → red stroke, light red fill
- `in_progress` → dashed, stroke in the owner's color
- `built` → green; `drift` → yellow and dashed; `existing` → white fill
- coverage layer: 88 → green fill, 72 → yellow, 40 → orange, 0 → red, and the tag reads `88% tested`

## Done when
- [ ] Tests pass
- [ ] Side-by-side screenshot of Lucid scene 4 next to the mockup, posted to the team
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show the owner's initial in a small circle on in-progress blocks.
