# How to work with AI on this project

You'll be building real parts of the demo, and an AI assistant can help a lot. The goal is that
**you** understand and can present what you built, so use the AI as a tutor, not a ghostwriter.

## Which AI?
Anything works: Claude Code, Cursor, GitHub Copilot Chat (free with the
[Student Developer Pack](https://education.github.com/pack)), or claude.ai / ChatGPT in a browser.
No AI at all is fine too. Every folder's `README.md` has the steps written out.

Claude Code and Cursor automatically read the `AGENTS.md` rules in your folder. With a browser
chat, paste in the folder's `AGENTS.md` and `README.md` first.

## Starting prompt (copy and paste this)

> Read CLAUDE.md and README.md in this folder. Explain what this module does and your plan before
> writing code. Then help me make the tests pass one at a time. Don't edit the tests.

For a board task, swap "README.md in this folder" for the task file, e.g. `tasks/board/1-render-nodes-and-edges.md`.

## Good habits
- **Ask "why" a lot.** "Why a Set here instead of an array?" is a great question.
- **Type it yourself** when you can. You'll remember it, and you'll be able to explain it at the pitch.
- **One test at a time.** Get one test green, commit, then move to the next.
- **Read the error message first**, before asking. Then paste the exact error into the chat.
- **If the AI wants to change a test file, say no.** The tests are the definition of done. If one
  looks wrong, ask Taylor.

## When you're stuck
See [workflow.md](workflow.md#when-youre-stuck).
