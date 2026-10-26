# 013 · Does the conflict really happen with live agents?

**Labels:** `medium` · `demo-shop` · `verify`  
**Depends on:** [070](070-story-demo-script.md), [001](001-post-hook-real-edits.md), [002](002-pre-hook-pause-and-decision.md)  
**Owner:** _unclaimed_

## Why it matters
The whole demo assumes Alice's agent writes `saveCard(getUser().id, card)` and Bob's makes getUser nullable. Real agents might write it differently, and then nothing collides.

## What to do
- Using the exact prompts from the demo script (070), run Alice's and Bob's agents 3 times each from a fresh `reset-demo.sh`.
- Record in `docs/verify/live-agents.md`: did each agent write the expected change? Did the conflict fire? How long did it take?
- If it misses, propose a change to `demo-shop/TICKETS.md` or the prompts. Talk it over with the team before changing demo-shop, since the whole demo runs on it.

## Done when
- [ ] 3 runs recorded with results
- [ ] A clear yes/no: is the live path reliable enough for the stage, or do we use replay (010)?
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Time each run and note where the waiting happens.
