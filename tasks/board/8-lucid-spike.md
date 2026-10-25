# Task 8: Lucid extension spike (2 hours max)

**Goal:** find out whether we can show the map inside Lucid itself (Plan A). The web board (tasks 1–7) is Plan B, and it's what we demo if this doesn't work.

**Mockup:** [scene 4](../../docs/mockup/scene-4-collision.png): same boxes, but drawn in a Lucid document.

**Files to touch**
- `board/lucid-extension/`: scaffold it here
- `tasks/board/lucid-findings.md`: write down what happened

**Steps** (stop at 2 hours, wherever you are)
1. [ ] Scaffold with Lucid's official **"Create Extensions"** skill (Lucid developer docs → AI tools). Enter dev mode in Lucid.
2. [ ] Add a menu item that draws 3 boxes and 2 lines (`page.addBlock`, then lines between them).
3. [ ] Open a right-side Panel (iframe) that connects to `ws://localhost:4000/live` and posts each message to the extension.
       If the websocket is blocked, poll `GET http://localhost:4000/state` every second instead.
4. [ ] A server message turns a box red:
       `curl -X POST localhost:4000/demo/scene -H "Content-Type: application/json" -d '{"scene":3}'`

**Done when**
- [ ] `lucid-findings.md` says which steps worked, what broke, and how long each took
- [ ] You and Taylor decide: Plan A or Plan B for the demo

**Hint:** store our node id in each block's shape data when you draw it. Then a new state can find and recolor the existing block instead of drawing a duplicate.
