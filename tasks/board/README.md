# Web board task guides

Step-by-step guides for the `board-web` tickets (704–706 in `tickets/`). Do them in order; each one
brings the board closer to the mockup.

| # | Task | Tests |
|---|---|---|
| 1 | [Draw the map](1-render-nodes-and-edges.md) | `task1-render.test.ts` |
| 2 | [Color and label each box](2-color-and-tag-nodes.md) | `task2-node-card.test.tsx` |
| 3 | [Scene buttons and toggles](3-scene-switcher-and-toggles.md) | `task3-controls.test.tsx` |
| 4 | [The conflict card](4-conflict-card.md) | `task4-conflict-card.test.tsx` |
| 5 | [Decision buttons](5-decision-buttons.md) | manual check |
| 6 | [History panel](6-history-panel.md) | manual check, plus your own test |
| 7 | [Go live](7-live-websocket.md) | manual check |
| 8 | [Lucid spike](8-lucid-spike.md) | **done**: see `LUCID-FINDINGS.md` in the spike, and the Lucid tickets in `tickets/` |

Run `pnpm test:board` for tests and `pnpm dev:board` to look at it (http://localhost:5173).
The mockup is a guide to **behavior and layout, not pixels**.
