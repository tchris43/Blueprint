# Lucid extension (Plan A board)

Moved in from the spike (`C:\Users\taych\hackathon\lucid-spike`, see its `LUCID-FINDINGS.md` Gotchas).
Its own pnpm project, outside the root workspace.

## How it works
- A right-side Panel (iframe) connects to `ws://localhost:4000/live`, shows the conflict card and
  the PM's decision buttons (they `POST /decision`), and forwards each `BoardState` to the extension.
- The extension draws one block per node in folder columns, with a line per edge, and recolors blocks by status.
- Each block stores its `MapNode.id` as shape data `bp_id`, so updates recolor instead of redraw.

## Run it
```powershell
# once
cd board\lucid-extension\editorextensions\blueprint-board; pnpm install

# terminal 1 (repo root)
pnpm server
# terminal 2: Lucid dev server on localhost:9900
cd board\lucid-extension; npx lucid-package@latest --mode pnpm test-editor-extension
```
In Chrome: open a Lucidchart document, **Developer > Enter developer mode** (enable developer tools in
account settings once). If nothing loads, lock icon in the address bar > **Local network access > Allow**.
Then the **blueprint-board** menu: **open live panel**, then **draw map**.
After a code change, hit the refresh arrow in the developer bar (the editor keeps the old bundle).

Build check: `npx lucid-package@latest --mode pnpm build-editor-extension blueprint-board` exits 0.
