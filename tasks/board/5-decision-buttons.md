# Task 5: Decision buttons talk to the server

**Goal:** clicking an option on the conflict card sends Priya's decision to the server.

**Mockup:** [scene 5](../../docs/mockup/scene-5-decide.png)

**Files to touch**
- `board/web/src/api.ts`: write `postDecision`
- `board/web/src/App.tsx`: in Sample mode, a click jumps to scene 6 ("Agents adapt"). In Live mode it calls `postDecision`.

**Done when**
- [ ] With the server running (`pnpm server`), clicking an option makes `curl localhost:4000/state` show a `decision` on that conflict
- [ ] In Sample mode, clicking jumps to the next scene so the demo still flows without a server
- [ ] If the server is down, nothing crashes (check the browser console)

**Mock the server until it's ready:** write `postDecision` first with a `console.log` of what it *would* send. Swap in the real `fetch` once `/decision` works on the server (ticket 203).

**Hint:** the body shape is `DecisionRequest` in `shared/contract.ts`. Use `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })`.
