# Team workflow

## Picking up work
All remaining work is in [tickets/](../tickets/README.md). Claim a ticket there (name in the Owner
column, status `in progress`), then commit and push that claim right away so everyone sees it.
One in-progress ticket per person.

## Everyone works on `main`
No branches, no pull requests. Everyone commits straight to `main` and pushes small and often.

What keeps us out of each other's way:
- **Each ticket stays in one area** (the Area column: `server`, `board-lucid`, `modules`, …), so two
  claimed tickets almost never touch the same files.
- **Claim before you start**, and push the claim, so nobody picks up the same ticket.
- **Shared files need a heads-up.** Tell the team before editing anything in `shared/` or any test.
  The ticket table in `tickets/README.md` is the one file everyone edits; conflicts there are a line
  or two and easy to fix.

## Saving and sharing your work
```
git pull --rebase    # get everyone else's work first
# ...make changes...
pnpm test            # before EVERY push; must pass
pnpm test:drift      # your ticket's own tests (or test:board, test:coverage, …)
git add -A
git commit -m "603: flag files that weren't in the plan"
git pull --rebase    # again, in case someone pushed meanwhile
git push
```
If `git pull --rebase` stops with a conflict, ask your AI tool to explain it, keep both people's
changes, then `git add` the file and `git rebase --continue`. Unsure? Ask the team before pushing.

Two kinds of tests:
- **`pnpm test`** runs only what's already finished (the contract check and the engine). It
  must pass before every push. If it fails, something that worked is now broken, so fix that first.
  With no pull requests, this is the only thing standing between a mistake and everyone's `main`.
- **`pnpm test:todo`** runs the tests for open tickets (drift, coverage, explain, board). These fail
  on purpose until each ticket is done. Your own ticket's tests go green as you work; the others
  staying red is expected.

## Finishing a ticket
1. Every box ticked and its tests pass.
2. Do the 2-minute explain-back with a teammate.
3. Move the ticket's test group from the "todo" list to the "done" list in `scripts/run-tests.mjs`,
   so `pnpm test` protects it from then on. Set its Status to `done` and push.

## When you're stuck
1. **First, ask your AI tool to explain the error.** Paste the exact error text rather than describing it.
2. **Still stuck after ~15 minutes?** Post in the team chat with:
   - the exact error text (copy-paste, not a screenshot of code)
   - what you were trying to do
   - what you already tried

## Rules that protect the demo
The working rules in [AGENTS.md](../AGENTS.md#working-rules-everyone-every-folder-with-or-without-ai)
apply to everyone. The two that protect the demo most:
- Don't change tests or anything in `shared/` without telling the team first.
- Keep it simple. The demo is what matters.
