// Runs the real combined check against the real demo-shop repo (DEMO_SHOP_DIR).
// Fixtures in test/fixtures/<participant>/ are the demo's in-progress edits.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DEMO_SHOP_DIR } from "../src/config";
import { runCombinedCheck, type Overlay } from "../src/combinedCheck";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function loadOverlay(participant: string): Overlay {
  const root = join(fixtures, participant);
  const files: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else files[relative(root, full).replace(/\\/g, "/")] = readFileSync(full, "utf8");
    }
  };
  walk(root);
  return { participant, files };
}

const alice = loadOverlay("alice");
const bob = loadOverlay("bob");
const nobody: Overlay = { participant: "sam", files: {} };

describe.skipIf(!existsSync(join(DEMO_SHOP_DIR, "node_modules")))("runCombinedCheck on demo-shop", () => {
  it("flags the getUser conflict when Alice's and Bob's work are combined", async () => {
    const result = await runCombinedCheck(DEMO_SHOP_DIR, alice, bob);

    expect(result.errors.a).toEqual([]);
    expect(result.errors.b).toEqual([]);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toMatchObject({
      changedBy: "bob",
      affected: "alice",
      changedSymbol: "getUser",
      affectedCode: "saveCard(getUser().id, card);",
      error: { file: "checkout/order.ts", line: 42, code: "TS2531" },
    });
  }, 60_000);

  it("finds nothing when only Alice's work is applied", async () => {
    const result = await runCombinedCheck(DEMO_SHOP_DIR, alice, nobody);
    expect(result.conflicts).toEqual([]);
  }, 60_000);

  it("finds nothing when only Bob's work is applied", async () => {
    const result = await runCombinedCheck(DEMO_SHOP_DIR, nobody, bob);
    expect(result.conflicts).toEqual([]);
  }, 60_000);

  it("flags a same-file conflict without type checking", async () => {
    const bobAlsoEditsOrder: Overlay = { participant: "bob", files: { "checkout/order.ts": "// bob\n" } };
    const result = await runCombinedCheck(DEMO_SHOP_DIR, alice, bobAlsoEditsOrder);
    expect(result.sameFile).toEqual([{ file: "checkout/order.ts", between: ["alice", "bob"] }]);
    expect(result.conflicts).toEqual([]);
  });

  it("leaves demo-shop's node_modules in place after cleanup", async () => {
    await runCombinedCheck(DEMO_SHOP_DIR, nobody, nobody);
    expect(existsSync(join(DEMO_SHOP_DIR, "node_modules", "typescript", "bin", "tsc"))).toBe(true);
  }, 60_000);
});
