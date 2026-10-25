# Task 3: Scene buttons and the two toggles

**Goal:** the 1–9 scene buttons, a **Code / Product** view toggle, and a **Plans / Test coverage** layer toggle.

**Mockup:** [scene 9](../../docs/mockup/scene-9-handoff-coverage.png). The scene buttons are top right, and the toggles sit above the map.

**Files to touch**
- `board/web/src/Controls.tsx`: `SceneSwitcher` and `Toggle`
- `board/web/src/App.tsx`: use them, and keep `view` and `layer` in `useState`

**Done when**
- [ ] `pnpm test:board` passes every test in `task3-controls.test.tsx`
- [ ] Product view swaps every box to plain English (Priya's view)
- [ ] The Test coverage layer colors boxes by "% tested"
- [ ] Tab key + Enter can work every button (no mouse needed)

**Hint:** `aria-pressed={isActive}` on a `<button>` is both the accessible way to show "this one is on" and something you can style with CSS: `button[aria-pressed="true"] { … }`.
