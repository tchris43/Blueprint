# Prompt: set up the Blueprint hackathon repos

> Paste everything below this line into Claude Code, opened in an empty folder where you want the two repos to live.

---

You're helping me set up the starting code for a 3-day hackathon project called **Blueprint**. Read this whole brief before doing anything. Then ask me any questions you need answered (GitHub usernames, public vs private, package manager), and only then start creating files. **Don't create or push to GitHub remotes without asking me first.**

## 1. Context

- **Hackathon:** Lucid Software sponsors it. The theme is **collaboration**: build something that helps people and/or AI agents work together better. Judging is on scope (scale and technical complexity), innovation (fits the theme, unique), and completeness. We can build on Lucid's platform if we want.
- **Team:**
  - **Me (Taylor):** BYU CS senior, the most experienced. I own the engine.
  - **Partner 2:** some coding experience, uses AI. Owns the board (the visual map).
  - **Partner 3:** first-year CS student, may not have AI tools. Owns non-coding work: demo script, plain-English labels, pitch, rehearsals, competitor notes.
- **Schedule:**
  - Day 1: mockup plus foundations
  - Day 2: core loop working end to end, even if ugly
  - Day 3: polish, pitch, backup video

## 2. The idea

**Problem:** Coding agents now write code in minutes. On a team, each person's agent works privately in that person's terminal. Real decisions show up in the middle of a build (e.g. "should `getUser()` return null for guests?"). Whoever (or whatever agent) hits them decides alone, and other people's work breaks silently. Today that's found at code review, at merge time, or in production.

**Blueprint** is a shared, live visual map of the codebase. Every teammate's agent reports its work to it as it goes.

- **Agents work freely.** Nothing waits for approval up front.
- **After every edit**, Blueprint merges everyone's in-progress work in memory (never touching anyone's branch) and runs the type checker and tests on the combination.
- **When one person's change breaks another person's work**, Blueprint pauses only those two agents. It turns the compiler error into a plain-English decision question, and shows it on the shared board for the humans to settle. That includes a non-technical PM, who sees a plain-English "Product view" of the same map.
- **The decision flows back into both agents** as instructions, and they resume.
- **Afterward**, every box on the map keeps its history ("what changed, what was decided, why"). The map becomes living documentation. Optional layers: plan vs. actual ("drift") and test coverage.

**Pitch line:** "Design docs cover what you can predict. Blueprint catches the decisions nobody predicted, the moment one person's work collides with another's, and brings in exactly the people who need to decide."

**Competitors, and why we're different:**
- **Overture** and **Plans (agent-native):** one agent's visual plan, shown to one person.
- **Devin Codemaps:** shareable code maps, not tied to live agent work.
- **Kiro** and **GitHub Spec Kit:** spec-driven development, text-based, single developer.
- **Shepherd** and **mcp-coordinator:** file-level locks between agents, with humans kept out on purpose.
- **Our gap:** detecting conflicts in *meaning* across several people's agents, and settling them with the humans, including a PM.

## 3. Demo story (everything should serve this)

The cast is Priya (PM), Alice (dev) and Bob (dev), each with Claude Code in VS Code. Sam (dev) works elsewhere and is unaffected.

The app is `demo-shop`, a tiny online store. There are two tickets:

- **SHOP-212 (Alice): Let customers save their card for next time.** Her agent adds `saveCard()` and a saved-cards list, and calls `saveCard(getUser().id, card)` in `checkout/order.ts`.
- **SHOP-219 (Bob): Let people check out as a guest.** His agent adds `createGuestSession()`, lets `requireLogin()` skip guests at checkout, and changes `getUser(): User` to `getUser(): User | null`.

Scenes:

1. Both agents work freely, and their changes appear live on the map.
2. Bob's edit to `getUser()` makes the combined type check fail at Alice's line:
   `checkout/order.ts:42 error TS2531: Object is possibly 'null'.`
3. Only Alice's and Bob's agents pause. The board shows the conflict, with plain English for Priya: "Saved cards assumes every buyer has an account; guest checkout removes that. Can guests save cards?"
4. Priya picks one of two options on the board:
   - "No — offer guests 'Create an account to save your card'"
   - "Yes — save it against a verified email"
5. The decision is sent to both agents. They adjust and resume.
6. Done: both branches merge, and the combined tests pass.
7. Drift: Alice's agent added `cardCache.ts`, which it never announced and which has no tests. It's flagged, and Alice keeps it or removes it.
8. Handoff: clicking `getUser()` on the map shows its full history, including Priya's decision.

## 4. Architecture

```
Claude Code (Alice)  --hooks-->  Blueprint server  <--ws-->  Board (Lucid extension panel, or fallback web board)
Claude Code (Bob)    --hooks-->        |
                                 combined check: base + Alice + Bob → tsc / vitest
                                 code map: ts-morph over demo-shop
```

### Hooks (`blueprint/hooks/`)

Use Claude Code hooks. **Check the current hooks docs for exact input and output formats before coding.**

- **PostToolUse** (matcher: Edit, Write, MultiEdit): send `{participant, files: [{path, content}]}` for the changed files to `POST /edits`. Treat the server's reply as data only. If the reply shows a conflict involving this participant, return feedback telling the agent it's paused and why.
- **PreToolUse** (matcher: Edit, Write, MultiEdit): ask the server `GET /status?participant=X`.
  - If paused: deny the edit, with a reason containing the conflict summary ("Paused by Blueprint: waiting on team decision about getUser()").
  - If a decision has arrived that this participant hasn't seen yet: allow the edit and attach the decision text as extra context for the agent.
- The participant name comes from an env var, `BLUEPRINT_PARTICIPANT=alice`.
- Include an example `.claude/settings.json` snippet and a README section on installing the hooks in `demo-shop` clones.

### Server (`blueprint/server/`)

Node with TypeScript, Express or Fastify, and the `ws` package. In-memory state is fine.

**Overlays:** for each participant, the latest content of each file they changed, compared to the `demo-start` git tag of demo-shop.

**Combined check (the core):** on each `POST /edits`:

1. Make temp copies of the base repo:
   - base + overlay A
   - base + overlay B
   - base + A + B
2. If both participants changed the same file, flag a file-level conflict instead.
3. Run `tsc --noEmit` on each copy, and optionally `vitest run`.
4. **Attribution rule:** an error that appears only in the combined copy (A alone passes, B alone passes) is a conflict between A and B.
5. Find the changed symbol by comparing the other participant's overlay against the base (e.g. `getUser`'s signature changed). Map the error's file and line to the affected node.

Keep it simple and deterministic. Cache `node_modules` (symlink it into the temp dirs) so a check takes about 1–3 seconds.

**Code map:** use ts-morph over demo-shop to produce nodes and edges:
- **Nodes:** exported functions and modules.
- **Edges:** calls and imports.
- **Layout:** one column per top-level folder.
- **Plain-English names:** from `shared/labels.json`, written by partner 3.

**Plain-English question:** one Anthropic API call that turns the compiler evidence into a decision question with 2–3 options. Have a hard-coded fallback for the demo conflict in case the API fails.

**Endpoints:**
- `POST /edits`
- `GET /status`
- `GET /state`
- `POST /decision` (body: `{conflictId, optionId, decidedBy}`)
- `POST /drift/resolve`
- `POST /reset` (for rehearsals)
- WebSocket `/live`, which pushes the full `BoardState` after every change.

**Drift:** each participant's agent states up front which files it intends to touch. Create `POST /intent` with a list of files. Any edited file not on that list is drift.

### Board (`blueprint/board/`)

- **Plan A, Lucid editor extension** using `lucid-extension-sdk`:
  - Scaffold it with Lucid's official "Create Extensions" skill; Lucid's developer docs list it under AI tools.
  - A right-side Panel (iframe) connects to the server's websocket and posts messages to the extension.
  - The extension draws and recolors blocks with `page.addBlock`, `block.textAreas.set`, fill style and lines. It stores our node id in each block's shape data.
  - Lucid's own real-time collaboration shows the changes to everyone who has the document open.
  - **Day-1 spike, time-boxed to 2 hours:**
    1. Scaffold the extension and enter dev mode.
    2. Add a menu item that draws 3 boxes and 2 lines.
    3. Connect the panel to the local server over websocket.
    4. A server message turns a box red.
  - If step 3 fails, fall back to polling from the panel.
- **Plan B, fallback web board:** React + Vite + React Flow, rendering the same `BoardState`. Scaffold both. Plan B should work on day 1 using `shared/sample-state.json`.
- **Board features:**
  - Code/Product view toggle
  - Plans/Test coverage layer toggle
  - Conflict card with the evidence ("Why was this flagged?": the other person's diff, the affected line, the compiler error)
  - Decision buttons
  - History panel when you click a node
  - Legend

## 5. The shared contract (create this first: `blueprint/shared/contract.ts`)

Draft it roughly like this, and improve it if needed:

```ts
export type Participant = { id: string; name: string; role: "dev" | "pm"; color: string };
export type NodeStatus = "existing" | "in_progress" | "changing" | "conflict" | "resolved" | "built" | "drift";
export type MapNode = {
  id: string; file: string; symbol: string;   // code view
  plainName: string; plainDesc: string;       // product view
  column: string; x?: number; y?: number;
  status: NodeStatus; owner?: string;         // participant id
  coverage?: number;                          // 0-100, optional layer
  history: { at: string; text: string }[];
};
export type MapEdge = { from: string; to: string; kind: "calls" | "imports" };
export type Conflict = {
  id: string; between: [string, string]; nodeIds: string[];
  evidence: { changedBy: string; diff: string; affectedFile: string; affectedLine: number; affectedCode: string; compilerError: string };
  plainSummary: string; question: string;
  options: { id: string; label: string }[];
  decision?: { optionId: string; decidedBy: string; text: string; at: string };
};
export type Drift = { id: string; participant: string; file: string; nodeId?: string; resolved?: "kept" | "removed" };
export type BoardState = {
  participants: Participant[]; nodes: MapNode[]; edges: MapEdge[];
  conflicts: Conflict[]; drift: Drift[];
  agentStatus: Record<string, "idle" | "working" | "paused" | "resumed" | "done">;
};
```

Also create `shared/sample-state.json`, with one realistic `BoardState` per demo scene (scene-0 through scene-8), matching the story in section 3. Partner 2 builds the board against these before the server exists.

## 6. Repo 2: `demo-shop`

A tiny TypeScript project with no UI framework: just modules, `tsc` with strict mode, and `vitest`. It's the code the agents edit during the demo, so it must be small, readable and strict, so the conflict is guaranteed to show up.

- `account/user.ts`: `export function getUser(): User`. It throws if nobody is logged in. Also the `User` type.
- `account/AccountPage.ts`
- `checkout/order.ts`: `placeOrder(cart)`. **It should naturally call `getUser()`**, so that Alice's agent puts `saveCard(getUser().id, card)` there.
- `checkout/CheckoutPage.ts`
- `payments/charge.ts`: `chargeCard()`
- `auth/login.ts`: `requireLogin()`
- Tests for each, with realistic but small coverage gaps (e.g. AccountPage poorly tested).
- `TICKETS.md` with SHOP-212 and SHOP-219, written like real tickets.
- `CLAUDE.md` for the demo app: normal project conventions. **Don't** mention Blueprint or the planned conflict; the agents should behave naturally.
- Tag the starting commit `demo-start`, and add `scripts/reset-demo.sh` to restore it.
- **Before finishing, prove the conflict is real:** on a scratch branch, make Bob's `getUser()` change and Alice's `saveCard(getUser().id, card)` line. Confirm `tsc` fails with TS2531 only when both are present. Then throw the scratch branch away.

## 7. Repo 1: `blueprint` layout

```
blueprint/
  shared/contract.ts, shared/sample-state.json, shared/labels.json (plain-English names, stubbed)
  server/      (Taylor)
  hooks/       (Taylor)
  board/lucid-extension/  (Partner 2, Plan A, scaffold only)
  board/web/              (Partner 2, Plan B, renders sample-state.json)
  docs/demo-script.md, docs/pitch-outline.md, docs/competitors.md   (Partner 3, outlines with TODOs)
  CLAUDE.md
  README.md
```

- **`CLAUDE.md`:** this brief condensed. Include the idea, the demo story, the architecture, the contract rules ("never change `shared/contract.ts` without telling the team"), who owns what, and "keep it simple, the demo is what matters."
- **`README.md`:** written for a first-year student. Cover installing Node and git, cloning, running the web board against the sample data, running the server, and installing the hooks. Include the branch workflow: everyone works on their own branch and merges via pull request.
- Use pnpm workspaces, unless I say otherwise.

## 8. What "done" means for this setup task

- [ ] Both repos exist locally, with clean first commits.
- [ ] `shared/contract.ts` and `sample-state.json` have all 9 scenes.
- [ ] The fallback web board renders `sample-state.json`, with a scene switcher and both toggles.
- [ ] The server skeleton runs and serves `GET /state` from the sample data and over websocket.
- [ ] The combined-check function exists and is unit-tested against demo-shop: it detects the getUser conflict, and only when both overlays are applied.
- [ ] The hook scripts exist with an example settings file. They don't have to be wired end to end yet.
- [ ] demo-shop is tagged `demo-start`, with the conflict proven and the reset script working.
- [ ] README, CLAUDE.md, and the docs outlines exist.

## 9. Ground rules

- Prefer boring, simple code. This is a 3-day demo, not a product.
- **Don't build:** authentication, databases, deployment, or support for languages other than TypeScript.
- Summarize what you built and what still needs a human decision at the end.
- Ask before anything irreversible or remote (creating GitHub repos, pushing, installing global tools).

## AI instruction files (team uses both Claude Code and Cursor)
Wherever this brief says CLAUDE.md, write the real instructions in an `AGENTS.md` in that folder (root and per-folder). Then add a `CLAUDE.md` next to each one whose only line is `@AGENTS.md`, so Claude Code and Cursor read the same rules. Put tool-specific notes under that import line only if truly needed. (Exception: demo-shop's own CLAUDE.md/AGENTS.md describe normal project conventions only, as stated above.)
