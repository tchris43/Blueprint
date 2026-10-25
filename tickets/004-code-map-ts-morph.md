# 004 · Code map: build nodes and edges from demo-shop with ts-morph

**Labels:** `core` · `server` · `build`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Every scene: the boxes on the map come from the real code, not sample data. This is what makes the pitch's 'generated from the repo' claim true.

## What to do
- Add `ts-morph` to the server and create `server/src/codeMap.ts` exporting `buildCodeMap(repoDir, labels): { nodes, edges }`.
- Nodes: one per exported function (`file#name`). Edges: calls between them, plus imports between files.
- Columns: top-level folder. Positions: column index × 240, row × 110 (same as the web board).
- Use `shared/labels.json` for plain names; fall back to the symbol when a label is missing or still `TODO`.
- Replace the sample scene-0 start in `server/src/store.ts` with the real map.

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
New file `server/test/codeMap.test.ts`, run against the real demo-shop:
- has a node `account/user.ts#getUser`, `auth/login.ts#requireLogin`, `checkout/order.ts#placeOrder`, `payments/charge.ts#chargeCard`
- has a `calls` edge `checkout/order.ts#placeOrder → payments/charge.ts#chargeCard` and `auth/login.ts#requireLogin → account/user.ts#getUser`
- every node's `column` is its top-level folder; nodes in one column share an `x`
- `plainName` comes from labels when present, and equals `symbol` when the label is `TODO`
- the result wrapped in a BoardState passes `BoardStateSchema` (from `shared/schema.ts`)

## Done when
- [ ] All tests above pass
- [ ] `pnpm server` then `GET /state` shows the real demo-shop map
- [ ] Build takes under 2 seconds
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Also emit module nodes for `*Page.ts` files so pages show as their own boxes.
