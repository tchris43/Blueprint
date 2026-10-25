# drift: "did the agent do something nobody planned?"

## What it does in the demo
Scene 8 on the board ([mockup](../../../docs/mockup/scene-8-drift.png)). Before Alice's agent
starts, it says which files it plans to change. Then it quietly adds `payments/cardCache.ts`, a
file it never mentioned and that has no tests. Your function spots that, and the board flags
it in yellow so Alice can keep it or remove it.

## The function
`detectDrift(intents, edits)` in `detectDrift.ts`

**Input 1: `intents`**, the files each person's agent *said* it would touch:
```js
{ alice: ["payments/vault.ts", "checkout/order.ts"] }
```
**Input 2: `edits`**, the files each person's agent *actually* touched:
```js
{ alice: ["payments/vault.ts", "payments/cardCache.ts"] }
```
**Output:** a list of drift, one entry per surprise file:
```js
[{ id: "d1", participant: "alice", file: "payments/cardCache.ts", reason: "Not in alice's plan" }]
```
The full rules are in the comment above the function.

## Steps
1. Read `detectDrift.ts` and `detectDrift.test.ts`. Say out loud what each test checks.
2. Make the first test pass: return an empty list when everything was planned.
3. Loop over each person in `edits`, then over each file they touched.
4. If the file isn't in *that person's* plan, add a drift entry.
5. Handle the remaining tests one at a time: numbering, people with no plan, files edited twice.

## Run only these tests
```
pnpm test:drift
```

## You're done when…
- [ ] All 8 tests pass
- [ ] You didn't change the test file
- [ ] You can explain your function in 2–3 sentences without notes (you'll present it!)
