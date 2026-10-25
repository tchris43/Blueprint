# 030 · Web board: draw the map and color the boxes (tasks 1–2)

**Labels:** `medium` · `board-web` · `build`  
**Depends on:** nothing  
**Owner:** _unclaimed_

## Why it matters
The backup board for every scene, if Lucid misbehaves on demo day. Also the fastest way to see the sample data as a real map.

## What to do
- Follow `tasks/board/1-render-nodes-and-edges.md` then `tasks/board/2-color-and-tag-nodes.md`.

## Tests
**Existing tests:** `board/web/src/__tests__/task1-render.test.ts`, `task2-node-card.test.tsx` (`pnpm test:board`).

## Done when
- [ ] Both test files pass
- [ ] `pnpm dev:board` shows scene 4 looking like the mockup's map
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Animate the red edge in scene 4.
