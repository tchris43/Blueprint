// PreToolUse hook (matcher: Edit|Write|MultiEdit).
// Before every edit, ask Blueprint whether this agent is paused or has a new decision.

import { callServer, PARTICIPANT, readHookInput, respond } from "./lib.mjs";

await readHookInput(); // not needed yet, but the stdin must be drained
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
  respond({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: `Blueprint: the team made a decision that affects your work. Follow it: ${status.unseenDecision}`,
    },
  });
}

process.exit(0);
