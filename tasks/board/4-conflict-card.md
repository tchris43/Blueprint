# Task 4: The conflict card

**Goal:** when two people's work collides, show a card explaining it, with a "Why was this flagged?" section that holds the proof.

**Mockup:** [scene 4](../../docs/mockup/scene-4-collision.png): the red card and the "Why was this flagged?" box under the map.

**Files to touch**
- `board/web/src/ConflictCard.tsx`
- `board/web/src/App.tsx`: render one card per `state.conflicts`

**Done when**
- [ ] `pnpm test:board` passes every test in `task4-conflict-card.test.tsx`
- [ ] Product view shows the plain-English summary, and Code view shows the technical line
- [ ] "Why was this flagged?" opens to show the diff, the broken line and the compiler error in a code font
- [ ] After scene 5 the card shows Priya's decision instead of buttons

**Hint:** HTML's `<details><summary>Why was this flagged?</summary>…</details>` gives you open/close for free, with no state needed.
