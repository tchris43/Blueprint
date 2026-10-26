# 602 · Decide how agents announce which files they plan to touch

**Labels:** `core` · `server` · `design`  
**Depends on:** nothing  
**Owner:** Taylor

## Why it matters
Scene 8 (drift) only works if Blueprint knows the plan before the agent edits. Today nothing calls `POST /intent`.

## What to do
- Write 2–3 options with pros and cons in `docs/decisions/intent.md`. Candidates: (a) an instruction in each clone's `CLAUDE.local.md` telling the agent to post its plan; (b) a tiny MCP tool `announce_plan(files)`; (c) treat the first plan message as the intent (UserPromptSubmit / Stop hook reads the transcript).
- Constraint: demo-shop's committed files must not mention Blueprint, so the agents behave naturally.
- Try the favourite once with a real agent before the team picks.

## Done when
- [ ] `docs/decisions/intent.md` has the options, the pick, and why
- [ ] A follow-up build ticket is added to this backlog
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show the announced plan as dashed 'planned' boxes on the board before any code exists.
