# Blueprint: shared instructions for every AI working in this repo

Read by Claude Code (via `CLAUDE.md` → `@AGENTS.md`) and Cursor. Folders can add their own `AGENTS.md`.

## What we're building
A 3-day hackathon project (Lucid Software sponsors; theme: **collaboration**; judged on scope,
innovation, completeness). **Keep it simple. The demo is what matters.**

**Problem:** each teammate's coding agent works privately. Real decisions come up mid-build
("should `getUser()` return null for guests?"), whoever hits one decides alone, and other people's
work breaks silently. Today that's found at code review, at merge, or in production.

**Blueprint** is a shared, live map of the codebase. Every teammate's agent reports to it as it works.
- Agents work freely. Nothing waits for approval up front.
- After every edit, Blueprint merges everyone's in-progress work **in memory** (never touching
  anyone's branch) and type-checks the combination.
- When one person's change breaks another's, Blueprint pauses **only those two agents**, turns the
  compiler error into a plain-English question, and puts it on the shared board. A non-technical PM
  sees a plain-English "Product view".
- The decision flows back into both agents as instructions, and they resume.
- Every box keeps its history (what changed, what was decided, why), so the map becomes living documentation.
  Optional layers: plan vs. actual ("drift") and test coverage.

## The demo story (everything serves this)
Priya (PM), Alice and Bob (devs) each run Claude Code. Sam (dev) is unaffected. App: `demo-shop`.
1. SHOP-212 (Alice): save cards. Her agent writes `saveCard(getUser().id, card)` in `checkout/order.ts`.
2. SHOP-219 (Bob): guest checkout. His agent changes `getUser(): User` to `User | null`.
3. The combined check fails: `checkout/order.ts:47 error TS2531: Object is possibly 'null'`. Only Alice and Bob pause.
4. Priya picks on the board: "No, offer guests 'Create an account'" / "Yes, save against a verified email".
5. Both agents get the decision and resume. Done: combined tests pass.
6. Drift: Alice's agent added `cardCache.ts`, unannounced and untested. It's flagged, and Alice keeps or removes it.
7. Handoff: clicking `getUser()` shows its full history, including Priya's decision.

Screens: `docs/mockup/`. Sample data for every scene: `shared/sample-state.json` (`scene-0`… = screen 1…).

## Architecture
```
Claude Code (Alice) --hooks--> Blueprint server <--ws /live--> Board (Lucid extension, or web board)
Claude Code (Bob)   --hooks-->       |
                          combined check: base + Alice + Bob → tsc   (server/src/combinedCheck.ts)
```

## Who owns what
| Area | Owner |
|---|---|
| `server/` engine, `hooks/`, wiring, `shared/contract.ts` | Taylor |
| `board/web`, `board/lucid-extension` (`tasks/board/`) | Partner 2 |
| `server/src/drift`, `server/src/coverage`, `server/src/explain`, `shared/labels.json`, `docs/` | Partner 3 |

## Rules
- **Never change `shared/contract.ts` or `shared/schema.ts` without telling the team.** `pnpm check:contract` guards them.
- Never edit someone else's tests to make them pass. If a test seems wrong, stop and say so.
- Prefer boring, simple code. Don't build auth, databases, deployment, or non-TypeScript support.
- Work on a branch and merge by pull request (`docs/workflow.md`).
- Folders with a beginner `AGENTS.md` (`board/`, `server/src/drift|coverage|explain`): explain your plan first and wait for agreement.
- Package manager is pnpm. Run `pnpm doctor` if setup seems off.
