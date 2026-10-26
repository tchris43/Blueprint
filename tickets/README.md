# Tickets

The team's backlog. Each ticket is 1–3 hours and touches one area, so two people never edit the same files.

## How to claim a ticket
1. Pick one whose **Depends on** tickets are done.
2. Put your name in its **Owner** line *and* in the table below, set Status to `in progress`, and commit that change.
3. Push that commit to `main` right away so nobody else picks it up. We all work on `main`; see [docs/workflow.md](../docs/workflow.md).
4. When it's done (every box ticked, including the 2-minute explain-back with a teammate), set Status to `done` and push.

**Only one in-progress ticket per person.** Finish or un-claim before taking another.

**Difficulty:** `starter` = small and self-contained · `medium` = more moving parts · `core` = engine work on the critical path.  
**Type:** `build` = tests define done · `design` = propose options, the team picks · `verify` = try to break it and report · `story` = demo, pitch, writing.

> **Tests marked "proposed"** (tickets 001, 002, 004, 005, 006, 007, 008, 009, 010, 011, 012, 021, 022, 023, 024, 025, 026, 027, 028) get a quick look from the team before anyone starts those tickets.

## Critical path: end-to-end demo by midday, day 2
Three tracks run in parallel and meet at the live rehearsal:

```
Server (Taylor):   004 code map → 005 edits/conflicts → nodes → 009 decision resumes agents
                   001 post hook ┐
                   002 pre hook  ┴→ real agents in the loop
Lucid board:       020 move spike → 021 draw map → 022 status styles → 023 conflict card → 024 decision buttons
Demo story:        070 demo script (exact prompts)
                                   ↓
                    013 live-agent rehearsal  →  end-to-end demo works
```

After midday day 2: 011 reset and 010 replay (rehearsal safety), then 073 backup video.  
**Fallback:** if 020–021 aren't working by the morning of day 2, switch the demo to the web board (030–032).

## Already done (no ticket needed)
- Combined check (`server/src/combinedCheck.ts`), proven on the demo conflict at `checkout/order.ts:47`
- Server endpoints, `/live` WebSocket, `POST /reset`, `POST /demo/scene`
- Hook scripts (curl-tested only; 001/002 test them for real)
- Contract + schema + sample data for all 9 scenes; web board shell; module stubs with tests

## All tickets

| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [001](001-post-hook-real-edits.md) ★ | PostToolUse hook: real agent edits reach the server | core | server | build | — | Taylor | todo |
| [002](002-pre-hook-pause-and-decision.md) ★ | PreToolUse hook: pause during a conflict, deliver the decision | core | server | build | 001 | Taylor | todo |
| [003](003-design-intent-announcement.md) | Decide how agents announce which files they plan to touch | core | server | design | — | Taylor | todo |
| [004](004-code-map-ts-morph.md) ★ | Code map: build nodes and edges from demo-shop with ts-morph | core | server | build | — | Taylor | todo |
| [005](005-conflict-to-nodes.md) ★ | Edits and conflicts update the map's boxes and history | core | server | build | 004 | Taylor | todo |
| [006](006-evidence-diff.md) | Show the other person's actual diff in the conflict evidence | core | server | build | — | Taylor | todo |
| [007](007-same-file-conflicts.md) | Same-file conflicts reach the board | core | server | build | 005 | Taylor | todo |
| [008](008-wire-modules.md) | Wire drift, explain and coverage into the server | core | server | build | 040, 041, 042, 004 | Taylor | todo |
| [009](009-decision-resumes-agents.md) ★ | POST /decision: record it, resume both agents, refuse flip-flops | core | server | build | 005, 008 | Taylor | todo |
| [010](010-replay-mode.md) | Replay mode: record a good run, replay it on stage | core | server | build | 005 | Taylor | todo |
| [011](011-rehearsal-reset.md) | One command resets everything for a rehearsal | core | server | build | 021 | Taylor | todo |
| [012](012-serialize-checks.md) | Run combined checks one at a time | core | server | build | — | Taylor | todo |
| [013](013-live-agent-rehearsal.md) ★ | Does the conflict really happen with live agents? | medium | demo-shop | verify | 070, 001, 002 |  | todo |
| [014](014-check-before-edit.md) ★ | Check before the edit lands, not after | core | server | build | 001 | Taylor | todo |
| [020](020-lucid-move-spike.md) ★ | Move the Lucid spike into the repo and point it at our server | medium | board-lucid | build | — |  | todo |
| [021](021-lucid-render-board.md) ★ | Lucid: draw the whole map from BoardState, in columns | medium | board-lucid | build | 020 |  | todo |
| [022](022-lucid-status-styles.md) ★ | Lucid: status styles that match the mockup legend | medium | board-lucid | build | 021 |  | todo |
| [023](023-lucid-panel-conflict-card.md) ★ | Lucid panel: conflict card with 'Why was this flagged?' | medium | board-lucid | build | 020 |  | todo |
| [024](024-lucid-panel-decision.md) ★ | Lucid panel: decision buttons post to the server | medium | board-lucid | build | 023, 009 |  | todo |
| [025](025-lucid-view-toggle.md) | Lucid panel: Product / Code view toggle | medium | board-lucid | build | 021, 023 |  | todo |
| [026](026-lucid-history.md) | Lucid: click a block to see its history | medium | board-lucid | build | 023 |  | todo |
| [027](027-lucid-coverage-layer.md) | Lucid: test coverage layer | medium | board-lucid | build | 022, 025 |  | todo |
| [028](028-lucid-drift.md) | Stretch — Lucid: show drift and keep/remove it | medium | board-lucid | build | 022, 008 |  | todo |
| [030](030-web-tasks-1-2.md) | Web board: draw the map and color the boxes (tasks 1–2) | medium | board-web | build | — |  | todo |
| [031](031-web-tasks-3-4.md) | Web board: scene buttons, toggles and the conflict card (tasks 3–4) | medium | board-web | build | 030 |  | todo |
| [032](032-web-tasks-5-7.md) | Web board: decisions, history and going live (tasks 5–7) | medium | board-web | build | 031 |  | todo |
| [040](040-module-drift.md) | Drift detector | starter | modules | build | — |  | todo |
| [041](041-module-coverage.md) | Coverage mapper | starter | modules | build | — |  | todo |
| [042](042-module-explain.md) | Conflict explainer — write the prompt | starter | modules | build | — |  | todo |
| [043](043-labels-json.md) | Plain-English names for every box (labels.json) | starter | modules | build | — |  | todo |
| [050](050-design-lucid-look.md) | Design the Lucid board's look — two versions | medium | board-lucid | design | 022 |  | todo |
| [051](051-design-priya-test.md) | Test Priya's decision panel on a real non-technical person | starter | demo-pitch | design | 024 |  | todo |
| [052](052-design-plain-copy.md) | Plain-English copy for every status and card | starter | demo-pitch | design | — |  | todo |
| [060](060-verify-unexpected-edits.md) | Try 5 unexpected edits and record what Blueprint does | starter | demo-shop | verify | 001, 005 |  | todo |
| [061](061-verify-fresh-setup.md) | Fresh-machine setup using only the README | starter | demo-pitch | verify | — |  | todo |
| [062](062-verify-lucid-spike-gaps.md) | Check what the Lucid spike never verified | starter | board-lucid | verify | 020 |  | todo |
| [070](070-story-demo-script.md) ★ | Demo script with the exact prompts Alice and Bob type | starter | demo-pitch | story | — |  | todo |
| [071](071-story-pitch-competitors.md) | Pitch outline and the competitor slide | starter | demo-pitch | story | — |  | todo |
| [072](072-story-real-quote.md) | Get a real quote: 'How do you find out what devs actually built?' | starter | demo-pitch | story | — |  | todo |
| [073](073-story-backup-video.md) | Record the backup demo video | medium | demo-pitch | story | 024, 009, 011, 070 |  | todo |
| [080](080-stretch-dogfood.md) | Stretch — run Blueprint on the Blueprint repo itself | medium | server | verify | 005, 001 |  | todo |

★ = on the critical path.
