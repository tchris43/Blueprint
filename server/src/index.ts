import { createServer } from "node:http";
import express from "express";
import { WebSocketServer, type WebSocket } from "ws";
import type {
  Conflict,
  DecisionRequest,
  DriftResolveRequest,
  EditsRequest,
  IntentRequest,
  LiveMessage,
  NodeStatus,
  StatusResponse,
} from "../../shared/contract";
import { runCombinedCheck, type Overlay } from "./combinedCheck";
import { DEMO_SHOP_DIR } from "./config";
import { DEMO_FALLBACK, genericFallback, isDemoConflict } from "./explain/fallbacks";
import {
  markDecisionSeen,
  openConflictFor,
  resetStore,
  sampleScenes,
  setAgentStatus,
  store,
  unseenDecisionFor,
} from "./store";

// Exported so tests can run the server in-process; src/main.ts is what listens.
export const app = express();
app.use(express.json({ limit: "5mb" }));
app.use((_req, res, next) => {
  // The board runs on another port (Vite / Lucid panel), so allow cross-origin reads.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ---- live board updates ----

export const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/live" });

function broadcast(): void {
  const message: LiveMessage = { type: "state", state: store.board };
  const text = JSON.stringify(message);
  wss.clients.forEach((client: WebSocket) => client.send(text));
}

wss.on("connection", (socket) => {
  const message: LiveMessage = { type: "state", state: store.board };
  socket.send(JSON.stringify(message));
});

// ---- endpoints ----

app.get("/state", (_req, res) => {
  res.json(store.board);
});

/**
 * The map boxes on each side of a break: the changed function, and the box for the file that no
 * longer compiles. Stand-in for ticket 202's real mapping.
 * AUDIT: matches by "#symbol" suffix and by file; a symbol or file with no box gives fewer ids.
 */
function nodeIdsFor(evidence: Conflict["evidence"]): string[] {
  const changed = store.board.nodes.find((n) => n.id.endsWith(`#${evidence.changedSymbol}`));
  const affected = store.board.nodes.find((n) => n.file === evidence.affectedFile);
  return [changed, affected].filter((n) => n !== undefined).map((n) => n.id);
}

function setNodeStatus(nodeIds: string[], status: NodeStatus): void {
  for (const node of store.board.nodes) {
    if (nodeIds.includes(node.id)) node.status = status;
  }
}

/**
 * Run the combined check of `overlay` against every teammate's in-progress work, and record any
 * new conflict (pausing both people). Shared by /edits (a saved edit) and /check (a proposed one).
 */
async function checkAndRecord(participant: string, overlay: Overlay): Promise<void> {
  // AUDIT: checks run concurrently if two edits land at once; fine for a 2-agent demo,
  // could create duplicate conflicts under load. Add a queue if that shows up (ticket 105).
  for (const other of store.overlays.values()) {
    if (other.participant === participant) continue;
    const result = await runCombinedCheck(DEMO_SHOP_DIR, overlay, other);
    for (const found of result.conflicts) {
      // Skip errors we've already raised, including DECIDED ones: after a decision the affected
      // agent still needs a few edits to fix its line, and the same error must not re-pause everyone.
      // AUDIT: if the agent's fix moves the line but keeps the same error, a new conflict appears.
      const alreadyRaised = store.board.conflicts.some(
        (c) => c.evidence.affectedFile === found.error.file && c.evidence.affectedLine === found.error.line && c.evidence.compilerError === found.error.raw,
      );
      if (alreadyRaised) continue;
      const evidence: Conflict["evidence"] = {
        changedBy: found.changedBy,
        changedSymbol: found.changedSymbol ?? "",
        diff: "", // TODO(Taylor): unified diff of the changed file vs base
        affectedFile: found.error.file,
        affectedLine: found.error.line,
        affectedCode: found.affectedCode,
        compilerError: found.error.raw,
      };
      // INTEGRATION(explain): replace with `await explainConflict(evidence, labels)`.
      // See docs/integration.md.
      const plain = isDemoConflict(evidence) ? DEMO_FALLBACK : genericFallback(evidence);
      const conflict: Conflict = {
        id: `c${store.board.conflicts.length + 1}`,
        kind: "semantic",
        between: [found.changedBy, found.affected],
        nodeIds: nodeIdsFor(evidence),
        evidence,
        ...plain,
      };
      store.board.conflicts.push(conflict);
      setNodeStatus(conflict.nodeIds, "conflict");
      setAgentStatus(found.changedBy, "paused");
      setAgentStatus(found.affected, "paused");
    }
    // TODO(Taylor): turn result.sameFile into "same_file" conflicts.
  }
}

/** The hooks treat this reply as data only. */
function pausedReply(participant: string) {
  const conflict = openConflictFor(participant);
  return { paused: Boolean(conflict), conflict: conflict ? { id: conflict.id, summary: conflict.plainSummary } : null };
}

/** Called by the PostToolUse hook after every edit: stores the saved files, then checks them. */
app.post("/edits", async (req, res) => {
  const { participant, files } = req.body as EditsRequest;
  const overlay = store.overlays.get(participant) ?? { participant, files: {} };
  for (const file of files) {
    overlay.files[file.path] = file.content;
  }
  store.overlays.set(participant, overlay);
  // INTEGRATION(drift): store.board.drift = detectDrift(intentsAsLists, editedFilesAsLists)
  // See docs/integration.md.
  if (store.board.agentStatus[participant] !== "paused") setAgentStatus(participant, "working");

  // TODO(Taylor): update node statuses/history from the overlay (needs the code map).
  await checkAndRecord(participant, overlay);
  broadcast();
  res.json(pausedReply(participant));
});

/**
 * Called by the PreToolUse hook BEFORE an edit lands (ticket 102). Checks the proposed files on
 * top of this person's earlier changes, without storing them: the edit hasn't happened yet, and
 * if it's denied it never will.
 */
app.post("/check", async (req, res) => {
  const { participant, files } = req.body as EditsRequest;
  const saved = store.overlays.get(participant)?.files ?? {};
  const proposed: Overlay = { participant, files: { ...saved } };
  for (const file of files) {
    proposed.files[file.path] = file.content;
  }
  const conflictsBefore = store.board.conflicts.length;
  await checkAndRecord(participant, proposed);
  if (store.board.conflicts.length !== conflictsBefore) broadcast();
  res.json(pausedReply(participant));
});

/** Called by the PreToolUse hook before every edit. */
app.get("/status", (req, res) => {
  const participant = String(req.query.participant ?? "");
  const open = openConflictFor(participant);
  const decided = unseenDecisionFor(participant);
  const response: StatusResponse = {
    status: store.board.agentStatus[participant] ?? "idle",
    ...(open ? { pausedBecause: `waiting on team decision about ${open.evidence.changedSymbol}(): ${open.plainSummary}` } : {}),
    ...(decided?.decision ? { unseenDecision: decided.decision.text } : {}),
  };
  if (decided) markDecisionSeen(participant, decided.id);
  res.json(response);
});

app.post("/intent", (req, res) => {
  const { participant, files } = req.body as IntentRequest;
  store.intents.set(participant, new Set(files));
  res.json({ ok: true });
});

app.post("/decision", (req, res) => {
  const { conflictId, optionId, decidedBy } = req.body as DecisionRequest;
  const conflict = store.board.conflicts.find((c) => c.id === conflictId);
  const option = conflict?.options.find((o) => o.id === optionId);
  if (!conflict || !option) {
    res.status(404).json({ error: "unknown conflict or option" });
    return;
  }
  conflict.decision = { optionId, decidedBy, text: option.label, at: new Date().toISOString() };
  conflict.between.forEach((participant) => setAgentStatus(participant, "resumed"));
  setNodeStatus(conflict.nodeIds, "resolved");
  broadcast();
  res.json({ ok: true });
});

app.post("/drift/resolve", (req, res) => {
  const { driftId, resolution } = req.body as DriftResolveRequest;
  const drift = store.board.drift.find((d) => d.id === driftId);
  if (!drift) {
    res.status(404).json({ error: "unknown drift" });
    return;
  }
  drift.resolved = resolution;
  broadcast();
  res.json({ ok: true });
});

app.post("/reset", (_req, res) => {
  resetStore();
  broadcast();
  res.json({ ok: true });
});

/** Rehearsal helper: push a sample scene to every board, e.g. {"scene": 3}. */
app.post("/demo/scene", (req, res) => {
  const scene = sampleScenes[Number(req.body?.scene)];
  if (!scene) {
    res.status(404).json({ error: "scene must be 0-8" });
    return;
  }
  store.board = structuredClone(scene.state);
  broadcast();
  res.json({ ok: true, title: scene.title });
});

