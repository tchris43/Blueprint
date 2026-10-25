# Lucid extension (Plan A)

Owner: partner 2. **Not scaffolded yet.** Follow [task 8](../../tasks/board/8-lucid-spike.md):
create it with Lucid's official "Create Extensions" skill (Lucid developer docs → AI tools), so the
files match what `lucid-extension-sdk` expects. Don't hand-write the scaffold.

## How it should work
- A right-side Panel (iframe) connects to `ws://localhost:4000/live` and posts each `BoardState` to the extension.
- The extension draws and recolors blocks (`page.addBlock`, `block.textAreas.set`, fill style, lines).
- Each block stores our node id (`MapNode.id`) in its shape data, so updates recolor instead of redraw.
- Lucid's own real-time collaboration shows the changes to everyone who has the document open.
