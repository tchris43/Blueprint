# Working with AI tools on this project

AI assistants are welcome on every ticket. The bar is the same with or without one: whoever owns a
ticket understands what they shipped and can present it in 2 minutes.

## Which tool
Any of these works: Claude Code, Cursor, GitHub Copilot Chat (free with the
[GitHub Student Developer Pack](https://education.github.com/pack)), or claude.ai / ChatGPT in a browser.
Every folder's `README.md` and every ticket list the steps in full, so working without one is fine too.

Claude Code and Cursor read each folder's `AGENTS.md` automatically. With a browser chat, paste in
the root `AGENTS.md`, the folder's `AGENTS.md`, and your ticket first.

## Starting prompt (copy and paste)

> Read AGENTS.md, the README.md in this folder, and my ticket (tickets/NNN-….md). Explain what this
> piece does and your plan before writing code. Then help me make the tests pass one at a time.
> Don't edit the tests.

## Habits that work well
- **Ask why.** "Why a Set here instead of an array?" The answer is what you'll need in the 2-minute explain-back.
- **Write or edit the key lines yourself.** It's the fastest way to be sure you can explain them.
- **One test at a time.** Get one test green, commit, then move on.
- **Read the error message first**, then paste the exact text into the chat.
- **If the AI wants to change a test file, stop.** Tests define done. If one looks wrong, raise it with the team.

## When you're stuck
See [workflow.md](workflow.md#when-youre-stuck).
