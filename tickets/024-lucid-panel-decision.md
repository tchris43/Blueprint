# 024 · Lucid panel: decision buttons post to the server

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [023](023-lucid-panel-conflict-card.md), [009](009-decision-resumes-agents.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 5: Priya clicks one button inside Lucid, and both agents resume. This is the moment the pitch is built around.

## What to do
- Render one button per option in `renderConflictCard` with `data-option-id`.
- In the panel iframe, a click sends `POST http://localhost:4000/decision` (`DecisionRequest` in the contract). The server already allows `Origin: null`.
- Disable the buttons after a click so a double-click can't send twice.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
Add to `test/panelView.test.ts`:
- an undecided card has one button per option with the right `data-option-id`
- a decided card has no option buttons

## Done when
- [ ] Tests pass
- [ ] Live: clicking in Lucid changes `GET /state` and the getUser block turns purple
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show a 'sent to Alice and Bob' confirmation once both agents read it (`agentStatus` → resumed).
