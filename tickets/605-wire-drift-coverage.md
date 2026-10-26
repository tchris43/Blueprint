# 605 · Wire drift and coverage into the server

**Labels:** `core` · `server` · `build`  
**Depends on:** [603](603-module-drift.md), [604](604-module-coverage.md), [201](201-code-map-ts-morph.md)  
**Owner:** Taylor

## Why it matters
Scenes 8 and 9 use the drift and coverage modules for real: the drift flag and the coverage layer.

## What to do
- Follow the `drift` and `coverage` sections of `docs/integration.md` at each `INTEGRATION(...)` marker.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
Add to `server/test/integration.test.ts` (in-process app from 102, real demo-shop):
- after `POST /intent` for alice and an edit to a file not on the list, `GET /state` has one drift entry for that file
- nodes have a `coverage` number once a coverage summary is provided
Plus: the existing `pnpm test:drift` and `test:coverage` stay green.

## Done when
- [ ] Tests pass
- [ ] `test:drift` and `test:coverage` moved from TODO to DONE in `scripts/run-tests.mjs`
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Carry `resolved` over from earlier drift entries, so a 'keep' never reappears.
