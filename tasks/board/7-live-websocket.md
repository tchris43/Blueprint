# Task 7: Go live

**Goal:** instead of sample scenes, show what the server is sending, updating instantly as agents work.

**Mockup:** any scene. Live mode should look the same as the sample scenes.

**Files to touch**
- New file `board/web/src/useLiveState.ts`: a React hook that opens `ws://localhost:4000/live`
- `board/web/src/App.tsx`: a "Sample scenes / Live" toggle (reuse your `Toggle`)

**Done when**
- [ ] With `pnpm server` running, Live mode shows the server's state
- [ ] `curl -X POST localhost:4000/demo/scene -H "Content-Type: application/json" -d '{"scene":3}'` changes the board within a second, with no refresh
- [ ] The toggle shows whether you're connected
- [ ] Turning Live off closes the websocket (check the Network tab)

**Hint:** each message is JSON shaped like `LiveMessage` in `shared/contract.ts`. Open the socket inside `useEffect` and return `() => socket.close()` from it so React cleans up.
