# 016 · Layer 2: run the related tests on the combined code

**Labels:** `medium` · `server` · `build`  
**Depends on:** [014](014-check-before-edit.md)  
**Owner:** _unclaimed_

## Why it matters
The type check only catches breaks the compiler can see. If Bob makes `getUser()` return an empty user
instead of throwing, every type still lines up, yet Alice's code now saves cards against a blank user.
Tests catch what types can't.

## What to do
- In `server/src/combinedCheck.ts`, after the type check passes with no new errors, run
  `vitest related <changed files> --run` in the same three temp folders: base+A, base+B, base+A+B.
  "Changed files" means both people's changed files together.
- **A test that fails only in the combined run is a conflict.** Same rule as type errors: drop any test
  that also fails in either single run.
- Evidence: the test name and its failure message. Put them in the existing evidence fields
  (`affectedFile`/`affectedLine` = the test, `compilerError` = the failure line) so the contract doesn't
  change. If that reads badly on the conflict card, propose a contract field, and ask Taylor before editing `shared/`.
- **The demo test.** Add a second pair of demo patches in `docs/demo-patches/`:
  - Bob's: `getUser()` returns `{ id: "", name: "", email: "" }` when nobody is signed in, and he updates `account/user.test.ts` to match, so his change passes alone
  - Alice's: a test in her saved-cards change asserting that `placeOrder` refuses to save a card when nobody is signed in
  - Each one passes `tsc` and `vitest` alone. Combined, there's no type error but Alice's test fails.

## Things to watch
- With 014 this runs before every edit, so the wait grows. Measure it. If combined checks take over
  about 5s, run tests only when the type check passes AND an exported function changed.
- Use `vitest run`, never watch mode, or the check never finishes.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
- the empty-user patch pair → one conflict, its evidence names Alice's test, and there are no type errors
- a test that already fails on base+B alone → not a conflict
- the original `User | null` pair → still caught by the type check, and the tests are never run

## Done when
- [ ] Tests pass
- [ ] The empty-user conflict is detected with no type error
- [ ] Show the team the result and explain how it works in 2 minutes.
