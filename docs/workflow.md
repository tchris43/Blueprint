# Team workflow

## Branches
Never work directly on `main`. Make a branch named `<who>/<what>`:
```
git checkout main
git pull
git checkout -b partner3/drift
```
Examples: `partner3/drift`, `partner3/coverage`, `partner2/board-task-1`, `taylor/code-map`.

## Saving and sharing your work
```
git add -A
git commit -m "drift: flag files that weren't in the plan"
pnpm test          # before EVERY push; must pass
pnpm test:drift    # your own module's tests (or test:board, test:coverage, …)
git push -u origin partner3/drift
```
Two kinds of tests:
- **`pnpm test`** runs only what's already finished (the contract check and the engine). It
  must pass before every push. If it fails, you broke something that worked, so fix that first.
- **`pnpm test:todo`** runs every teammate task (drift, coverage, explain, board). These fail on
  purpose until each task is done. Your own module's tests should go green as you work. It's fine
  that the others stay red.

When your module's tests all pass and Taylor merges it, he moves it from the "todo" list to the
"done" list in `scripts/run-tests.mjs`, so `pnpm test` protects it from then on.

## Getting it into main
1. On GitHub, open a **pull request** from your branch into `main`.
2. Taylor reviews it. Expect a question or two, which is part of learning.
3. Taylor merges it. Then `git checkout main && git pull` before starting your next branch.

## When you're stuck
1. **First, ask your AI to explain the error.** Paste the exact error text. Don't describe it from memory.
2. **Still stuck after ~15 minutes?** Message Taylor with:
   - the exact error text (copy-paste, not a screenshot of code)
   - what you were trying to do
   - what you already tried

## Rules that protect the demo
- Don't change `shared/contract.ts` or `shared/schema.ts` without telling the team first.
- Don't edit test files. If a test looks wrong, ask.
- Keep it simple. The demo is what matters.
