# 402 · Wire the conflict explainer into the server

**Labels:** `core` · `server` · `build`  
**Depends on:** [401](401-module-explain.md), [102](102-check-before-edit.md)  
**Owner:** Taylor

## Why it matters
Scene 4: the compiler error reaches the board as the plain-English question ('Can guests save cards?') instead of a stock fallback.

## What to do
- Follow the `explain` section of `docs/integration.md` at the `INTEGRATION(explain)` marker.
- Load `shared/labels.json` once at startup.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `server/test/integration.test.ts` (in-process app from 102, real demo-shop), or add to it if it exists:
- with no `ANTHROPIC_API_KEY`, the demo conflict's `question` is `Can guests save cards?` (the fallback path)
Plus: the existing `pnpm test:explain` stays green.

## Done when
- [ ] Tests pass
- [ ] `test:explain` moved from TODO to DONE in `scripts/run-tests.mjs`
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Cache explainConflict results per conflict so a re-broadcast never calls the API twice.
