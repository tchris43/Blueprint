// pnpm test       → runs the DONE groups. These must pass before every push.
// pnpm test:todo  → runs the teammate task groups. These fail on purpose until each task is finished.
//
// When a module's task is finished and its tests pass, move its name from TODO to DONE.

import { spawnSync } from "node:child_process";

const DONE = ["check:contract", "test:engine"];
const TODO = ["test:drift", "test:coverage", "test:explain", "test:board"];

const group = process.argv[2] === "todo" ? TODO : DONE;
const results = group.map((script) => {
  console.log(`\n━━━ pnpm ${script} ━━━`);
  // shell: true so Windows finds pnpm.cmd
  const { status } = spawnSync("pnpm", [script], { stdio: "inherit", shell: true });
  return { script, passed: status === 0 };
});

console.log("\nSummary");
for (const { script, passed } of results) console.log(`  ${passed ? "PASS" : "FAIL"}  pnpm ${script}`);

const failed = results.filter((r) => !r.passed).length;
if (process.argv[2] === "todo") {
  console.log(`\n${results.length - failed} of ${results.length} task groups done. Failing ones are still in progress, which is expected.`);
}
process.exit(failed === 0 ? 0 : 1);
