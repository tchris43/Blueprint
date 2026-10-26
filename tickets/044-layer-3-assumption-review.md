# 044 · Stretch — Layer 3: ask Claude whether one change breaks the other's assumptions

**Labels:** `medium` · `modules` · `build`  
**Depends on:** [006](006-evidence-diff.md), [016](016-layer-2-combined-tests.md)  
**Owner:** _unclaimed_

## Why it matters
Some breaks pass both the types and the tests. For example, Alice assumes every order has a signed-in
buyer, and Bob's change quietly allows guests. Claude can spot that kind of assumption. It's a guess,
not proof, so it **warns instead of pausing**.

## What to do
- Before designing the prompt, run `/claude-api`.
- New module `server/src/assumptions/reviewAssumptions.ts`: `reviewAssumptions(diffA, diffB, callModel)`
  → `null` or `{ reason, changedBy, affected }`. Use the existing `callModel` from `server/src/explain/callModel.ts`.
- The prompt: here are two teammates' diffs. Does either one break an assumption the other relies on?
  Answer "none", or give the assumption and the line that relies on it.
- Hard-coded fallback when there's no `ANTHROPIC_API_KEY`: for the demo diffs, return the getUser
  assumption; for anything else, return `null`. Follow the `explain/fallbacks.ts` pattern.
- Run it in the background, after layers 1 and 2 pass. **It never delays or denies an edit.**
- The result is added to the board as a conflict with `severity: "warning"`. Neither agent pauses.

## Contract change (ask Taylor before editing `shared/contract.ts`)
Proposed:
```ts
export type Conflict = {
  ...
  kind: "semantic" | "same_file" | "assumption"; // assumption = from layer 3
  severity: "conflict" | "warning"; // conflict pauses both agents; warning only shows on the board
  ...
};
```
Plus the same in `shared/schema.ts`, `sample-state.json`, and `pnpm check:contract`. Every existing
conflict gets `severity: "conflict"`. Tell the team first; the board tickets read this type.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
- no API key + the demo diffs → a warning that mentions getUser
- no API key + unrelated diffs → `null`
- a fake `callModel` that answers "none" → `null`; one that throws → falls back, doesn't crash
- a warning never changes `agentStatus`

## Done when
- [ ] Tests pass
- [ ] Run the real prompt 5 times on the demo diffs and paste the answers into `server/src/assumptions/prompt-notes.md`
- [ ] Show the team the result and explain how it works in 2 minutes.
