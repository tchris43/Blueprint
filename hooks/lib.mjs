// Shared helpers for the Blueprint Claude Code hooks. No dependencies: plain Node 18+.

import { relative } from "node:path";

export const SERVER = process.env.BLUEPRINT_SERVER ?? "http://localhost:4000";
export const PARTICIPANT = process.env.BLUEPRINT_PARTICIPANT ?? "";

/** Claude Code sends the hook input as JSON on stdin. */
export async function readHookInput() {
  let text = "";
  for await (const chunk of process.stdin) text += chunk;
  return JSON.parse(text);
}

/** Path of the edited file relative to the demo-shop root, with forward slashes. */
export function repoRelativePath(input) {
  const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
  return relative(root, input.tool_input.file_path).replace(/\\/g, "/");
}

// AUDIT: every network failure is swallowed so a dead Blueprint server never blocks a
// developer's agent. The cost: if the server is down, conflicts are silently missed.
export async function callServer(path, options = {}, timeoutMs = 3000) {
  try {
    const response = await fetch(`${SERVER}${path}`, { ...options, signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function respond(output) {
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}
