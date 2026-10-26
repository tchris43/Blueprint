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

> **Tests marked "proposed"** (tickets 101–105, 201–204, 206–209, 303, 304, 402, 404, 501–503, 601, 605–607) get a quick look from the team before anyone starts those tickets.

## How the tickets are ordered: rings, inside out
Tickets are grouped in rings, like a target. Ring 1 is the smallest loop that proves the idea; each
ring after it wraps more around that loop. **The first digit of a ticket's number is its ring**, and a
ticket only depends on tickets in its own ring or an inner one.

| Ring | What works once it's done |
|---|---|
| **1 · Catch it** | Two real agents edit; a break between their changes is caught *before* the edit lands, and both agents stop |
| **2 · Show it and decide** | The break appears on the Lucid map with its evidence; one click from a person resumes both agents |
| **3 · Run it on stage** | The demo is scripted, rehearsed with live agents, resettable, replayable, and backed up on video |
| **4 · Speak the PM's language** | Plain-English questions, names and copy, so a non-technical person can decide alone |
| **5 · Catch more kinds of break** | Same-file edits, breaks only the tests see, broken assumptions, odd edits |
| **6 · Beyond conflicts** | History per box, drift (work nobody planned), and test coverage on the map |
| **7 · Pitch and fallbacks** | The pitch, a real quote, the web board backup, fresh-machine setup, dogfooding |

Work inside out, but outer rings aren't blocked: a `starter` ticket in any ring (labels, prompts,
modules, pitch) can be picked up any time by someone not working on the inner loop.

## Critical path: end-to-end demo by midday, day 2
Rings 1–3 are the critical path. Three tracks run in parallel and meet at the live rehearsal:

```
Ring 1 · server:   101 post hook → 102 check before edit → 105 one check at a time
                              └→ 103 pre hook pause → 104 pause on any tool  → real agents in the loop
Ring 2 · server:   201 code map → 202 edits/conflicts → nodes → 203 decision resumes agents
Ring 2 · Lucid:    205 move spike → 206 draw map → 207 status styles → 208 conflict card → 209 decision buttons
Ring 3 · story:    301 demo script (exact prompts)
                                   ↓
                    302 live-agent rehearsal  →  end-to-end demo works
```

After midday day 2: 303 reset and 304 replay (rehearsal safety), then 306 backup video.  
**Fallback:** if 205–206 aren't working by the morning of day 2, switch the demo to the web board (704–706). Someone should start 704 early so it's ready.

## Already done (no ticket needed)
- Combined check (`server/src/combinedCheck.ts`), proven on the demo conflict at `checkout/order.ts:47`
- Server endpoints, `/live` WebSocket, `POST /reset`, `POST /demo/scene`
- Hook scripts (curl-tested only; 101/103 test them for real)
- Contract + schema + sample data for all 9 scenes; web board shell; module stubs with tests

## All tickets
★ = on the critical path.

### Ring 1 · Catch it
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [101](101-post-hook-real-edits.md) ★ | PostToolUse hook: real agent edits reach the server | core | server | build | — | Taylor | todo |
| [102](102-check-before-edit.md) ★ | Pre-edit combined check: deny a conflicting edit before it's saved | core | server | build | 101 | Taylor | todo |
| [103](103-pre-hook-pause-and-decision.md) ★ | PreToolUse hook: pause during a conflict, deliver the decision | core | server | build | 101 | Taylor | todo |
| [104](104-pause-on-any-tool.md) ★ | A paused agent stops on its next action of any kind | core | server | build | 103 | Taylor | todo |
| [105](105-serialize-checks.md) | Run combined checks one at a time | core | server | build | 102 | Taylor | todo |

### Ring 2 · Show it and decide
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [201](201-code-map-ts-morph.md) ★ | Code map: build nodes and edges from demo-shop with ts-morph | core | server | build | — | Taylor | todo |
| [202](202-conflict-to-nodes.md) ★ | Edits and conflicts update the map's boxes and history | core | server | build | 201 | Taylor | todo |
| [203](203-decision-resumes-agents.md) ★ | POST /decision: record it, resume both agents, refuse flip-flops | core | server | build | 202, 102 | Taylor | todo |
| [204](204-evidence-diff.md) | Show the other person's actual diff in the conflict evidence | core | server | build | — | Taylor | todo |
| [205](205-lucid-move-spike.md) ★ | Move the Lucid spike into the repo and point it at our server | medium | board-lucid | build | — |  | todo |
| [206](206-lucid-render-board.md) ★ | Lucid: draw the whole map from BoardState, in columns | medium | board-lucid | build | 205 |  | todo |
| [207](207-lucid-status-styles.md) ★ | Lucid: status styles that match the mockup legend | medium | board-lucid | build | 206 |  | todo |
| [208](208-lucid-panel-conflict-card.md) ★ | Lucid panel: conflict card with 'Why was this flagged?' | medium | board-lucid | build | 205 |  | todo |
| [209](209-lucid-panel-decision.md) ★ | Lucid panel: decision buttons post to the server | medium | board-lucid | build | 208, 203 |  | todo |

### Ring 3 · Run it on stage
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [301](301-story-demo-script.md) ★ | Demo script with the exact prompts Alice and Bob type | starter | demo-pitch | story | — |  | todo |
| [302](302-live-agent-rehearsal.md) ★ | Does the conflict really happen with live agents? | medium | demo-shop | verify | 301, 101, 103 |  | todo |
| [303](303-rehearsal-reset.md) | One command resets everything for a rehearsal | core | server | build | 206 | Taylor | todo |
| [304](304-replay-mode.md) | Replay mode: record a good run, replay it on stage | core | server | build | 202 | Taylor | todo |
| [305](305-verify-lucid-spike-gaps.md) | Check what the Lucid spike never verified | starter | board-lucid | verify | 205 |  | todo |
| [306](306-story-backup-video.md) | Record the backup demo video | medium | demo-pitch | story | 209, 203, 303, 301 |  | todo |

### Ring 4 · Speak the PM's language
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [401](401-module-explain.md) | Conflict explainer — write the prompt | starter | modules | build | — |  | todo |
| [402](402-wire-explainer.md) | Wire the conflict explainer into the server | core | server | build | 401, 102 | Taylor | todo |
| [403](403-labels-json.md) | Plain-English names for every box (labels.json) | starter | modules | build | — |  | todo |
| [404](404-lucid-view-toggle.md) | Lucid panel: Product / Code view toggle | medium | board-lucid | build | 206, 208 |  | todo |
| [405](405-design-plain-copy.md) | Plain-English copy for every status and card | starter | demo-pitch | design | — |  | todo |
| [406](406-design-lucid-look.md) | Design the Lucid board's look — two versions | medium | board-lucid | design | 207 |  | todo |
| [407](407-design-priya-test.md) | Test Priya's decision panel on a real non-technical person | starter | demo-pitch | design | 209 |  | todo |

### Ring 5 · Catch more kinds of break
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [501](501-same-file-conflicts.md) | Same-file conflicts reach the board | core | server | build | 202 | Taylor | todo |
| [502](502-layer-2-combined-tests.md) | Layer 2: run the related tests on the combined code | medium | server | build | 102 |  | todo |
| [503](503-layer-3-assumption-review.md) | Stretch — Layer 3: ask Claude whether one change breaks the other's assumptions | medium | modules | build | 204, 502 |  | todo |
| [504](504-verify-unexpected-edits.md) | Try 5 unexpected edits and record what Blueprint does | starter | demo-shop | verify | 101, 202 |  | todo |

### Ring 6 · Beyond conflicts: history, drift, coverage
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [601](601-lucid-history.md) | Lucid: click a block to see its history | medium | board-lucid | build | 208 |  | todo |
| [602](602-design-intent-announcement.md) | Decide how agents announce which files they plan to touch | core | server | design | — | Taylor | todo |
| [603](603-module-drift.md) | Drift detector | starter | modules | build | — |  | todo |
| [604](604-module-coverage.md) | Coverage mapper | starter | modules | build | — |  | todo |
| [605](605-wire-drift-coverage.md) | Wire drift and coverage into the server | core | server | build | 603, 604, 201 | Taylor | todo |
| [606](606-lucid-coverage-layer.md) | Lucid: test coverage layer | medium | board-lucid | build | 207, 404 |  | todo |
| [607](607-lucid-drift.md) | Stretch — Lucid: show drift and keep/remove it | medium | board-lucid | build | 207, 605 |  | todo |

### Ring 7 · Pitch and fallbacks
| # | Title | Difficulty | Area | Type | Depends on | Owner | Status |
|---|---|---|---|---|---|---|---|
| [701](701-story-pitch-competitors.md) | Pitch outline and the competitor slide | starter | demo-pitch | story | — |  | todo |
| [702](702-story-real-quote.md) | Get a real quote: 'How do you find out what devs actually built?' | starter | demo-pitch | story | — |  | todo |
| [703](703-verify-fresh-setup.md) | Fresh-machine setup using only the README | starter | demo-pitch | verify | — |  | todo |
| [704](704-web-tasks-1-2.md) | Web board: draw the map and color the boxes (tasks 1–2) | medium | board-web | build | — |  | todo |
| [705](705-web-tasks-3-4.md) | Web board: scene buttons, toggles and the conflict card (tasks 3–4) | medium | board-web | build | 704 |  | todo |
| [706](706-web-tasks-5-7.md) | Web board: decisions, history and going live (tasks 5–7) | medium | board-web | build | 705 |  | todo |
| [707](707-stretch-dogfood.md) | Stretch — run Blueprint on the Blueprint repo itself | medium | server | verify | 202, 101 |  | todo |
