// Task 5 — see tasks/board/5-decision-buttons.md

export const SERVER = "http://localhost:4000";

/** POST /decision with body { conflictId, optionId, decidedBy } (DecisionRequest in shared/contract.ts). */
export async function postDecision(conflictId: string, optionId: string, decidedBy: string): Promise<void> {
  throw new Error("TODO: task 5");
}
