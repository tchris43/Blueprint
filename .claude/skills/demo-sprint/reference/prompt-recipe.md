# How an expert prompt is built

Score his prompt on these 7 parts. Most beginner prompts have only #1.

1. **Goal**: one sentence: what done looks like. ("Make Bob's edit get refused before it's saved.")
2. **Context files**: the exact files or tickets to read first. Saves the AI from guessing and you from wrong answers.
3. **Evidence**: "show me the file/line that proves it," "show the test output." Lets you check in 30 seconds.
4. **Plan before code**: "tell me your plan in 3-4 bullets and wait." Your cheapest review point.
5. **Constraints**: what not to touch ("don't edit tests", "don't touch shared/", "don't change the live path", "Write and Edit only").
6. **Verification**: the command that proves it worked ("run pnpm test:board", "show me git diff --stat").
7. **Stop condition**: when to stop and ask instead of pushing on ("if a test seems wrong, stop and tell me why").

## Three prompt shapes that cover most of a hackathon
- **Recon:** "Don't change anything. Read X, Y, Z. Tell me <table/answer> with the file that proves each. Then the single biggest risk."
- **Build:** "Goal. Read X. Plan first and wait. Constraints. Then implement in small steps, run <test> after each, show me the output."
- **Debug:** "Don't fix yet. Add a temporary log of <thing>, rerun, tell me your hypothesis. Wait." Then: "Correct, fix it, remove the log, rerun <test>."

## Critique format
"You had: goal ✓, context ✗, ... Biggest miss: <one part>, because <what would have gone wrong>."
Then show the expert prompt.
