# 103 · PreToolUse hook: pause during a conflict, deliver the decision

**Labels:** `core` · `server` · `build`  
**Depends on:** [101](101-post-hook-real-edits.md)  
**Owner:** Taylor

## Why it matters
Scenes 4–6: only Alice's and Bob's agents stop, each says why, and both pick up Priya's decision without anyone retyping it.

## What to do
- Run the hook in real sessions and watch what the agent actually does with a `deny` reason and with `additionalContext`. Does it stop and tell the user? Does it follow the decision?
- Tune the wording in `hooks/pre-tool-use.mjs` until the agent behaves well in 3 tries out of 3. Keep a short transcript of the good run.
- Decide what happens to an agent that is paused but not editing (it may just keep thinking). Write the choice down in `hooks/README.md`.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `server/test/hooks/pre-tool-use.test.ts` (same harness as 101):
- paused status → `permissionDecision: "deny"` and the reason names the changed function
- unseen decision → `additionalContext` contains the decision text and there is NO `permissionDecision` (normal permissions still apply)
- server unreachable → exit 0, no output
- `BLUEPRINT_PARTICIPANT` unset → exit 0, no output

## Done when
- [ ] All tests above pass
- [ ] Real run: Alice's agent is blocked mid-task with a clear message, then follows the decision after Priya clicks
- [ ] Sam's agent (a third clone) never pauses
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Have the post hook also attach any unseen decision, so an agent that only reads files still hears it.
