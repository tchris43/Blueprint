# 403 · Plain-English names for every box (labels.json)

**Labels:** `starter` · `modules` · `build`  
**Depends on:** nothing  
**Owner:** _unclaimed_

## Why it matters
Chris's Product view in scenes 4–5: every box in words a non-programmer uses ('Who's buying', not `getUser()`).

## What to do
- Fill every `TODO` in `shared/labels.json`: a short name and a one-line description for each node and column.
- Read each function in demo-shop first, so the label is true, not a guess.
- Read the names aloud to someone non-technical. Change any they stumble on.

## Tests
**Existing tests:** `pnpm check:contract` (labels.json must keep its shape).

## Done when
- [ ] No `TODO` left
- [ ] `pnpm check:contract` passes
- [ ] One non-technical person read them and understood
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Add labels for the new functions the demo creates (saveCard, createGuestSession…).
