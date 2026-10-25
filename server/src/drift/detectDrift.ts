import type { Drift } from "../../../shared/contract";

/**
 * Finds "drift": files an agent edited that it never said it would touch.
 *
 * Before it starts, each agent announces the files it plans to edit (its "intent").
 * Any file it edits that is NOT on its own list is drift.
 *
 * Rules:
 * - A participant who never announced a plan has no drift (there is nothing to compare to).
 * - The same file edited twice is reported once.
 * - Results are in the order of `edits`: participant by participant, file by file.
 * - Ids are "d1", "d2", "d3"… in that order.
 * - `reason` is a short human sentence, e.g. "Not in alice's plan".
 *
 * Example:
 *   detectDrift(
 *     { alice: ["payments/vault.ts", "checkout/order.ts"] },
 *     { alice: ["payments/vault.ts", "payments/cardCache.ts"] },
 *   )
 *   → [{ id: "d1", participant: "alice", file: "payments/cardCache.ts", reason: "Not in alice's plan" }]
 */
export function detectDrift(intents: Record<string, string[]>, edits: Record<string, string[]>): Drift[] {
  throw new Error("TODO: see README.md in this folder");
}
