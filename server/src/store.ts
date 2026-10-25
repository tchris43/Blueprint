// All server state lives in memory. Restarting the server (or POST /reset) clears it.

import { readFileSync } from "node:fs";
import type { AgentStatus, BoardState, Conflict, SampleStateFile } from "../../shared/contract";
import { SAMPLE_STATE_PATH } from "./config";
import type { Overlay } from "./combinedCheck";

export const sampleScenes = (JSON.parse(readFileSync(SAMPLE_STATE_PATH, "utf8")) as SampleStateFile).scenes;

type Store = {
  board: BoardState;
  overlays: Map<string, Overlay>; // participant -> their changed files
  intents: Map<string, Set<string>>; // participant -> files they said they'd touch
  decisionsSeen: Map<string, Set<string>>; // participant -> conflict ids whose decision they've been told
};

function freshBoard(): BoardState {
  // AUDIT: starts from sample scene-0 until the ts-morph code map exists (TODO: codeMap.ts).
  // INTEGRATION(coverage): once the code map builds nodes, fill node.coverage from
  // mapCoverage(summary, nodes). See docs/integration.md.
  return structuredClone(sampleScenes[0].state);
}

export const store: Store = {
  board: freshBoard(),
  overlays: new Map(),
  intents: new Map(),
  decisionsSeen: new Map(),
};

export function resetStore(): void {
  store.board = freshBoard();
  store.overlays.clear();
  store.intents.clear();
  store.decisionsSeen.clear();
}

export function setAgentStatus(participant: string, status: AgentStatus): void {
  store.board.agentStatus[participant] = status;
}

export function openConflictFor(participant: string): Conflict | undefined {
  return store.board.conflicts.find((c) => !c.decision && c.between.includes(participant));
}

/** A decided conflict involving this participant that they haven't been told about yet. */
export function unseenDecisionFor(participant: string): Conflict | undefined {
  const seen = store.decisionsSeen.get(participant) ?? new Set();
  return store.board.conflicts.find((c) => c.decision && c.between.includes(participant) && !seen.has(c.id));
}

export function markDecisionSeen(participant: string, conflictId: string): void {
  if (!store.decisionsSeen.has(participant)) store.decisionsSeen.set(participant, new Set());
  store.decisionsSeen.get(participant)!.add(conflictId);
}
