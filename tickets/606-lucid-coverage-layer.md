# 606 · Lucid: test coverage layer

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [207](207-lucid-status-styles.md), [404](404-lucid-view-toggle.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 9: one toggle shows cardCache.ts at 0% and AccountPage at 40%, so the riskiest code stands out on sight.

## What to do
- Add a Plans / Test coverage toggle next to the view toggle (same pattern as 404).
- Apply `styleFor(..., 'coverage')` fills; restore status styles when switching back.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
Add to `test/plan.test.ts`:
- toggling the layer changes only fill and tag, never labels or positions

## Done when
- [ ] Tests pass
- [ ] Screenshot next to `scene-9-handoff-coverage.png` posted to the team
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Add a small legend block on the canvas that changes with the layer.
