# 305 · Check what the Lucid spike never verified

**Labels:** `starter` · `board-lucid` · `verify`  
**Depends on:** [205](205-lucid-move-spike.md)  
**Owner:** _unclaimed_

## Why it matters
The board must not surprise us on stage. The findings list several things that were never actually seen working.

## What to do
- Lucid spike: `C:\Users\taych\hackathon\lucid-spike` and its `LUCID-FINDINGS.md` (read the Gotchas section first).
- Check each item under 'Not verified' in the findings: the lines follow blocks when dragged; `in_progress` and `existing` colors; the polling fallback (stop the WebSocket and see if polling takes over); duplicate panels after reloads.
- Record results in `tasks/board/lucid-findings.md`.

## Done when
- [ ] Every 'not verified' item now says works / broken, with how you checked
- [ ] Broken things filed as tickets
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Time how long a status change takes to show on the canvas.
