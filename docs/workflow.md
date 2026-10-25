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
pnpm test          # before EVERY push
git push -u origin partner3/drift
```
About `pnpm test`: your own tests should pass. Tests for modules someone else hasn't finished
yet are expected to fail. That's normal. Make sure you didn't break anything that was passing before.

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
