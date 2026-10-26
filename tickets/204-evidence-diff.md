# 204 · Show the other person's actual diff in the conflict evidence

**Labels:** `core` · `server` · `build`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Scene 4's 'Why was this flagged?' box: judges see the exact line Bob changed, which proves the AI only wrote the question, not the finding.

## What to do
- In `server/src/combinedCheck.ts` (or a small `diff.ts`), produce a short unified diff of the changed file vs base, trimmed to the hunk around the changed symbol.
- Fill `evidence.diff` in `server/src/index.ts`.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
Add to `server/test/combinedCheck.test.ts`:
- the demo conflict's diff contains `-export function getUser(): User {` and `+export function getUser(): User | null {`
- the diff is under 15 lines
- the diff only covers the changed participant's file, never the affected participant's

## Done when
- [ ] Tests pass
- [ ] The conflict card shows the diff in a code font
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Highlight the changed symbol's name in the diff.
