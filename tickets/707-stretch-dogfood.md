# 707 · Stretch — run Blueprint on the Blueprint repo itself

**Labels:** `medium` · `server` · `verify`  
**Depends on:** [202](202-conflict-to-nodes.md), [101](101-post-hook-real-edits.md)  
**Owner:** _unclaimed_

## Why it matters
A pitch moment: 'we used it to build it'. A screenshot of a real conflict between teammates beats a staged one.

## What to do
- On day 3, install the hooks in two teammates' Blueprint clones and point the server at this repo (it's a pnpm workspace with several tsconfigs; note what breaks).
- If a real conflict happens, screenshot it for the pitch.

## Done when
- [ ] Notes on what worked and what broke
- [ ] A screenshot, if a conflict happened
- [ ] Show the team the result and explain how it works in 2 minutes. You present this piece at the final demo.

## Stretch
Support multiple tsconfigs in the combined check.
