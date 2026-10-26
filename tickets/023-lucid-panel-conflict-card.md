# 023 · Lucid panel: conflict card with 'Why was this flagged?'

**Labels:** `medium` · `board-lucid` · `build`  
**Depends on:** [020](020-lucid-move-spike.md)  
**Owner:** _unclaimed_

## Why it matters
Scene 4: Priya reads the plain-English question in the panel, and a judge can open the evidence and see it's a real compiler error.

## What to do
- Add `src/panelView.ts` with `renderConflictCard(conflict, view, participants): string` (HTML). The extension sends the HTML to the panel with `panel.sendMessage`.
- Escape every piece of text before putting it in HTML (compiler errors contain `<` and `'`).
- Match the card in `docs/mockup/scene-4-collision.png`: summary, question, then the collapsible evidence.

## Tests
**Tests to add** *(proposed — the team looks these over before anyone starts)*
New file `test/panelView.test.ts`:
- scene 4's card contains `TS2531` and the affected code line
- product view shows `plainSummary`; code view shows the technical line
- after the decision (scene 6) it shows who decided and the decision text
- a compiler error containing `<script>` is escaped, not injected

## Done when
- [ ] Tests pass
- [ ] The card shows in the Lucid panel for scene 4
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Show both people's avatars (P, A, B circles) like the mockup header.
