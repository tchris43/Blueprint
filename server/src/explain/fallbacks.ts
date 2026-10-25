// Answers to use when Claude can't be reached. Written for you; you don't need to change them.

import type { Conflict } from "../../../shared/contract";

export type PlainQuestion = Pick<Conflict, "plainSummary" | "question" | "options">;

/** The hard-coded answer for the demo's getUser() conflict. Matches the mockup, scene 4. */
export const DEMO_FALLBACK: PlainQuestion = {
  plainSummary:
    "Saved cards assumes every buyer has an account. Guest checkout removes that. Neither agent can settle this alone.",
  question: "Can guests save cards?",
  options: [
    { id: "signup", label: "No — offer guests \"Create an account to save your card\"" },
    { id: "email", label: "Yes — save it against a verified email" },
  ],
};

/** A plain but safe answer for any other conflict. */
export function genericFallback(evidence: Conflict["evidence"]): PlainQuestion {
  const symbol = evidence.changedSymbol || "shared code";
  return {
    plainSummary: `A change to ${symbol} breaks someone else's work in ${evidence.affectedFile}.`,
    question: `How should ${symbol} behave?`,
    options: [
      { id: "keep", label: `Keep the new ${symbol}; the other code adapts` },
      { id: "revert", label: `Undo the change to ${symbol}` },
    ],
  };
}

/** The demo conflict is the one where getUser() changed. */
export function isDemoConflict(evidence: Conflict["evidence"]): boolean {
  return evidence.changedSymbol === "getUser";
}
