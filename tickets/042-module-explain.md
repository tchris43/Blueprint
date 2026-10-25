# 042 · Conflict explainer — write the prompt

**Labels:** `starter` · `modules` · `build`  
**Depends on:** nothing  
**Owner:** _unclaimed_

## Why it matters
Scene 4: the compiler error becomes 'Can guests save cards?'. The prompt is the human part, and the person who writes it presents it.

## What to do
- Follow `server/src/explain/README.md`.
- After the tests pass, run your prompt on the real demo conflict 5 times (ask Taylor for an API key). Paste all 5 answers into `server/src/explain/prompt-notes.md`, and mark which ones a non-technical person would understand.

## Tests
**Existing tests:** `server/src/explain/explainConflict.test.ts` (`pnpm test:explain`).

## Done when
- [ ] All 9 tests pass
- [ ] `prompt-notes.md` has 5 real outputs and what you changed in the prompt because of them
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Try the prompt on a second, made-up conflict and see if it still makes sense.
