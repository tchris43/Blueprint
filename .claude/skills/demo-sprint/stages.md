# Stages

Default timeboxes assume about 2 hours. Scale them to the time he actually has.
Each stage: **Goal** (say this) · **Why** (say this) · **Hints** (only on request, one at a time) ·
**Expert version** (show after he tries) · **Critique checklist** · **Done when** · **If over time**.

The expert versions are a reference run. Always check the real repo before using any fact from them.

---

## Stage 0: Set the clock (2 min)
**Goal:** Write down when the demo is, when you'll freeze, and the one moment the demo must land.
**Why:** Without a freeze time, people keep adding features until the demo breaks. Writing the
single "wow" moment tells you what to protect and what you can fake.
**Hints:** 1) What's the one thing a judge should remember? 2) Freeze about 15 minutes before you
have to stop.
**Expert version:** Create `DEMO-SPRINT.md`:
```
Demo at: __   Now: __   Freeze at: demo - 15 min (after that: fixes only)
Wow moment: Bob's edit is refused before it's written because it would break Alice's work.
Only Alice and Bob pause. Priya decides in plain English. Both agents resume.
## Stage log
## Decisions
## Gaps (what I didn't know -> what the expert did)
```
**Critique checklist:** Has a freeze time? Is the wow moment one sentence a judge could repeat?
**Done when:** The file exists.

---

## Stage 1: Recon by running things (10 min)
**Goal:** Find out what actually works right now. Does it install, do the tests pass, do the
server and board start and talk to each other?
**Why:** Tickets and docs say what was *planned*. Running the code tells you what's *true*.
Experts spend 10 minutes here so they don't spend 60 minutes building on a wrong assumption.
**Hints:** 1) There are 4 questions: up to date? installs? tests? does it run? 2) Look at
the "scripts" in package.json. Those are the commands the team already made for you.
**Expert version (terminal, in order; see reference/commands.md for the why of each):**
```
git pull --rebase           # get teammates' latest work without a merge commit
pnpm install                # install libraries (needed after any pull that changed package.json)
pnpm doctor                 # the team's setup checker: every line should say OK
pnpm test                   # finished work: should be green. Red here = something regressed
pnpm test:todo              # unfinished tickets: red is expected. This is your to-do map
pnpm server                 # terminal 1 (leave running)
pnpm dev:board              # terminal 2 (leave running), open http://localhost:5173
```
Then in a browser: http://localhost:4000/state (the server's memory as JSON). Then push a
sample scene to prove server -> board works:
```
Invoke-RestMethod -Method Post -Uri http://localhost:4000/demo/scene -ContentType application/json -Body '{"scene":3}'
```
**Expert prompt to Claude:**
> I just inherited this repo and have about 2 hours before a live demo. Don't change any files.
> Read AGENTS.md, tickets/README.md, docs/demo-script.md and `git log --oneline -30`. Then look
> at the actual code (not the ticket text) and give me a table: each of the 9 demo scenes ->
> tickets it depends on -> done / partial / missing, with the file that proves it. Then tell
> me the single riskiest thing between me and a working scene 4.

Why each part: "don't change files" keeps recon safe. "Actual code, not ticket text" because
tickets lie. "File that proves it" lets you spot-check in 30 seconds. "Single riskiest thing"
forces a priority instead of a list of 20 worries.
**Critique checklist:** Did he run tests *and* start the app? Did he ask for evidence? Did he
forbid edits? Did he ask for a single top risk?
**Done when:** He can say in one sentence what works and what the biggest gap is. (Expected
finding as of Oct 27: ticket 102 isn't done. The pre-tool-use hook only asks `/status` and
never checks the proposed edit, so today the break is caught *after* the edit, not before.)
He should also open `hooks/pre-tool-use.mjs` himself (it's short) to confirm.

---

## Stage 2: Cut scope out loud (5 min)
**Goal:** For each demo scene, decide: **live**, **faked** (sample data), or **cut**. Set a
timebox and a fallback for the riskiest piece.
**Why:** Judges remember one moment. Spend real build time on that moment and fake the
garnish honestly. A timebox with a fallback chosen *in advance* stops one hard ticket from
sinking the whole demo.
**Hints:** 1) Which scenes are the wow moment? Those are live. 2) What's your plan B if 102
isn't working by a set time?
**Expert version (add to DEMO-SPRINT.md):**
```
Live: 1-7 | Faked with sample scenes: 8 drift, 9 history | Cut: Lucid extension (web board is the demo)
Timebox: ticket 102 until <now + 40 min>. Fallback: keep "caught right after the edit",
pause both agents on the next edit, and reword one pitch sentence.
```
**Critique checklist:** Is anything live that doesn't need to be? Is the fallback concrete
enough to switch to in 1 minute? Is Lucid's status honest ("in progress", screenshot)?
**Done when:** The plan is in the log and he agrees with it.

---

## Stage 3: Safety net first (15 min)
**Goal:** Make sure there's a demo you can click through even if every live piece fails.
**Why:** Once a fallback exists, every minute after this is upside, and you stop panicking.
The server already has `/demo/scene` and `shared/sample-state.json` has every scene.
**Hints:** 1) What already exists for faking scenes? 2) What's the fastest way to step through
them on stage? (keyboard)
**Expert prompt:**
> On the web board (board/web), add a hidden scene stepper: pressing the right/left arrow keys loads
> scene-0 through scene-8 from shared/sample-state.json, with a small "Scene 3/8" label that
> only shows while stepping. Put it in its own component and don't touch the live data path.
> Tell me your plan in 3-4 bullets first and wait for me.

Why: "own component, don't touch the live path" means it can't break the real thing. "Plan
first and wait" gives you a 20-second review before any code.
**Then (terminal):** `pnpm test:board`, then `pnpm dev:board` and press the arrow 9 times. Look at every scene.
**Critique checklist:** Did he check existing pieces before building new ones? Did he isolate
it? Did he actually click through every scene (not just trust the tests)?
**Debugging lesson if a scene looks wrong:** ask "what does the component expect vs what does
the data contain?" before fixing. If they disagree, `shared/contract.ts` wins, so fix the component.
**Done when:** All 9 scenes render. Commit: "Scene stepper for demo fallback".

---

## Stage 4: Design ticket 102 before coding (10 min)
**Goal:** Get the smallest design for checking a *proposed* edit on the server and denying it
in the hook. No code yet.
**Why:** This is the hardest, most important piece. A 5-minute design review catches the tricky
parts (rebuilding the file for Edit/MultiEdit, timeouts, failing open) before they become bugs.
**Hints:** 1) Read tickets/102-check-before-edit.md, it's already very specific. 2) Ask for a
list of files to change and what changes in each.
**Expert prompt:**
> I'm doing ticket 102 (check before edit). Read tickets/102-check-before-edit.md,
> server/src/combinedCheck.ts, server/src/index.ts (POST /edits and GET /status) and
> hooks/lib.mjs. Give me the smallest design that makes the pre-hook send the proposed edit
> to the server, check it combined with everyone's in-progress work in memory, and deny if it
> breaks someone else. List each file you'd change and what changes. Don't write code yet.

**Expert review of the design (what he thinks while reading it):**
- Write = whole file, easy. Edit = replace old_string with new_string. MultiEdit = apply in
  order. If short on time, do Write + Edit and **fail open** (allow) on MultiEdit.
- The hook timeout in example-settings is 10s. tsc can take 2-4s. Bump it to 20 and have the hook
  give up after about 8s and allow.
- `/check` must **not** store the proposal as an edit (the ticket says so).
**Critique checklist:** Did he point it at the ticket and the exact files? Ask for a file-by-file
plan? Forbid code? Did he notice the fail-open and timeout questions himself?
**Done when:** He can explain the design in 3 sentences.

---

## Stage 5: Build it one hop at a time (25 min)
**Goal:** Prove the server half with a test and no AI agents. Then prove the hook with fake
input. Only then use real agents.
**Why:** The path is hook -> server -> combined check -> deny -> board. If you test it all at once
with two live agents and it fails, you won't know which hop broke. Testing one hop at a time
turns "it doesn't work" into "this hop doesn't work."
**Hints:** 1) The team already has Alice's and Bob's patches in docs/demo-patches. 2) A hook is
just a program that reads JSON from stdin, so you can feed it a fake event.
**Expert prompt (server half):**
> Good. Scope: Write and Edit only; for MultiEdit just allow. If /check takes more than 8s or
> errors, allow and log it. Do the server half first: add POST /check plus a vitest that
> records Alice's patch via /edits, then /checks Bob's patch from docs/demo-patches, and expects
> it to fail with TS2531 at checkout/order.ts:47. Run the test and show me the output.

**If the test fails, the expert debugging prompt (the key habit):**
> Don't fix yet. Add a temporary log that prints <the thing in question>, rerun, and tell me your
> hypothesis based on the log. Then wait.

Why: a fix without a hypothesis is a guess, and AI guesses can "fix" the test instead of the bug.
**Expert prompt (hook half):**
> Now update hooks/pre-tool-use.mjs to call /check as designed, keeping the existing /status
> pause logic first. On a failed check, deny with a reason that says what broke, whose work, and
> "stop and tell the user you're waiting for a team decision." Then write test-bob-edit.json
> (a fake PreToolUse event) and give me the PowerShell line to pipe it into the hook.
**Terminal:**
```
Get-Content test-bob-edit.json | node hooks/pre-tool-use.mjs; echo "exit=$LASTEXITCODE"
```
Expect: JSON with `"permissionDecision":"deny"` and exit 0. (This repo blocks with a JSON
deny plus exit 0. Exit code 2 is the other way a hook can block. Both work.)
**Critique checklist:** Tested the server without agents? Asked for a hypothesis before a fix?
Faked the hook input? Ran `pnpm test` before committing?
**If over time:** Switch to the Stage 2 fallback and log it.
**Done when:** The server test is green and the fake Bob event is denied. Commit and push.

---

## Stage 6: A second Claude in parallel (runs during Stage 5)
**Goal:** While Stage 5 is running, have a second Claude Code window finish board tickets that
already have tests.
**Why:** When tests define "done", you only need to review the diff, not watch it type. That
doubles your output.
**Expert prompt (second terminal, in board/web):**
> Make the tests in src/__tests__/task3-controls.test.tsx and task4-conflict-card.test.tsx
> pass. Do not edit the test files. If a test seems wrong, stop and tell me why. When done,
> show me `git diff --stat` and the diff for any file over 40 lines changed.
**Review habit:** Read the diff for one thing: did it hardcode demo data just to pass?
**Critique checklist:** Gave it a test as the definition of done? Banned editing tests? Asked
for the diff, sized to what he can review?

---

## Stage 7: First live run with real agents (20 min)
**Goal:** Two Claude Code windows (Alice and Bob) in two copies of demo-shop, with hooks
installed. Run the real story.
**Why:** This is the first time all the hops run together. Expect 1-2 setup bugs. The skill is
**checking, not guessing**.
**Setup:** Follow hooks/README.md. In each copy: `.claude/settings.local.json` from
`hooks/example-settings.json`, with real absolute paths and `BLUEPRINT_PARTICIPANT` set to alice or bob.
**Expert debugging moves, in order:**
1. Nothing on the board? In that Claude window type `/hooks`. Are the hooks listed?
2. Not listed? Check the settings file parses:
   `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json','utf8'))"`
   (Most common Windows bug: `C:\Users\...` single backslashes in JSON. Use forward slashes.)
3. Listed but nothing arrives? Open http://localhost:4000/state and watch the server terminal.
4. Bob doesn't resume after Priya decides? The decision is delivered by the *pre-hook on the
   agent's next edit*. If the agent stopped to wait, nothing triggers it. Demo fix: Bob types
   "The team made a decision. Continue." Say it in the pitch as the human staying in the loop.
**Expert prompt when stuck on a flow:**
> Trace how <a decision> gets from <the board> back to <Bob's agent>. List each hop and the
> file and function for it. Don't change anything.
**Critique checklist:** Did he check before guessing? Use /hooks and /state? Pick a reliable fix
over the "proper" one?
**Done when:** Bob's edit is refused, both pause, Priya decides, both resume, and the boxes go green.

---

## Stage 8: Make every AI call boring (10 min)
**Goal:** The plain-English explanation must show up even with no internet or API key.
**Why:** Hackathon Wi-Fi is bad. Every network call in a live demo needs a canned answer
behind it. `server/src/explain/fallbacks.ts` already exists.
**Expert prompt:**
> In server/src/explain, make explainConflict use the fallback text if there's no API key, the
> call errors, or it takes more than 3 seconds. Add a test for the timeout path using a fake
> slow callModel. Show me the test before the implementation.
Why "test first": the test is where you can see whether it really simulates "slow."
**Done when:** `pnpm test:explain` is green, and the demo works with the API key unset.

---

## Stage 9: Reset, rehearse, break-glass card (20 min)
**Goal:** One command resets everything. Run the full demo twice with a timer. Write down
what to do if each piece fails.
**Why:** Agents don't do exactly the same thing every run. Rehearsal finds the wobble, and a
reset command keeps that from turning into a 5-minute scramble.
**Expert prompt:**
> Make one command, `pnpm demo:reset`, that git-resets both demo-shop copies to their starting
> commit, POSTs /reset to the server, and prints READY. It must work in PowerShell. Then tell
> me how you'd verify it actually resets everything.
**If an agent wanders:** make Bob's prompt specific about the *path*, not the code: "Start by
making getUser() in account/user.ts return User | null for guests, then update callers."
Save the exact Alice/Bob prompts in docs/demo-script.md.
**Break-glass card (on paper next to the laptop):**
```
Board frozen      -> refresh; open localhost:4000/state
No boxes appear   -> /hooks in Claude; check settings.local.json parses
Agent goes rogue  -> Esc, pnpm demo:reset, switch to the scene stepper (arrow keys)
Everything dead   -> backup video
```
**Done when:** Two clean timed runs in a row.

---

## Stage 10: Freeze (5 min)
**Goal:** Record a backup video, tag a known-good commit, stop adding features.
**Expert version:** Record one clean run (Win+Alt+R, Xbox Game Bar). Then:
```
pnpm test
git add -A
git commit -m "Demo-ready"
git tag demo-ready
git push --follow-tags
```
Why: the tag is an undo button. `git checkout demo-ready` gets back to a working state in 5 seconds.
**Done when:** The tag is pushed and the video is saved. From here, the coach refuses new features.

---

## Stage 11: Explain-back (5 min)
**Goal:** Prove he can debug it live on stage.
**Expert prompt:**
> Quiz me, one question at a time, on how a refused edit travels through this system:
> hook -> server -> check -> board -> decision -> agent. For each hop, also ask what I'd look
> at if that hop failed. Don't tell me the answer until I've tried.
**Done when:** He answers every hop. Any miss = the one file he reads before the demo.
Log the result in DEMO-SPRINT.md under Gaps.
