// Drives the live demo without live agents: the exact edits Alice's and Bob's agents make, sent
// through the real server and the real pre-edit hook. Nothing is faked except who typed them.
//
//   node scripts/demo.mjs reset   fresh board (all grey)
//   node scripts/demo.mjs alice   Alice's saved-cards edit lands (saveCard(getUser().id, card))
//   node scripts/demo.mjs bob     Bob's agent tries getUser(): User | null -> refused before it's saved
//
// Then Chris clicks a choice in the Lucid panel. Needs `pnpm server` running.

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SERVER = process.env.BLUEPRINT_SERVER ?? "http://localhost:4000";
const DEMO_SHOP = process.env.DEMO_SHOP_DIR ?? join(root, "..", "demo-shop");
const fixtures = join(root, "server", "test", "fixtures");

function filesOf(participant) {
  const base = join(fixtures, participant);
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else files.push({ path: relative(base, full).replace(/\\/g, "/"), content: readFileSync(full, "utf8") });
    }
  };
  walk(base);
  return files;
}

async function post(path, body) {
  const res = await fetch(`${SERVER}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  return res.json();
}

/** Bob's real edit to account/user.ts, as the Edit tool call his agent would make. */
function bobEditEvent() {
  const file = join(DEMO_SHOP, "account", "user.ts");
  const current = readFileSync(file, "utf8");
  const start = current.indexOf("/** Returns the signed-in customer.");
  // AUDIT: tied to demo-shop's getUser() being the last function in user.ts.
  const oldString = current.slice(start, current.lastIndexOf("}") + 1);
  const newString = "/** Returns the signed-in customer, or null for a guest. */\nexport function getUser(): User | null {\n  return signedInUser ?? null;\n}";
  return { hook_event_name: "PreToolUse", tool_name: "Edit", cwd: DEMO_SHOP, tool_input: { file_path: file, old_string: oldString, new_string: newString } };
}

const step = process.argv[2];
try {
  if (step === "reset") {
    await post("/reset");
    console.log("Board reset: all grey, nobody paused.");
  } else if (step === "alice") {
    await post("/edits", { participant: "alice", files: filesOf("alice") });
    console.log("Alice's edit landed: checkout/order.ts now calls saveCard(getUser().id, card).");
  } else if (step === "bob") {
    const hook = spawnSync("node", [join(root, "hooks", "pre-tool-use.mjs")], {
      input: JSON.stringify(bobEditEvent()),
      env: { ...process.env, BLUEPRINT_PARTICIPANT: "bob", BLUEPRINT_SERVER: SERVER, CLAUDE_PROJECT_DIR: DEMO_SHOP },
      encoding: "utf8",
    });
    const reply = hook.stdout ? JSON.parse(hook.stdout) : null;
    const decision = reply?.hookSpecificOutput?.permissionDecision;
    if (decision === "deny") console.log(`Bob's edit was REFUSED before it was saved:\n  ${reply.hookSpecificOutput.permissionDecisionReason}`);
    else console.log(`Bob's edit was allowed (no conflict). Did you run "alice" first? (hook exit ${hook.status})`);
  } else {
    console.log("Usage: node scripts/demo.mjs reset | alice | bob");
  }
} catch (e) {
  console.log(`Can't reach Blueprint at ${SERVER}. Is "pnpm server" running? (${e.message})`);
}
