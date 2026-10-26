# 015 · A paused agent stops on its next action of any kind

**Labels:** `core` · `server` · `build`  
**Depends on:** [002](002-pre-hook-pause-and-decision.md)  
**Owner:** Taylor

## Why it matters
Today a paused agent can keep reading, running tests and running shell commands. It's stopped only
when it tries to edit. Stopping it on its very next action means it can't keep building on a
decision that's still open. This also settles 002's open question about an agent that's paused but
not editing.

## What to do
- In `hooks/example-settings.json`, make the PreToolUse hook match every tool (`"matcher": "*"`), not just `Edit|Write|MultiEdit`.
- In `hooks/pre-tool-use.mjs`, use `tool_name` to choose the work: run the combined check (014) only for
  Edit/Write/MultiEdit; for every other tool, only ask `GET /status`.
- Paused → deny every tool, and the reason tells the agent to stop and tell the user it's waiting.
- An unseen decision is now delivered on any action, not just an edit (this was 002's stretch).
- Leave the PostToolUse matcher as it is.

## Things to watch
- Every Read and Grep now waits on `/status`. That's fine at about 10ms locally, but if the server hangs,
  each call waits for the 3s timeout. Keep that timeout short.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
- paused + `tool_name: "Read"` → deny
- paused + `tool_name: "Bash"` → deny
- not paused + `tool_name: "Read"` → no output, and `/check` is never called
- unseen decision + `tool_name: "Grep"` → `additionalContext` contains the decision text

## Done when
- [ ] Tests pass
- [ ] Real run: a paused Alice is stopped on her next Read or Bash call, not only on her next edit
- [ ] Show the team the result and explain how it works in 2 minutes.
