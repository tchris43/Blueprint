# Demo script

Cast: **Chris** (PM), **Alice** (dev, SHOP-212 saved cards), **Bob** (dev, SHOP-219 guest checkout).
Sam (dev) works elsewhere and is never paused.

Target length: TODO (ask the organizers).

## Run sheet (what actually works, Oct 27)

The detection is real: the server merges both people's edits in memory and runs the TypeScript
compiler. The edits are sent by `scripts/demo.mjs` instead of typed by live agents ("these are the
exact edits the agents make"). Live agents were never rehearsed, so don't use them on stage.

**Before you go on (5 min):**
1. Terminal 1, repo root: `pnpm server`
2. Terminal 2: `cd board\lucid-extension; npx lucid-package@latest --mode pnpm test-editor-extension`
   (`EADDRINUSE` on 9900 = an old Lucid dev server is still running; stop it first)
3. Chrome: open the Lucid doc, **Developer > Enter developer mode**, then refresh arrow in the developer bar.
4. **blueprint-board > open live panel.** It must say "connected to Blueprint". **No panel = no updates.**
5. Terminal 3: `node scripts/demo.mjs reset`, then delete any old boxes on the canvas. The board redraws itself.

**On stage:**
| Beat | Type / click | Judges see |
|---|---|---|
| The two tickets | `node scripts/demo.mjs reset` | The map of demo-shop, all grey |
| Alice saves cards | `node scripts/demo.mjs alice` | Alice's change lands; nothing breaks |
| Bob makes guests possible | `node scripts/demo.mjs bob` | Terminal: "Bob's edit was REFUSED before it was saved". getUser + placeOrder turn red; Alice and Bob paused, Sam keeps working |
| Chris decides | Click a choice in the Lucid panel | Card turns green, boxes go "resolved", both agents resumed |
| Where it goes next | Mockup slides: `docs/mockup/scene-8-drift.png`, `scene-9-handoff-coverage.png` | Drift and history (not built) |

**Optional contrast beat:** run `reset` then `bob` without `alice`. Bob's edit is allowed, because
nothing depends on it yet. Blueprint only stops real breaks.

**Break glass:**
- Board stopped updating: is the panel open and "connected"? Restart `pnpm server`, reopen the panel.
- Lucid won't load at all: click through `docs/mockup/*.png` in order and narrate.
- Bob's edit was allowed when it shouldn't be: you skipped `alice`. Run it, then `bob` again.

| # | Scene | On screen | What we say | Who clicks |
|---|---|---|---|---|
| 1 | Two tickets | Map, all grey | TODO | — |
| 2 | Alice's agent works | Alice's boxes appear (blue, dashed) | TODO | Alice |
| 3 | Bob's agent works | Bob's boxes appear (orange) | TODO | Bob |
| 4 | Collision | getUser() turns red; Alice + Bob paused | TODO | — |
| 5 | Decide together | Product view, conflict card | TODO | Chris |
| 6 | Agents adapt | Decision appears in both terminals | TODO | — |
| 7 | Done | Boxes turn green | TODO | — |
| 8 | Drift check | cardCache.ts flagged yellow | TODO | Alice |
| 9 | Handoff | Click getUser(), history shows Chris's decision | TODO | Chris |

## Backup plan
- [ ] TODO: record the backup video on day 3
- [ ] TODO: if the live server fails, switch the board to "Sample scenes" and click through
