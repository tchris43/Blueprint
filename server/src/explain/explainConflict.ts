import type { Conflict, LabelsFile } from "../../../shared/contract";
import { callModel as realCallModel, type CallModel } from "./callModel";
import { DEMO_FALLBACK, genericFallback, isDemoConflict, type PlainQuestion } from "./fallbacks";

/**
 * Turns a compiler error into a plain-English decision for the team.
 *
 * The compiler says:  "checkout/order.ts(47,12): error TS2531: Object is possibly 'null'."
 * Priya (the PM) needs: "Saved cards assumes every buyer has an account… Can guests save cards?"
 *                       plus 2–3 options to pick from.
 *
 * Steps:
 * 1. If there is no ANTHROPIC_API_KEY, don't call Claude. Return the fallback (step 5).
 * 2. Write a prompt (the ticket owner's own wording) that includes the evidence:
 *    the compiler error, the line that broke, the symbol that changed, and the plain-English
 *    names from `labels` so the answer uses words a non-programmer knows.
 *    Ask Claude to reply with ONLY JSON shaped like PlainQuestion.
 * 3. Send it with `callModel(prompt)`. It returns Claude's reply as text.
 * 4. Parse the reply. Use it only if it has a plainSummary, a question, and 2 or 3 options
 *    that each have an id and a label (all non-empty strings).
 * 5. If anything goes wrong (no key, error, bad JSON, wrong shape), return the fallback:
 *    DEMO_FALLBACK for the demo conflict (isDemoConflict), genericFallback(evidence) otherwise.
 *
 * `callModel` is a parameter so the tests can pass a fake one. Real code leaves it out.
 */
export async function explainConflict(
  evidence: Conflict["evidence"],
  labels: LabelsFile,
  callModel: CallModel = realCallModel,
): Promise<PlainQuestion> {
  throw new Error("TODO: see README.md in this folder");
}

// These imports are here for you to use. (Delete this line when you use them.)
void DEMO_FALLBACK, genericFallback, isDemoConflict;
