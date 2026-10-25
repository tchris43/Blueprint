// Task 3 — see tasks/board/3-scene-switcher-and-toggles.md

/**
 * Buttons 1-9, one per demo scene (top right of every mockup screenshot).
 * `current` and `onChange` use 0-based indexes; the buttons SHOW 1-9.
 * Each button: aria-pressed (true only for the current one) and aria-label "Scene N: <title>".
 */
export function SceneSwitcher(props: { titles: string[]; current: number; onChange: (index: number) => void }) {
  return null; // TODO: task 3
}

/**
 * A row of buttons where exactly one is "on", e.g. Code | Product, or Plans | Test coverage.
 * Wrap them in an element with role="group" and aria-label={label}.
 * Each button's text is the option's label; aria-pressed is true for the active one.
 */
export function Toggle<T extends string>(props: { label: string; value: T; options: [T, string][]; onChange: (value: T) => void }) {
  return null; // TODO: task 3
}
