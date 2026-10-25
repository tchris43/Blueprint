// Task 4 — see tasks/board/4-conflict-card.md

import type { Conflict, Participant } from "../../../shared/contract";
import type { View } from "./sampleData";

/**
 * The red card under the map in docs/mockup/scene-4-collision.png.
 * - Product view: conflict.plainSummary. Code view: a short technical line (who changed what).
 * - conflict.question, then one <button> per option (its text is option.label); clicking calls onDecide(option.id).
 * - Once conflict.decision exists: show who decided and decision.text, and NO option buttons.
 * - A <details> with <summary>Why was this flagged?</summary> containing the diff,
 *   the affected line (evidence.affectedCode) and the compiler error (evidence.compilerError).
 */
export function ConflictCard(props: {
  conflict: Conflict;
  view: View;
  participants: Participant[];
  onDecide: (optionId: string) => void;
}) {
  return null; // TODO: task 4
}
