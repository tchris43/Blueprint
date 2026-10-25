# coverage: "how well tested is each box?"

## What it does in the demo
The **Test coverage** layer on the board ([mockup, scene 9](../../../docs/mockup/scene-9-handoff-coverage.png)).
Every box shows "88% tested", colored green, yellow, orange or red. A new developer sees right
away that `cardCache.ts` has 0% and `AccountPage` only 40%.

## The function
`mapCoverage(coverageJson, nodes)` in `mapCoverage.ts`

**Input 1: `coverageJson`**, the report vitest writes to `coverage/coverage-summary.json`.
A small example is in `fixtures/coverage-summary.json`; read it before starting. Each key is a full file path:
```js
{ "/home/alice/demo-shop/account/user.ts": { lines: { pct: 87.5, ... }, ... }, ... }
```
**Input 2: `nodes`**, the boxes on the map. Each one has an `id` and a `file`:
```js
[{ id: "account/user.ts#getUser", file: "account/user.ts", ... }]
```
**Output:** a percentage per box id:
```js
{ "account/user.ts#getUser": 88 }
```
The full rules are in the comment above the function.

## Steps
1. Read `mapCoverage.ts`, `mapCoverage.test.ts`, and the fixture file.
2. Make the first test pass: no nodes gives an empty object.
3. For each node, find the report entry whose path ends with `"/" + node.file`.
4. Use `lines.pct`, rounded with `Math.round`.
5. Then the edge cases: a missing file gives 0, lookalike names, Windows backslashes (`\`).

## Run only these tests
```
pnpm test:coverage
```

## You're done when…
- [ ] All 8 tests pass
- [ ] You didn't change the test file
- [ ] You can explain the function in 2 minutes without notes (you present it at the final demo)
