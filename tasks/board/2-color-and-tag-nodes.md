# Task 2: Color and label each box

**Goal:** each box shows what is happening to it, using the mockup's legend:
dashed border = in progress (in the owner's color), red = conflict, green = built, yellow dashed = drift (not in plan).

**Mockup:** [scene 4](../../docs/mockup/scene-4-collision.png): look at the legend under the map and at the "CONFLICT · DECIDE" box.

**Files to touch**
- `board/web/src/NodeCard.tsx`
- `board/web/src/styles.css` (status classes like `.status-conflict` are already there to use or change)

**Done when**
- [ ] `pnpm test:board` passes every test in `task2-node-card.test.tsx`
- [ ] Scenes 2–9 look like the mockup's boxes: tag line on top, name in the middle, file or description underneath
- [ ] Bob's boxes are orange and Alice's are blue (use `owner.color`)

**Hint:** put `data-status={node.status}` and `className={"board-node status-" + node.status}` on the outer `<div>`, and let CSS do the coloring. A lookup object `{ conflict: "Conflict · decide", … }` keeps the tag text tidy.
