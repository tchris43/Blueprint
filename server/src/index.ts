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
  StatusResponse,
} from "../../shared/contract";
import { runCombinedCheck } from "./combinedCheck";
import { DEMO_SHOP_DIR, PORT } from "./config";
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

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use((_req, res, next) => {
  // The board runs on another port (Vite / Lucid panel), so allow cross-origin reads.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ---- live board updates ----

const server = createServer(app);
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

/** Called by the PostToolUse hook after every edit. */
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
  // AUDIT: checks run concurrently if two edits land at once; fine for a 2-agent demo,
  // could create duplicate conflicts under load. Add a queue if that shows up.
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
        nodeIds: [], // TODO(Taylor): map changedSymbol + affected file/line to node ids
        evidence,
        ...plain,
      };
      store.board.conflicts.push(conflict);
      setAgentStatus(found.changedBy, "paused");
      setAgentStatus(found.affected, "paused");
    }
    // TODO(Taylor): turn result.sameFile into "same_file" conflicts.
  }

  broadcast();
  // The hook treats this reply as data only.
  const conflict = openConflictFor(participant);
  res.json({ paused: Boolean(conflict), conflict: conflict ? { id: conflict.id, summary: conflict.plainSummary } : null });
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

server.listen(PORT, () => {
  console.log(`Blueprint server on http://localhost:${PORT}  (ws://localhost:${PORT}/live)`);
  console.log(`Checking against demo-shop at ${DEMO_SHOP_DIR}`);
});
