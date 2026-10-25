// pnpm doctor — checks that this computer is ready to work on Blueprint.
// Run it on day 1. Every line should say OK.

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let problems = 0;

function check(name, ok, fix) {
  console.log(`${ok ? "OK  " : "FIX "} ${name}${ok ? "" : `\n     → ${fix}`}`);
  if (!ok) problems++;
}

/** Returns the command's output, or null if it failed. */
function run(command) {
  const result = runAnyway(command);
  return result.ok ? result.output : null;
}

/** Runs a command and keeps its output even when it exits with an error (e.g. failing tests). */
function runAnyway(command) {
  try {
    return { ok: true, output: execSync(command, { cwd: root, stdio: "pipe", encoding: "utf8" }) };
  } catch (failure) {
    return { ok: false, output: `${failure.stdout ?? ""}${failure.stderr ?? ""}` };
  }
}

const [major, minor] = process.versions.node.split(".").map(Number);
check(`Node ${process.versions.node} (need 20.19 or newer)`, major > 20 || (major === 20 && minor >= 19), "Install the LTS version from https://nodejs.org");

const pnpmVersion = run("pnpm --version");
check(`pnpm ${pnpmVersion?.trim() ?? "missing"}`, Boolean(pnpmVersion), "Run: corepack enable pnpm   (see README, step 1)");

check("git installed", Boolean(run("git --version")), "Install from https://git-scm.com");

const installed = ["node_modules", "server/node_modules", "board/web/node_modules", "shared/node_modules"].every((dir) => existsSync(join(root, dir)));
check("dependencies installed", installed, "Run: pnpm install");

if (installed) {
  check("contract tests run and pass", run("pnpm check:contract") !== null, "Run `pnpm check:contract` and send Taylor the output");
  // The board tests fail on purpose until the board-web tickets are done; we only check they RUN.
  const boardTests = runAnyway("pnpm --filter @blueprint/board-web exec vitest run");
  check("board tests run (failing is OK at the start)", /Tests\s+.*\d+/.test(boardTests.output), "Run `pnpm test:board` and send Taylor the output");
}

const demoShop = join(root, "..", "demo-shop");
console.log(existsSync(demoShop) ? "OK   demo-shop found next to this repo" : "INFO demo-shop not found next to this repo (only Taylor needs it)");

console.log(problems === 0 ? "\nAll good. You're ready." : `\n${problems} thing(s) to fix. Fix them top to bottom, then run pnpm doctor again.`);
process.exit(problems === 0 ? 0 : 1);
