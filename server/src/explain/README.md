# explain: turn a compiler error into a question a PM can answer

## What it does in the demo
Scene 4 on the board ([mockup](../../../docs/mockup/scene-4-collision.png)). The computer only knows:
```
checkout/order.ts(47,12): error TS2531: Object is possibly 'null'.
```
Priya (the PM) needs to read:
> Saved cards assumes every buyer has an account. Guest checkout removes that.
> **Can guests save cards?**  [No — offer guests "Create an account…"]  [Yes — save it against a verified email]

This function asks Claude to do that translation. **The prompt is the ticket owner's to write**, and it's the part you present at the final demo.

## The function
`explainConflict(evidence, labels, callModel?)` in `explainConflict.ts`

**Input 1: `evidence`**, what broke (see `Conflict["evidence"]` in `shared/contract.ts`):
the compiler error, the broken line, who changed what, and the diff.
**Input 2: `labels`**, the plain-English names from `shared/labels.json` (e.g. `getUser` = "Who's buying").
**Input 3: `callModel`**, the function that talks to Claude. It's already written (`callModel.ts`).
Tests pass in a fake one, so they never cost money or need the internet.

**Output:**
```js
{ plainSummary: "...", question: "...", options: [{ id: "...", label: "..." }, { id: "...", label: "..." }] }
```

**If anything goes wrong, return the fallback.** That covers a missing API key, an error, or a weird reply.
`fallbacks.ts` has them ready: `DEMO_FALLBACK` for the demo conflict, `genericFallback(evidence)` for anything else.
The demo must never break because of this function.

## Steps
1. Read `explainConflict.ts` (the numbered steps in the comment), the test file, and `fallbacks.ts`.
2. Make the "no API key" test pass first.
3. Write your prompt as a string that includes the evidence and the plain names. Ask Claude to answer with only JSON.
4. Call `callModel(prompt)`, then `JSON.parse` the reply inside `try { } catch { }`.
5. Check the shape (2–3 options, nothing empty). Bad shape → fallback.
6. Last, the edge case: strip a ```` ```json ```` wrapper before parsing.
7. Then, with a real key in your terminal (`ANTHROPIC_API_KEY`, ask Taylor), try your prompt on the real demo conflict and tune the wording.

## Run only these tests
```
pnpm test:explain
```

## You're done when…
- [ ] All 9 tests pass
- [ ] You didn't change the test file
- [ ] You can explain the prompt and why it's worded that way in 2 minutes (you present it at the final demo)
