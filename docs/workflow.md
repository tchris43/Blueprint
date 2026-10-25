# Team workflow

## Picking up work
All remaining work is in [tickets/](../tickets/README.md). Claim a ticket there (name in the Owner
column, status `in progress`). One in-progress ticket per person.

## Branches
Never work directly on `main`. Name the branch `<your-name>/<ticket-number>`:
```
git checkout main
git pull
git checkout -b sam/040
```

## Saving and sharing your work
```
git add -A
git commit -m "040: flag files that weren't in the plan"
pnpm test          # before EVERY push; must pass
pnpm test:drift    # your ticket's own tests (or test:board, test:coverage, …)
git push -u origin sam/040
```
Two kinds of tests:
- **`pnpm test`** runs only what's already finished (the contract check and the engine). It
  must pass before every push. If it fails, something that worked is now broken, so fix that first.
- **`pnpm test:todo`** runs the tests for open tickets (drift, coverage, explain, board). These fail
  on purpose until each ticket is done. Your own ticket's tests go green as you work; the others
  staying red is expected.

When a ticket's tests all pass and it's merged, Taylor moves its group from the "todo" list to the
"done" list in `scripts/run-tests.mjs`, so `pnpm test` protects it from then on.

## Getting it into main
1. On GitHub, open a **pull request** from your branch into `main`, and link the ticket.
2. Taylor reviews it, usually with a question or two about the choices you made.
3. Taylor merges it. Then `git checkout main && git pull` before starting your next branch.

## When you're stuck
1. **First, ask your AI tool to explain the error.** Paste the exact error text rather than describing it.
2. **Still stuck after ~15 minutes?** Message Taylor with:
   - the exact error text (copy-paste, not a screenshot of code)
   - what you were trying to do
   - what you already tried

## Rules that protect the demo
The working rules in [AGENTS.md](../AGENTS.md#working-rules-everyone-every-folder-with-or-without-ai)
apply to everyone. The two that protect the demo most:
- Don't change tests or anything in `shared/` without telling the team first.
- Keep it simple. The demo is what matters.
