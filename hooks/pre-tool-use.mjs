// PreToolUse hook (matcher: Edit|Write|MultiEdit).
// Before every edit: 1) ask Blueprint whether this agent is paused or has a new decision,
// 2) rebuild the file the edit WOULD produce and ask Blueprint to check it against teammates'
// in-progress work (ticket 102). A conflicting edit is denied, so it never reaches disk.

import { readFile } from "node:fs/promises";
import { callServer, PARTICIPANT, readHookInput, repoRelativePath, respond } from "./lib.mjs";

const input = await readHookInput();
if (!PARTICIPANT) process.exit(0);

const status = await callServer(`/status?participant=${encodeURIComponent(PARTICIPANT)}`);
if (!status) process.exit(0); // server unreachable: let the agent keep working

if (status.status === "paused") {
  respond({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: `Paused by Blueprint: ${status.pausedBecause ?? "waiting on a team decision"} Do not edit files until the team decides; tell the user you are waiting.`,
    },
  });
}

if (status.unseenDecision) {
  // No permissionDecision: the normal permission flow still applies, we only add context.
  // AUDIT: respond() exits, so this one edit skips the pre-check below. The post hook still checks
  // it once saved, so a new conflict here is caught after the edit instead of before.
  respond({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: `Blueprint: the team made a decision that affects your work. Follow it: ${status.unseenDecision}`,
    },
  });
}

/** Replace `oldText` with `newText` once, or everywhere; null if `oldText` isn't in the file. */
function applyEdit(content, oldText, newText, replaceAll) {
  if (!content.includes(oldText)) return null;
  return replaceAll ? content.split(oldText).join(newText) : content.replace(oldText, () => newText);
}

/** The full file this tool call would leave on disk, or null if we can't tell (then: don't check). */
async function proposedContent(toolName, toolInput) {
  if (toolName === "Write") return toolInput.content;
  // Edit and MultiEdit only work on a file that exists; if it doesn't, Claude Code fails the edit itself.
  let content;
  try {
    content = await readFile(toolInput.file_path, "utf8");
  } catch {
    return null;
  }
  if (toolName === "Edit") return applyEdit(content, toolInput.old_string, toolInput.new_string, toolInput.replace_all);
  if (toolName === "MultiEdit") {
    for (const edit of toolInput.edits ?? []) {
      content = applyEdit(content, edit.old_string, edit.new_string, edit.replace_all);
      if (content === null) return null;
    }
    return content;
  }
  return null;
}

if (!input.tool_input?.file_path) process.exit(0);
const content = await proposedContent(input.tool_name, input.tool_input);
// An old_string that isn't in the file means Claude Code will fail the edit anyway: skip, don't guess.
if (content === null) process.exit(0);

// A combined check takes ~1-3s. Give up after 8s and allow, so a slow server never blocks anyone.
// AUDIT: must stay under the hook timeout in the agent's settings (example-settings.json: 20s).
const body = { participant: PARTICIPANT, files: [{ path: repoRelativePath(input), content }] };
const reply = await callServer(
  "/check",
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  8000,
);

// No respond()/process.exit() from here on: on Windows (Node 24), exiting right after this second
// request crashes Node (UV_HANDLE_CLOSING, exit 127). Writing the output and letting the script
// end on its own is the same result, and Claude Code reads it the same way.
if (reply?.paused) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Blueprint stopped this edit before it was saved: it would break a teammate's in-progress work (${reply.conflict?.summary ?? "see the team board"}). Do not retry or work around it. Stop and tell the user you are waiting for a team decision.`,
      },
    }),
  );
}
