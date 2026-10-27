// POST /check (ticket 102): a proposed edit is checked against teammates' in-progress work
// BEFORE it lands. Runs the real combined check on the real demo-shop, in-process.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { server } from "../src/index";
import { DEMO_SHOP_DIR } from "../src/config";
import { resetStore, store } from "../src/store";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function filesOf(participant: string): { path: string; content: string }[] {
  const root = join(fixtures, participant);
  const files: { path: string; content: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else files.push({ path: relative(root, full).replace(/\\/g, "/"), content: readFileSync(full, "utf8") });
    }
  };
  walk(root);
  return files;
}

let base = "";
async function post(path: string, body: unknown) {
  const res = await fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

beforeAll(async () => {
  await new Promise<void>((done) => server.listen(0, done));
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((done) => server.close(() => done())));
beforeEach(() => resetStore());

const bobProposal = filesOf("bob");
const bobUserTs = join(DEMO_SHOP_DIR, "account/user.ts");

describe.skipIf(!existsSync(join(DEMO_SHOP_DIR, "node_modules")))("POST /check", () => {
  it("denies Bob's getUser change while Alice's getUser().id line exists, and pauses both", async () => {
    const before = readFileSync(bobUserTs, "utf8");
    await post("/edits", { participant: "alice", files: filesOf("alice") });

    const reply = await post("/check", { participant: "bob", files: bobProposal });

    expect(reply.paused).toBe(true);
    expect(reply.conflict.summary).toBeTruthy();
    const conflict = store.board.conflicts[0];
    expect(conflict.evidence).toMatchObject({ changedSymbol: "getUser", affectedFile: "checkout/order.ts", affectedLine: 47 });
    expect(conflict.evidence.compilerError).toContain("TS2531");
    expect(store.board.agentStatus.alice).toBe("paused");
    expect(store.board.agentStatus.bob).toBe("paused");
    expect(readFileSync(bobUserTs, "utf8")).toBe(before); // the edit never touched disk
    // The board's boxes for both sides of the break turn red.
    expect(conflict.nodeIds).toEqual(["account/user.ts#getUser", "checkout/order.ts#placeOrder"]);
    const statusOf = (id: string) => store.board.nodes.find((n) => n.id === id)?.status;
    expect(statusOf("account/user.ts#getUser")).toBe("conflict");
    expect(statusOf("checkout/order.ts#placeOrder")).toBe("conflict");
    expect(statusOf("payments/charge.ts#chargeCard")).toBe("existing");
  }, 60_000);

  it("allows the same proposal when Alice hasn't written her line, and records nothing", async () => {
    const reply = await post("/check", { participant: "bob", files: bobProposal });
    expect(reply.paused).toBe(false);
    expect(store.board.conflicts).toEqual([]);
  }, 60_000);

  it("does not store a proposal as Bob's change", async () => {
    await post("/check", { participant: "bob", files: bobProposal });
    expect(store.overlays.get("bob")?.files ?? {}).toEqual({});
  }, 60_000);

  it("allows Bob's retry once the conflict is decided", async () => {
    await post("/edits", { participant: "alice", files: filesOf("alice") });
    await post("/check", { participant: "bob", files: bobProposal });
    const conflict = store.board.conflicts[0];
    await post("/decision", { conflictId: conflict.id, optionId: conflict.options[0].id, decidedBy: "chris" });

    const retry = await post("/check", { participant: "bob", files: bobProposal });

    expect(retry.paused).toBe(false);
    expect(store.board.conflicts).toHaveLength(1);
    expect(store.board.nodes.find((n) => n.id === "account/user.ts#getUser")?.status).toBe("resolved");
  }, 60_000);
});
