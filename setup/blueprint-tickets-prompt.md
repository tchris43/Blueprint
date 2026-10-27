# Prompt 3: create the ticket backlog

> Paste everything below the line into Claude Code, in the `blueprint` repo.

---

Turn the remaining work into a ticket backlog for our 3-person hackathon team. Read `AGENTS.md`, `docs/`, `tasks/`, and the existing tests and stubs first, so the tickets match what already exists. Also read `LUCID-FINDINGS.md` from the Lucid spike: a working Lucid editor extension that draws blocks, stores `bp_id` in shape data, and recolors blocks from a local WebSocket server.

## Goal

Small tickets anyone can pick up, but **not tickets an AI can finish alone in 5 minutes with no human thinking**. Many tickets should need a human to make a judgment call, check the result with their own eyes, or explain it to the team.

## Ticket format

Write each ticket as a markdown file, `tickets/NNN-short-name.md`. Ask me before creating GitHub issues; if I say yes, use `gh issue create` with labels. Each ticket has:

- **Title**
- **Labels:**
  - **difficulty:** `starter` / `medium` / `core`. Core = Taylor only; these are on the critical path.
  - **area:** `board-lucid` / `board-web` / `server` / `modules` / `demo-shop` / `demo-pitch`
  - **type:**
    - `build`: tests define it
    - `design`: a judgment call; propose options, then the team picks
    - `verify`: try to break it and report
    - `story`: demo, pitch, writing
- **Depends on:** ticket numbers
- **Why it matters:** which demo scene or pitch moment uses it (1–2 sentences)
- **What to do:** steps, with the files to touch. Only one area per ticket, to avoid two people editing the same files.
- **Done when:** a checklist. For build tickets, the specific tests that must pass.
- **Explain-back:** every ticket ends with "Show the team the result and explain how it works in 2 minutes." That person presents this piece at the final demo.
- **Stretch:** one optional improvement for someone who finishes early.

Also create `tickets/README.md` with:
- a table of all tickets (number, title, difficulty, area, type, depends on, owner, status)
- how to claim a ticket: put your name in Owner, and create a branch named `<name>/<ticket-number>`
- "only one in-progress ticket per person"

## Tickets to create

Use these as a starting point; split or merge them so each is 1–3 hours.

**Core (Taylor):**
- PostToolUse hook sends real edits to the server.
- PreToolUse hook pauses an agent during a conflict and passes in the decision.
- Server state plus the WebSocket `/live` endpoint broadcasting `BoardState`.
- Run the combined check on every edit and create the `Conflict`.
- Code map from demo-shop using ts-morph.
- `POST /decision` resumes both agents.
- Replay mode: record hook events from a good run, replay them on command.
- Reset command for rehearsals.

**board-lucid (medium):**
- Move the spike into `board/lucid-extension`.
- Render `BoardState` nodes and edges in Lucid with column layout.
- Status styles matching the mockup legend.
- Panel: conflict card with "Why was this flagged?"
- Panel: decision buttons → `POST /decision`
- Panel: Product/Code view toggle
- Click a block → history in the panel
- Coverage layer

**board-web (medium):** the existing task 1–4 tests, then a live WebSocket connection. Keep it as the backup board.

**modules (starter):** drift detector, coverage mapper, conflict explainer (writing the prompt is the human part), and `labels.json`.

**design (starter / medium):**
- **Lucid board look:** colors, legend, spacing. Make 2 versions; the team picks.
- **Chris's decision panel:** test it on one non-technical person and write down what confused them.
- **Plain-English copy** for every node and status.

**verify (starter):**
- Try 5 unexpected edits in demo-shop (rename a file, edit the same file as the other person, a change that breaks tests but not types) and record what Blueprint does.
- A fresh-machine setup test following only the README.

**story (starter):**
- Demo script with the exact prompts Alice and Bob type.
- Pitch outline plus the competitor slide (Overture, Plans, Devin Codemaps, Kiro/Spec Kit, Shepherd/mcp-coordinator, and our gap).
- Get a real quote from a PM or a Lucid engineer: "How do you find out what devs actually built?"
- Record the backup demo video (depends on the core loop).

**stretch:**
- Drift shown in Lucid.
- Dogfood: run Blueprint on the blueprint repo itself on day 3 and screenshot any real conflict for the pitch.

## Rules

- Don't implement any ticket. Only write the tickets.
- Every build ticket must point to existing tests, or include the exact tests to add. If you add tests, ask me to review them before anyone starts.
- Mark the critical path in `tickets/README.md`, the order in which things must happen for the end-to-end demo to work by midday of day 2.
- Finish with a short summary:
  - how many tickets of each difficulty and type
  - the critical path
  - 3 good first tickets for each teammate
