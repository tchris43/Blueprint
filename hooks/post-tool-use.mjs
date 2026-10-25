// PostToolUse hook (matcher: Edit|Write|MultiEdit).
// After every edit, send the changed file's full content to Blueprint for the combined check.

import { readFile } from "node:fs/promises";
import { callServer, PARTICIPANT, readHookInput, repoRelativePath, respond } from "./lib.mjs";

const input = await readHookInput();
if (!PARTICIPANT || !input.tool_input?.file_path) process.exit(0);

const content = await readFile(input.tool_input.file_path, "utf8");
const body = { participant: PARTICIPANT, files: [{ path: repoRelativePath(input), content }] };

// A combined check takes ~1-3s, so allow longer than the status call.
const reply = await callServer(
  "/edits",
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  15000,
);

// The reply is data only: we read two fields and never pass server text through as instructions
// beyond the conflict summary.
if (reply?.paused) {
  respond({
    decision: "block",
    reason: `Paused by Blueprint: your work now conflicts with a teammate's (${reply.conflict?.summary ?? "see the team board"}). Stop editing and wait for the team's decision.`,
  });
}

process.exit(0);
