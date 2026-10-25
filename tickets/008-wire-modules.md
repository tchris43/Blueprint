# 008 · Wire drift, explain and coverage into the server

**Labels:** `core` · `server` · `build`  
**Depends on:** [040](040-module-drift.md), [041](041-module-coverage.md), [042](042-module-explain.md), [004](004-code-map-ts-morph.md)  
**Owner:** Taylor

## Why it matters
Scenes 4, 8 and 9 use the drift, explain and coverage modules for real: the plain-English question, the drift flag and the coverage layer.

## What to do
- Follow `docs/integration.md` at each `INTEGRATION(...)` marker.
- Export the Express `app` from `server/src/index.ts` (listen in a separate `main.ts`) so it can be tested in-process.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
New file `server/test/integration.test.ts` (in-process app, real demo-shop):
- after `POST /intent` for alice and an edit to a file not on the list, `GET /state` has one drift entry for that file
- with no `ANTHROPIC_API_KEY`, the demo conflict's `question` is `Can guests save cards?` (the fallback path)
- nodes have a `coverage` number once a coverage summary is provided
Plus: the existing `pnpm test:drift`, `test:coverage`, `test:explain` stay green.

## Done when
- [ ] Tests pass
- [ ] Modules moved from TODO to DONE in `scripts/run-tests.mjs`
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Cache explainConflict results per conflict so a re-broadcast never calls the API twice.
