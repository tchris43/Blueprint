# board: the visual map

Owners: see the `board-web` and `board-lucid` tickets in [tickets/](../tickets/README.md).

- `web/`: **Plan B**, React + Vite + React Flow. Starts as a plain list of the sample data. Tickets 030–032 (guides in `tasks/board/`) turn it into the map.
  Run `pnpm dev:board` from the repo root, and test with `pnpm test:board`.
- `lucid-extension/`: **Plan A**, a Lucid editor extension. Ticket 020 moves the working spike in here.

Both render the same `BoardState` from `shared/contract.ts`. Mockups: `docs/mockup/`.
