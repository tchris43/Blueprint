# 009 · POST /decision: record it, resume both agents, refuse flip-flops

**Labels:** `core` · `server` · `build`  
**Depends on:** [005](005-conflict-to-nodes.md), [008](008-wire-modules.md)  
**Owner:** Taylor

## Why it matters
Scene 5–6: Priya clicks once and both agents carry on. A double-click or a second person clicking mustn't change the decision mid-demo.

## What to do
- `POST /decision` mostly exists. Add: history entries (via 005), and a 409 if the conflict is already decided.
- After a decision, the next edit from a resumed agent sets it back to `working`.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
New file `server/test/decision.test.ts` (in-process app from 008):
- deciding sets `decision` and makes both agents `resumed`; a third agent is untouched
- unknown conflict or option → 404
- deciding an already-decided conflict → 409 and the first decision stays
- `GET /status` returns `unseenDecision` once per participant, then never again

## Done when
- [ ] Tests pass
- [ ] Live: one click on the board resumes both real agents
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Let the decider add a one-line note that goes to the agents with the option.
