# Lucid extension (Plan A)

**Empty until ticket 205.** A working spike exists at `C:\Users\taych\hackathon\lucid-spike`
(scaffolded with Lucid's "Create Extensions" skill). Ticket 205 moves it here and points it at our
server. Read its `LUCID-FINDINGS.md` first, especially the Gotchas section.

## How it should work
- A right-side Panel (iframe) connects to `ws://localhost:4000/live` and posts each `BoardState` to the extension.
- The extension draws and recolors blocks (`page.addBlock`, `block.textAreas.set`, fill style, lines).
- Each block stores our node id (`MapNode.id`) in its shape data, so updates recolor instead of redraw.
- Lucid's own real-time collaboration shows the changes to everyone who has the document open.
