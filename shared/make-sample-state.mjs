// Generates shared/sample-state.json: one BoardState per demo scene (scene-0 … scene-8).
// Edit the story here, then run:  node shared/make-sample-state.mjs
// The board is built against the JSON, so commit both files together.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Product-view names for the SAMPLE data only, taken from the mockup.
// The live server reads shared/labels.json instead (ticket 043).
const labels = {
  nodes: {
    "checkout/CheckoutPage.ts": { plainName: "Checkout page", plainDesc: "Where buyers pay" },
    "checkout/order.ts#placeOrder": { plainName: "Place the order", plainDesc: "Turns a cart into an order" },
    "checkout/SignUpPrompt.ts": { plainName: "\"Create an account\" offer", plainDesc: "Shown to guests after paying" },
    "auth/guest.ts#createGuestSession": { plainName: "Guest checkout", plainDesc: "Buy without an account" },
    "auth/login.ts#requireLogin": { plainName: "Sign-in check", plainDesc: "Makes sure you're signed in" },
    "account/AccountPage.ts": { plainName: "Your Account page", plainDesc: "Profile and settings" },
    "account/user.ts#getUser": { plainName: "Who's buying", plainDesc: "Looks up the signed-in buyer" },
    "account/SavedCardsList.ts": { plainName: "Saved cards list", plainDesc: "Shows a buyer's saved cards" },
    "payments/charge.ts#chargeCard": { plainName: "Charge the card", plainDesc: "Sends the payment" },
    "payments/vault.ts#saveCard": { plainName: "Remember the card", plainDesc: "Keeps a card for next time" },
    "payments/cardCache.ts": { plainName: "Speed-up cache", plainDesc: "Faster card lookups" },
  },
};

const COLUMNS = ["checkout", "auth", "account", "payments"];
const COLUMN_WIDTH = 240;
const ROW_HEIGHT = 110;

const participants = [
  { id: "priya", name: "Priya", role: "pm", color: "#6d28d9" },
  { id: "alice", name: "Alice", role: "dev", color: "#2563eb", ticket: "SHOP-212" },
  { id: "bob", name: "Bob", role: "dev", color: "#c2410c", ticket: "SHOP-219" },
  { id: "sam", name: "Sam", role: "dev", color: "#0f766e", ticket: "SHOP-230" },
];

const GET_USER = "account/user.ts#getUser";
const PLACE_ORDER = "checkout/order.ts#placeOrder";

// from = first scene the node exists; owner + isNew/changed describe who touches it and how.
const NODE_DEFS = [
  { id: "checkout/CheckoutPage.ts", symbol: "CheckoutPage.ts", row: 0, coverage: 72 },
  { id: PLACE_ORDER, symbol: "placeOrder()", row: 1, coverage: 91, owner: "alice", changedFrom: 1 },
  { id: "checkout/SignUpPrompt.ts", symbol: "SignUpPrompt.ts", row: 2, coverage: 75, owner: "alice", isNew: true, from: 5 },
  { id: "auth/login.ts#requireLogin", symbol: "requireLogin()", row: 0, coverage: 64, owner: "bob", changedFrom: 2 },
  { id: "auth/guest.ts#createGuestSession", symbol: "createGuestSession()", row: 1, coverage: 82, owner: "bob", isNew: true, from: 2 },
  { id: "account/AccountPage.ts", symbol: "AccountPage.ts", row: 0, coverage: 40 },
  { id: GET_USER, symbol: "getUser()", row: 1, coverage: 88, owner: "bob", changedFrom: 2 },
  { id: "account/SavedCardsList.ts", symbol: "SavedCardsList.ts", row: 2, coverage: 70, owner: "alice", isNew: true, from: 1 },
  { id: "payments/charge.ts#chargeCard", symbol: "chargeCard()", row: 0, coverage: 95 },
  { id: "payments/vault.ts#saveCard", symbol: "saveCard()", row: 1, coverage: 86, owner: "alice", isNew: true, from: 1 },
  { id: "payments/cardCache.ts", symbol: "cardCache.ts", row: 2, coverage: 0, owner: "alice", isNew: true, from: 7 },
];

const EDGE_DEFS = [
  { from: "checkout/CheckoutPage.ts", to: PLACE_ORDER, kind: "calls" },
  { from: "checkout/CheckoutPage.ts", to: "auth/login.ts#requireLogin", kind: "calls" },
  { from: "account/AccountPage.ts", to: "auth/login.ts#requireLogin", kind: "calls" },
  { from: "auth/login.ts#requireLogin", to: GET_USER, kind: "calls" },
  { from: PLACE_ORDER, to: "payments/charge.ts#chargeCard", kind: "calls" },
  { from: PLACE_ORDER, to: "payments/vault.ts#saveCard", kind: "calls", sceneFrom: 1 },
  { from: PLACE_ORDER, to: GET_USER, kind: "calls", sceneFrom: 1 },
  { from: "account/AccountPage.ts", to: "account/SavedCardsList.ts", kind: "imports", sceneFrom: 1 },
  { from: "account/SavedCardsList.ts", to: "payments/vault.ts#saveCard", kind: "imports", sceneFrom: 1 },
  { from: "auth/login.ts#requireLogin", to: "auth/guest.ts#createGuestSession", kind: "imports", sceneFrom: 2 },
  { from: "checkout/CheckoutPage.ts", to: "checkout/SignUpPrompt.ts", kind: "imports", sceneFrom: 5 },
  { from: "payments/vault.ts#saveCard", to: "payments/cardCache.ts", kind: "imports", sceneFrom: 7 },
];

const SCENES = [
  ["Two tickets", "Agents write code in minutes. The team usually finds out what they built at code review. Here's an online store with two harmless-looking tickets."],
  ["Alice's agent works", "Alice asks her agent for saved cards. It gets straight to work, and every change shows up live on the team's map."],
  ["Bob's agent works", "Bob's agent starts on guest checkout at the same time. Nobody is blocked or waiting for approval."],
  ["Collision", "Bob's agent edits getUser(). Blueprint re-checks everyone's work together and Alice's code now breaks. Only those two agents pause."],
  ["Decide together", "This is a product call, not a coding call. Priya, Alice and Bob settle it on the board."],
  ["Agents adapt", "The decision flows back into both agents and they carry on. A new box appears for the follow-up work."],
  ["Done", "Both branches finish. Boxes turn green as the combined tests pass."],
  ["Drift check", "Alice's agent added something nobody planned. Review becomes plan vs. actual, not a wall of diff."],
  ["Handoff", "The blueprint is now the documentation: every box remembers what was planned, decided and built."],
];

const DECISION_TEXT = "Guests can't save cards. After checkout, offer them \"Create an account to save your card.\"";

const CONFLICT = {
  id: "c1",
  kind: "semantic",
  between: ["bob", "alice"],
  nodeIds: [GET_USER, PLACE_ORDER],
  evidence: {
    changedBy: "bob",
    changedSymbol: "getUser",
    diff: [
      "--- a/account/user.ts",
      "+++ b/account/user.ts",
      "-export function getUser(): User {",
      "-  if (!signedInUser) {",
      "-    throw new Error(\"No one is signed in\");",
      "-  }",
      "-  return signedInUser;",
      "+export function getUser(): User | null {",
      "+  return signedInUser ?? null;",
    ].join("\n"),
    affectedFile: "checkout/order.ts",
    affectedLine: 47,
    affectedCode: "saveCard(getUser().id, card);",
    compilerError: "checkout/order.ts(47,12): error TS2531: Object is possibly 'null'.",
  },
  plainSummary: "Saved cards assumes every buyer has an account. Guest checkout removes that. Neither agent can settle this alone.",
  question: "Can guests save cards?",
  options: [
    { id: "signup", label: "No — offer guests \"Create an account to save your card\"" },
    { id: "email", label: "Yes — save it against a verified email" },
  ],
};

const AGENT_STATUS = {
  alice: ["idle", "working", "working", "paused", "paused", "resumed", "done", "done", "done"],
  bob: ["idle", "idle", "working", "paused", "paused", "resumed", "done", "done", "done"],
  sam: ["idle", "working", "working", "working", "working", "working", "done", "done", "done"],
};

function statusFor(def, scene) {
  if (def.id === "payments/cardCache.ts") return scene === 7 ? "drift" : "built";
  if (CONFLICT.nodeIds.includes(def.id)) {
    if (scene === 3 || scene === 4) return "conflict";
    if (scene === 5) return "resolved";
  }
  const startedAt = def.isNew ? def.from : def.changedFrom;
  if (!def.owner || startedAt === undefined || scene < startedAt) return "existing";
  if (scene >= 6) return "built";
  return def.isNew ? "in_progress" : "changing";
}

function historyFor(def, scene) {
  const h = [];
  const add = (minScene, at, text, by) => { if (scene >= minScene) h.push({ at, text, ...(by ? { by } : {}) }); };
  if (def.id === GET_USER) {
    add(0, "2026-10-01", "Long-standing code: returns the signed-in buyer, throws if nobody is signed in");
    add(2, "2026-10-23T10:12", "Bob's agent changed it to return null for guests (SHOP-219)", "bob");
    add(3, "2026-10-23T10:12", "Combined type check failed in Alice's checkout/order.ts:47 (SHOP-212 assumed every buyer has an account)");
    add(5, "2026-10-23T10:20", `Priya decided: ${DECISION_TEXT}`, "priya");
    add(6, "2026-10-24T09:00", "Built as planned. Callers must now check for guests.");
    return h;
  }
  if (def.id === "payments/cardCache.ts") {
    add(7, "2026-10-24T09:05", "Added by Alice's agent without being in its plan; no tests", "alice");
    add(8, "2026-10-24T09:10", "Kept and added to the plan by Alice", "alice");
    return h;
  }
  if (def.id === "checkout/SignUpPrompt.ts") {
    add(5, "2026-10-23T10:21", `Added because Priya decided: ${DECISION_TEXT}`, "alice");
    add(6, "2026-10-24T09:00", "Built");
    return h;
  }
  if (!def.owner) {
    add(0, "2026-10-01", "Existing code");
    return h;
  }
  const ticket = def.owner === "alice" ? "SHOP-212" : "SHOP-219";
  const name = def.owner === "alice" ? "Alice" : "Bob";
  add(def.from ?? def.changedFrom, "2026-10-23T10:05", `${def.isNew ? "Started" : "Changed"} by ${name}'s agent for ${ticket}`, def.owner);
  add(5, "2026-10-23T10:21", "Adjusted after Priya's decision on getUser()");
  add(6, "2026-10-24T09:00", "Built");
  return h;
}

function buildScene(scene) {
  const nodes = NODE_DEFS.filter((d) => (d.from ?? 0) <= scene).map((d) => {
    const column = d.id.split("/")[0];
    const label = labels.nodes[d.id];
    const status = statusFor(d, scene);
    return {
      id: d.id,
      file: d.id.split("#")[0],
      symbol: d.symbol,
      plainName: label.plainName,
      plainDesc: label.plainDesc,
      column,
      x: COLUMNS.indexOf(column) * COLUMN_WIDTH,
      y: d.row * ROW_HEIGHT,
      status,
      ...(d.owner && status !== "existing" ? { owner: d.owner } : {}),
      ...(d.isNew ? { isNew: true } : {}),
      coverage: d.coverage,
      history: historyFor(d, scene),
    };
  });
  const present = new Set(nodes.map((n) => n.id));
  const edges = EDGE_DEFS.filter((e) => (e.sceneFrom ?? 0) <= scene && present.has(e.from) && present.has(e.to))
    .map(({ from, to, kind }) => ({ from, to, kind }));

  const conflicts = [];
  if (scene >= 3) {
    conflicts.push({
      ...CONFLICT,
      ...(scene >= 5 ? { decision: { optionId: "signup", decidedBy: "priya", text: DECISION_TEXT, at: "2026-10-23T10:20" } } : {}),
    });
  }

  const drift = [];
  if (scene >= 7) {
    drift.push({
      id: "d1",
      participant: "alice",
      file: "payments/cardCache.ts",
      nodeId: "payments/cardCache.ts",
      reason: "Not in Alice's plan, and it has no tests",
      ...(scene >= 8 ? { resolved: "kept" } : {}),
    });
  }

  const agentStatus = Object.fromEntries(Object.entries(AGENT_STATUS).map(([id, s]) => [id, s[scene]]));
  return { participants, nodes, edges, conflicts, drift, agentStatus };
}

const scenes = SCENES.map(([title, narration], i) => ({ id: `scene-${i}`, title, narration, state: buildScene(i) }));
writeFileSync(join(here, "sample-state.json"), JSON.stringify({ scenes }, null, 2) + "\n");
console.log(`wrote ${scenes.length} scenes to shared/sample-state.json`);
