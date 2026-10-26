# 014 · Pre-edit combined check: deny a conflicting edit before it's saved

**Labels:** `core` · `server` · `build`  
**Depends on:** [001](001-post-hook-real-edits.md)  
**Owner:** Taylor

## Why it matters
This is the pitch: Blueprint is a smart layer on top of git that catches a silent break **before
the code is written**, while it's still cheap to change course, so everyone can push knowing it's
already resolved. Today the check runs after the edit is saved. Decided 2026-10-26: move it before
the edit. A 1–3s wait before each edit is acceptable.

## What to do
- **The PreToolUse hook rebuilds the proposed file** from what Claude Code is about to do:
  - `Write` → `tool_input.content` is the whole new file
  - `Edit` → read the current file, replace `old_string` with `new_string` (every match if `replace_all`)
  - `MultiEdit` → apply each edit in `tool_input.edits`, in order
- **The hook sends it to a new endpoint, `POST /check`** `{participant, files}`. The check has to run on
  the server, because only the server holds teammates' changes. Run the combined check of the proposed
  files (on top of this person's earlier changes) against each teammate's changes. **Don't store the
  proposal as an edit**, because it hasn't happened yet. On a conflict: record it, pause both people,
  and reply `{paused: true, conflict}`.
- On a conflict, the hook replies `permissionDecision: "deny"` with the plain summary, and the edit never lands.
- **Keep the post-edit hook and `/edits`**. They sync the file that was actually saved.
- Move the check-and-record code out of the `/edits` handler, so `/check` and `/edits` share it.
- Update the demo story in `AGENTS.md` and `docs/demo-script.md`: Bob's edit is refused before it's written.

## Things to watch
- **Edits made through the shell skip both hooks** (`sed`, `echo >`, a script). Write this down as a
  known gap; don't fix it for the demo.
- If the server is down, the hook must still let the edit through (as it does today).
- If an `Edit`'s `old_string` isn't in the file, Claude Code will fail the edit anyway, so skip the check instead of guessing.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
- Alice's change containing `saveCard(getUser().id, card)` is recorded, and Bob proposes `getUser(): User | null` → deny; the reason mentions `getUser`; Bob's `account/user.ts` on disk is unchanged
- the same proposal when Alice's line doesn't exist → allowed, and no conflict is recorded
- a denied proposal is NOT stored as Bob's change (a later harmless edit by Bob doesn't conflict)
- `Edit` with `replace_all` rebuilds the file correctly; `MultiEdit` applies its edits in order
- server unreachable → exit 0, no output

## Done when
- [ ] All tests above pass
- [ ] Real run: Bob's `getUser(): User | null` edit is denied while Alice's `getUser().id` line exists, and passes when it doesn't
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.
