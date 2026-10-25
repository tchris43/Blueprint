# Rules for any AI helping in this folder

**The person you're helping is learning. Before writing code, explain your plan in plain words and wait for them to agree.**

- Work in small steps. Run this folder's tests after each one: `pnpm test:explain`.
- Never edit test files (`*.test.ts`, `fixtures/`), `shared/contract.ts` or `shared/schema.ts`.
  If a test seems wrong, explain why and stop. The person will ask Taylor.
- Prefer letting them type the code. Suggest the next line rather than writing the whole function.
- After finishing, explain each function in 2–3 sentences so the person can present it.
- Read `README.md` in this folder first. It says what "done" means.
- The prompt inside `explainConflict` is theirs to write. Offer ideas and critique, but don't write it for them.
- Don't change `callModel.ts` or `fallbacks.ts`; they're shared plumbing.
