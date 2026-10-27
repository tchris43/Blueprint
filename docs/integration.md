# Integration plan: where each module plugs into the server

Wiring these in is tickets 402 (explain) and 605 (drift, coverage), after each module's tests pass. Every spot is marked in the code
with an `INTEGRATION(<module>)` comment, so `grep -rn INTEGRATION server/src` finds them even after
line numbers move.

## drift → `server/src/index.ts:118`, in `POST /edits`
Right after the participant's overlay is saved:
```ts
store.board.drift = detectDrift(
  Object.fromEntries([...store.intents].map(([p, files]) => [p, [...files]])),
  Object.fromEntries([...store.overlays].map(([p, o]) => [p, Object.keys(o.files)])),
);
```
To finish: carry over `resolved` from earlier drift entries (match by participant + file) so a
"keep" doesn't reappear, and set `nodeId` once the code map exists.

## explain → `server/src/index.ts:85`, in `checkAndRecord` (shared by `/edits` and `/check`), per new conflict
Replace the `isDemoConflict(...) ? DEMO_FALLBACK : genericFallback(...)` line with:
```ts
const plain = await explainConflict(evidence, labels);
```
To finish: load `shared/labels.json` once at startup into `labels`. The call already falls back on
its own, so no try/catch is needed here.

## coverage → `server/src/store.ts:19`, in `freshBoard()` (later: the code map)
Once the ts-morph code map builds the nodes:
```ts
const percent = mapCoverage(readCoverageSummary(), nodes);
for (const node of nodes) node.coverage = percent[node.id];
```
To finish: run `vitest run --coverage --coverage.reporter=json-summary` in demo-shop (needs
`@vitest/coverage-v8` there) and read `demo-shop/coverage/coverage-summary.json`.

## labels.json → the code map
`plainName` and `plainDesc` on each node come from `shared/labels.json[nodes][node.id]`. Fall back to
the symbol name when a label is missing or still `"TODO"`.
