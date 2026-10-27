# Prompt 2: set the repo up for teammates

> Run this after the kickoff prompt has finished. Paste everything below the line into Claude Code, in the `blueprint` repo.

---

Now set the repo up so my two teammates can each own real coding work, with AI help, without me doing it for them. **You write the "what": function signatures, failing tests, example inputs and outputs, and clear instructions. They write the "how."** Don't implement their modules.

## Teammates

- **Partner 2:** some coding experience, uses AI. Owns the **board**: `board/web` first, then the Lucid extension spike.
- **Partner 3:** first-year CS student, new to most of this, willing. Owns three **small pure-function modules** that power real demo moments, plus `shared/labels.json`. Whether he has an AI tool is still to be confirmed (GitHub Copilot through the Student Developer Pack, or Claude). Write his instructions so they work with any AI chat, and even without one.

## 1. Lock the contract

- Add `shared/schema.ts`: zod schemas mirroring `contract.ts`.
- Add a test that validates every scene in `sample-state.json` against it.
- Add `pnpm check:contract`.
- If anyone's code produces invalid state, a test fails, not the demo.

## 2. Partner 3's modules (one folder each under `server/src/`)

Each folder contains:
- A stub file with the exact exported signature and a doc comment (behavior plus example in/out). The body is just `throw new Error("TODO")`.
- A **complete, failing** vitest test file I can trust. Start with easy cases and end with one edge case.
- A `README.md` written for a beginner: what this does in the demo, which scene uses it, the inputs and outputs with examples, the steps, how to run only these tests, and "you're done when…".

The modules:

1. **`drift/`**: `detectDrift(intents: Record<participant, string[]>, edits: Record<participant, string[]>): Drift[]`
   - A file edited but not in that participant's intent list is drift.
   - Powers scene 8 (cardCache.ts).
2. **`coverage/`**: `mapCoverage(coverageJson: IstanbulSummary, nodes: MapNode[]): Record<nodeId, number>`
   - Turns vitest's `coverage-summary.json` (include a small fixture) into a percentage per node, matched by file.
   - Powers the Test coverage layer.
3. **`explain/`**: `explainConflict(evidence: Conflict["evidence"], labels: Labels): Promise<{plainSummary, question, options}>`
   - Calls the Anthropic API with a prompt **they** write.
   - Must return the hard-coded fallback for the demo conflict if the API key is missing or the call fails.
   - Tests cover the fallback and the output shape; mock the API call.
   - Powers scene 4's plain-English question.
4. **`shared/labels.json`:** a plain-English name and description for every node in demo-shop. Leave stubs with TODO.

## 3. Partner 2's board tasks

Create these as numbered markdown task files in `tasks/board/`, from small to big. Each one has:
- goal
- which mockup scene it matches
- files to touch
- done-when checklist
- one hint

The tasks:
1. Render nodes and edges from one scene of `sample-state.json`, positioned by column.
2. Color and tag nodes by status. Match the mockup legend: dashed = in progress, red = conflict, green = built, yellow dashed = drift.
3. Scene switcher, plus the Code/Product view toggle and the Plans/Coverage layer toggle.
4. Conflict card with the "Why was this flagged?" evidence.
5. Decision buttons that `POST /decision`. Mock the server until it's ready.
6. Click a node to open its history panel.
7. Connect to the websocket `/live`, replacing the sample data.
8. **Lucid spike (time-boxed to 2 hours):** follow the steps in the brief. Write down what worked in `tasks/board/lucid-findings.md`.

For tasks 1–4, write the rendering tests yourself (vitest + Testing Library, using the scene fixtures): "scene-4 shows a conflict card containing 'TS2531'", "getUser node has conflict status". Partner 2 makes them pass.

## 4. Mockup reference

- Put the mockup screenshots I give you in `docs/mockup/` (scene-4.png and so on).
- In each board task, link the screenshot it should resemble.
- The mockup is a reference for **behavior and layout, not pixels**.

## 5. Beginner guardrails

- Add a `CLAUDE.md` in `server/src/drift`, `server/src/coverage`, `server/src/explain` and `board/`. It tells any AI working there:
  - **"The person you're helping is learning. Before writing code, explain your plan in plain words and wait for them to agree."**
  - Work in small steps, and run the folder's tests after each one.
  - Never edit test files, `shared/contract.ts` or `shared/schema.ts`. If a test seems wrong, explain why and stop.
  - After finishing, explain each function in 2–3 sentences so the person can present it.
- Add `docs/how-to-work-with-ai.md` for my teammates, including a copy-paste starting prompt: "Read CLAUDE.md and README.md in this folder. Explain what this module does and your plan before writing code. Then help me make the tests pass one at a time. Don't edit the tests."
- Add `docs/workflow.md`:
  - branch naming (`partner3/drift`)
  - `pnpm test` before every push
  - open a pull request, and Taylor reviews
  - what to do when stuck: first ask your AI to explain the error, then message Taylor with the error text plus what you tried.

## 6. One-command setup check

- Add `pnpm doctor`: checks the Node version, pnpm, installed deps, and that the tests run.
- Add `pnpm dev:board` and `pnpm test:<module>` scripts.

Each teammate runs `pnpm doctor` on day 1 with me next to them.

## 7. Integration plan

Add `docs/integration.md` that shows exactly where each teammate's module plugs into the server's main loop. Give file and line, plus the one function call. Wiring it in is my job.

When finished, list:
- every task file and module
- which tests currently fail on purpose
- anything you need from me

## AI instruction files (team uses both Claude Code and Cursor)
Wherever this brief says CLAUDE.md, write the real instructions in an `AGENTS.md` in that folder (root and per-folder). Then add a `CLAUDE.md` next to each one whose only line is `@AGENTS.md`, so Claude Code and Cursor read the same rules. Put tool-specific notes under that import line only if truly needed. (Exception: demo-shop's own CLAUDE.md/AGENTS.md describe normal project conventions only, as stated above.)
