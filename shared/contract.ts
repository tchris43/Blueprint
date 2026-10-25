// The shared contract between server, hooks and board.
// RULE: never change this file without telling the whole team first —
// the server, the web board and the Lucid extension all depend on these shapes.

export type ParticipantId = string; // "alice", "bob", "priya"

export type Participant = {
  id: ParticipantId;
  name: string;
  role: "dev" | "pm";
  color: string; // hex, used for borders and cursors on the board
  ticket?: string; // e.g. "SHOP-212"
};

export type NodeStatus =
  | "existing" // untouched code
  | "in_progress" // new code an agent is building
  | "changing" // existing code an agent is modifying
  | "conflict" // part of an open conflict
  | "resolved" // conflict decided, agents adjusting
  | "built" // finished, combined checks pass
  | "drift"; // changed but never announced in the agent's plan

export type HistoryEntry = { at: string; text: string; by?: ParticipantId };

export type MapNode = {
  id: string; // "account/user.ts#getUser" for a function, "account/AccountPage.ts" for a module
  file: string;
  symbol: string; // code view title, e.g. "getUser()"
  plainName: string; // product view title, from shared/labels.json
  plainDesc: string;
  column: string; // top-level folder, e.g. "account"
  x?: number;
  y?: number;
  status: NodeStatus;
  owner?: ParticipantId;
  isNew?: boolean; // created during this session (vs. existing code being changed)
  coverage?: number; // 0-100, optional layer
  history: HistoryEntry[];
};

export type MapEdge = { from: string; to: string; kind: "calls" | "imports" };

export type ConflictEvidence = {
  changedBy: ParticipantId;
  changedSymbol: string; // "getUser"
  diff: string; // the other participant's change, unified-diff style
  affectedFile: string;
  affectedLine: number;
  affectedCode: string;
  compilerError: string; // raw tsc line
};

export type ConflictOption = { id: string; label: string };

export type Decision = {
  optionId: string;
  decidedBy: ParticipantId;
  text: string; // the instruction sent to both agents
  at: string;
};

export type Conflict = {
  id: string;
  kind: "semantic" | "same_file"; // same_file = both edited one file, no type check needed
  between: [ParticipantId, ParticipantId];
  nodeIds: string[];
  evidence: ConflictEvidence;
  plainSummary: string; // for the PM: what clashed, no jargon
  question: string;
  options: ConflictOption[];
  decision?: Decision;
};

export type Drift = {
  id: string;
  participant: ParticipantId;
  file: string;
  nodeId?: string;
  reason: string; // "not in plan", "no tests"
  resolved?: "kept" | "removed";
};

export type AgentStatus = "idle" | "working" | "paused" | "resumed" | "done";

export type BoardState = {
  participants: Participant[];
  nodes: MapNode[];
  edges: MapEdge[];
  conflicts: Conflict[];
  drift: Drift[];
  agentStatus: Record<ParticipantId, AgentStatus>;
};

// ---- sample data (shared/sample-state.json) ----

export type SampleScene = {
  id: string; // "scene-0" … "scene-8"
  title: string;
  narration: string;
  state: BoardState;
};

export type SampleStateFile = { scenes: SampleScene[] };

// ---- plain-English labels (shared/labels.json, written by partner 3) ----

export type LabelsFile = {
  columns: Record<string, string>; // folder -> product-view heading
  nodes: Record<string, { plainName: string; plainDesc: string }>; // node id -> label
};

// ---- server API ----

/** POST /edits — sent by the PostToolUse hook after every edit. */
export type EditsRequest = {
  participant: ParticipantId;
  files: { path: string; content: string }[]; // path relative to demo-shop root
};

/** POST /intent — the files an agent says it will touch. Anything else is drift. */
export type IntentRequest = { participant: ParticipantId; files: string[] };

/** GET /status?participant=X — read by the PreToolUse hook before every edit. */
export type StatusResponse = {
  status: AgentStatus;
  pausedBecause?: string; // conflict summary when paused
  unseenDecision?: string; // decision text the agent hasn't been told yet
};

/** POST /decision */
export type DecisionRequest = { conflictId: string; optionId: string; decidedBy: ParticipantId };

/** POST /drift/resolve */
export type DriftResolveRequest = { driftId: string; resolution: "kept" | "removed" };

/** Every message on the /live websocket. */
export type LiveMessage = { type: "state"; state: BoardState };
