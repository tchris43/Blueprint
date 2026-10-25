// Runtime checks (zod) that mirror contract.ts exactly.
// RULE: change this file only together with contract.ts, and tell the team.
// The type checks at the bottom fail to compile if the two drift apart.

import { z } from "zod";
import type { BoardState, LabelsFile, SampleStateFile } from "./contract";

export const ParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["dev", "pm"]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  ticket: z.string().optional(),
});

export const NodeStatusSchema = z.enum(["existing", "in_progress", "changing", "conflict", "resolved", "built", "drift"]);

export const HistoryEntrySchema = z.object({ at: z.string(), text: z.string(), by: z.string().optional() });

export const MapNodeSchema = z.object({
  id: z.string(),
  file: z.string(),
  symbol: z.string(),
  plainName: z.string(),
  plainDesc: z.string(),
  column: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  status: NodeStatusSchema,
  owner: z.string().optional(),
  isNew: z.boolean().optional(),
  coverage: z.number().min(0).max(100).optional(),
  history: z.array(HistoryEntrySchema),
});

export const MapEdgeSchema = z.object({ from: z.string(), to: z.string(), kind: z.enum(["calls", "imports"]) });

export const ConflictEvidenceSchema = z.object({
  changedBy: z.string(),
  changedSymbol: z.string(),
  diff: z.string(),
  affectedFile: z.string(),
  affectedLine: z.number().int().positive(),
  affectedCode: z.string(),
  compilerError: z.string(),
});

export const ConflictOptionSchema = z.object({ id: z.string(), label: z.string() });

export const DecisionSchema = z.object({ optionId: z.string(), decidedBy: z.string(), text: z.string(), at: z.string() });

export const ConflictSchema = z.object({
  id: z.string(),
  kind: z.enum(["semantic", "same_file"]),
  between: z.tuple([z.string(), z.string()]),
  nodeIds: z.array(z.string()),
  evidence: ConflictEvidenceSchema,
  plainSummary: z.string(),
  question: z.string(),
  options: z.array(ConflictOptionSchema).min(2).max(3),
  decision: DecisionSchema.optional(),
});

export const DriftSchema = z.object({
  id: z.string(),
  participant: z.string(),
  file: z.string(),
  nodeId: z.string().optional(),
  reason: z.string(),
  resolved: z.enum(["kept", "removed"]).optional(),
});

export const AgentStatusSchema = z.enum(["idle", "working", "paused", "resumed", "done"]);

export const BoardStateSchema = z.object({
  participants: z.array(ParticipantSchema),
  nodes: z.array(MapNodeSchema),
  edges: z.array(MapEdgeSchema),
  conflicts: z.array(ConflictSchema),
  drift: z.array(DriftSchema),
  agentStatus: z.record(z.string(), AgentStatusSchema),
});

export const SampleStateFileSchema = z.object({
  scenes: z.array(z.object({ id: z.string(), title: z.string(), narration: z.string(), state: BoardStateSchema })),
});

export const LabelsFileSchema = z.object({
  columns: z.record(z.string(), z.string()),
  nodes: z.record(z.string(), z.object({ plainName: z.string(), plainDesc: z.string() })),
});

// ---- compile-time check: schema and contract must describe the same shapes ----
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const boardStateMatches: Same<z.infer<typeof BoardStateSchema>, BoardState> = true;
const sampleMatches: Same<z.infer<typeof SampleStateFileSchema>, SampleStateFile> = true;
const labelsMatch: Same<z.infer<typeof LabelsFileSchema>, LabelsFile> = true;
void boardStateMatches;
void sampleMatches;
void labelsMatch;
