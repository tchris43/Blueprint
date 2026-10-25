# Task 1: Draw the map

**Goal:** turn one scene of `shared/sample-state.json` into boxes and lines on the screen, one column per folder.

**Mockup:** [scene 1](../../docs/mockup/scene-1-two-tickets.png). Match the layout, not the exact pixels.

**Files to touch**
- `board/web/src/flow.ts`: write `toFlowNodes` and `toFlowEdges`
- `board/web/src/App.tsx`: replace the node list with `<ReactFlow>`

**Done when**
- [ ] `pnpm test:board` passes every test in `task1-render.test.ts`
- [ ] `pnpm dev:board` shows boxes in columns, joined by lines (the boxes stay blank until task 2)
- [ ] Changing the scene in the dropdown changes the map

**Hint:** React Flow's [quickstart](https://reactflow.dev/learn) shows the `nodes` and `edges` arrays it expects. Your two functions just build those arrays from our data. Pass `nodeTypes={{ board: BoardNode }}` so each box uses our `BoardNode`. React Flow needs a parent with a real height, or the map renders 0px tall.
