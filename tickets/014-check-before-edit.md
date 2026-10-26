# 014 · Check before the edit lands, not after

**Labels:** `core` · `server` · `build`  
**Depends on:** [001](001-post-hook-real-edits.md)  
**Owner:** Taylor

## Why it matters
This is the pitch: Blueprint is a smart layer on top of git that catches a silent break **before
the code is written**, while it's still cheap to change course. Today the check runs after the edit
is saved to disk. Decided 2026-10-26 (Taylor): move it before the edit. A 1–3s wait before each
edit is acceptable.

## What to do
- **Pre hook builds the proposed file.** Claude Code gives the hook the edit before it happens:
  - `Write` → `tool_input.content` is the whole new file
  - `Edit` → read the current file, replace `old_string` with `new_string` (all of them if `replace_all`)
  - `MultiEdit` → apply each edit in `tool_input.edits` in order
- **New endpoint `POST /check`** `{participant, files}`: run the combined check of the proposed files
  (on top of this person's existing changes) against each teammate's changes. **Don't store them as
  an edit** — the edit hasn't happened. If there's a conflict: record it, pause both people, and reply
  `{paused: true, conflict}`.
- Pre hook: a conflict → `permissionDecision: "deny"` with the plain summary. The edit never lands.
- Keep the post hook and `/edits` as they are. They still record what was actually written, and they
  are the backstop for edits the pre hook never sees (see below).
- Move the shared check-and-record code out of the `/edits` handler so `/check` and `/edits` both use it.
- Update the demo story in `AGENTS.md` and `docs/demo-script.md`: Bob's `getUser()` change is refused
  before it's written.

## Things to watch
- **Edits made through the shell skip the pre hook.** `sed`, `echo >`, a script — none go through
  Edit/Write. The post hook doesn't see them either. Note this as a known gap; don't fix it for the demo.
- If the server is down, the pre hook must still let the edit through (as it does today).
- An `Edit` whose `old_string` isn't in the file will fail in Claude Code anyway; the hook should skip
  the check rather than guess.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
- Alice's change already recorded, Bob proposes `getUser(): User | null` → deny, the reason mentions `getUser`, and Bob's `account/user.ts` on disk is unchanged
- the same proposal with no other participants → allowed, no conflict recorded
- a denied proposal is NOT stored as Bob's change (a later harmless edit by Bob doesn't conflict)
- `Edit` with `replace_all` builds the proposed file correctly; `MultiEdit` applies edits in order
- server unreachable → exit 0, no output

## Done when
- [ ] All tests above pass
- [ ] Real run: Bob's agent is refused before `getUser()` changes, and Alice's agent pauses at its next edit
- [ ] Show the team the result and explain how it works in 2 minutes.
