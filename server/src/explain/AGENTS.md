# explain module

The team-wide working rules in the root `AGENTS.md` apply here: explain the plan before writing
code, work in small steps, don't edit tests or `shared/` without telling the team, and be able to
explain your piece in 2 minutes.

- **Tests for this folder:** `pnpm test:explain`. Run them after every step.
- **Start here:** `README.md` in this folder, then the numbered steps above `explainConflict`.
- **Tests here define done:** `explainConflict.test.ts`. If one looks wrong, explain why and stop; don't change it.
- The prompt inside `explainConflict` belongs to the ticket owner. Suggest and critique wording; don't replace it wholesale.
- `callModel.ts` and `fallbacks.ts` are shared plumbing. Leave them as they are.
