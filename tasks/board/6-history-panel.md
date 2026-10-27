# Task 6: Click a box to see its history

**Goal:** clicking any box opens a panel with everything that happened to it: what changed, what was decided, and why.

**Mockup:** [scene 9](../../docs/mockup/scene-9-handoff-coverage.png): the "getUser() · history and why" panel.

**Files to touch**
- New file `board/web/src/HistoryPanel.tsx`
- `board/web/src/App.tsx`: keep `selectedId` in state, set it from React Flow's `onNodeClick`, pass `selectedId` to `toFlowNodes` so the box gets highlighted

**Done when**
- [ ] Clicking `getUser()` in scene 9 shows all 5 history lines, including Chris's decision
- [ ] The panel has a close button with `aria-label="Close history"`
- [ ] The clicked box has a visible highlight
- [ ] (Stretch) Write one test for it yourself, copying the style of `task4-conflict-card.test.tsx`

**Hint:** each entry in `node.history` has `at` (a date string) and `text`. `entry.at.slice(0, 10)` gives just the date.
