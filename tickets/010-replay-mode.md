# 010 · Replay mode: record a good run, replay it on stage

**Labels:** `core` · `server` · `build`  
**Depends on:** [005](005-conflict-to-nodes.md)  
**Owner:** Taylor

## Why it matters
Insurance for the live demo: if an agent wanders on stage, we replay the rehearsal's exact events and the board does the same thing.

## What to do
- Record every `POST /edits`, `/intent`, `/decision` body with a timestamp to `replays/<name>.jsonl` when `BLUEPRINT_RECORD=<name>`.
- Add `pnpm replay <name> [--speed 2]` that resets the server and re-posts them with the same gaps (scaled).

## Tests
**Tests to add** *(proposed — Taylor reviews these before anyone starts)*
New file `server/test/replay.test.ts`:
- recording writes one JSON line per request, in order, with the body unchanged
- replay posts the requests in the same order
- with fake timers, `--speed 2` halves the gaps between requests
- replaying the demo recording ends with one decided conflict on the board

## Done when
- [ ] Tests pass
- [ ] A full rehearsal recorded and replayed end to end on the real board
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
A 'step' mode: press Enter to send the next event, so the presenter controls pacing.
