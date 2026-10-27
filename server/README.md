# server: the Blueprint engine

Core engine: Taylor. `src/drift`, `src/coverage`, `src/explain` are the `modules` tickets (401, 603, 604). Node + TypeScript + Express + ws. All state is in memory.

    pnpm server           # from the repo root, http://localhost:4000
    pnpm test:engine      # combined-check tests against ../demo-shop

| File | What it does |
|---|---|
| `src/combinedCheck.ts` | Core. Type-checks base + A, base + B, base + A + B in temp folders. An error only in A + B is a conflict. |
| `src/index.ts` | Endpoints + `/live` websocket (exports `app`/`server` for tests) |
| `src/main.ts` | Starts the server (`pnpm server`) |
| `src/store.ts` | In-memory state |
| `src/drift/`, `src/coverage/`, `src/explain/` | Modules (tickets 401, 603, 604). Plug-in points: `docs/integration.md` |
| `test/fixtures/` | Alice's and Bob's in-progress demo edits |

## Endpoints
`GET /state` · `POST /edits` · `GET /status?participant=` · `POST /intent` · `POST /decision` ·
`POST /drift/resolve` · `POST /reset` · `POST /demo/scene` (rehearsal: push sample scene N) · `ws /live`

## Remaining work
Tracked as `server` tickets in [tickets/](../tickets/README.md) (rings 1–6). Until the code map
(201) lands, the board starts from sample scene-0.
