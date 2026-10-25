# server: the Blueprint engine

Owner: Taylor (`drift/`, `coverage/`, `explain/` belong to partner 3). Node + TypeScript + Express + ws. All state is in memory.

    pnpm server           # from the repo root, http://localhost:4000
    pnpm test:engine      # combined-check tests against ../demo-shop

| File | What it does |
|---|---|
| `src/combinedCheck.ts` | Core. Type-checks base + A, base + B, base + A + B in temp folders. An error only in A + B is a conflict. |
| `src/index.ts` | Endpoints + `/live` websocket |
| `src/store.ts` | In-memory state |
| `src/drift/`, `src/coverage/`, `src/explain/` | Partner 3's modules. Plug-in points: `docs/integration.md` |
| `test/fixtures/` | Alice's and Bob's in-progress demo edits |

## Endpoints
`GET /state` · `POST /edits` · `GET /status?participant=` · `POST /intent` · `POST /decision` ·
`POST /drift/resolve` · `POST /reset` · `POST /demo/scene` (rehearsal: push sample scene N) · `ws /live`

## TODO (Taylor)
- [ ] Code map with ts-morph (nodes, edges, one column per folder, labels from `shared/labels.json`). Until then the board starts from sample scene-0.
- [ ] Map conflicts to node ids, and update node status/history on each edit.
- [ ] Unified diff in the conflict evidence.
- [ ] Same-file conflicts → board.
- [ ] Wire in drift / explain / coverage (`docs/integration.md`).
- [ ] Optional: `vitest run` alongside `tsc`.
