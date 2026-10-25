// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.
// Run only these tests:  pnpm test:explain
// These tests never call the real Claude API. They pass in a fake `callModel` instead.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Conflict, LabelsFile } from "../../../shared/contract";
import { explainConflict } from "./explainConflict";
import { DEMO_FALLBACK, genericFallback } from "./fallbacks";

const demoEvidence: Conflict["evidence"] = {
  changedBy: "bob",
  changedSymbol: "getUser",
  diff: "-export function getUser(): User {\n+export function getUser(): User | null {",
  affectedFile: "checkout/order.ts",
  affectedLine: 47,
  affectedCode: "saveCard(getUser().id, card);",
  compilerError: "checkout/order.ts(47,12): error TS2531: Object is possibly 'null'.",
};

const otherEvidence: Conflict["evidence"] = {
  ...demoEvidence,
  changedSymbol: "chargeCard",
  affectedFile: "checkout/CheckoutPage.ts",
  compilerError: "checkout/CheckoutPage.ts(20,5): error TS2554: Expected 3 arguments, but got 2.",
};

const labels: LabelsFile = {
  columns: { checkout: "Buying", account: "Your account" },
  nodes: {
    "account/user.ts#getUser": { plainName: "Who's buying", plainDesc: "Looks up the signed-in buyer" },
    "checkout/order.ts#placeOrder": { plainName: "Place the order", plainDesc: "Turns a cart into an order" },
  },
};

const goodAnswer = {
  plainSummary: "Saving cards needs an account, but guests don't have one.",
  question: "Should guests be able to save a card?",
  options: [
    { id: "no", label: "No, ask them to sign up" },
    { id: "yes", label: "Yes, use their email" },
  ],
};

describe("explainConflict", () => {
  beforeEach(() => vi.stubEnv("ANTHROPIC_API_KEY", "test-key"));
  afterEach(() => vi.unstubAllEnvs());

  it("returns the demo fallback without calling Claude when there is no API key", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const fakeCall = vi.fn();

    const result = await explainConflict(demoEvidence, labels, fakeCall);

    expect(result).toEqual(DEMO_FALLBACK);
    expect(fakeCall).not.toHaveBeenCalled();
  });

  it("returns Claude's answer when it is valid JSON of the right shape", async () => {
    const fakeCall = vi.fn().mockResolvedValue(JSON.stringify(goodAnswer));
    expect(await explainConflict(demoEvidence, labels, fakeCall)).toEqual(goodAnswer);
  });

  it("puts the evidence in the prompt: the error, the broken line and the plain-English name", async () => {
    const fakeCall = vi.fn().mockResolvedValue(JSON.stringify(goodAnswer));

    await explainConflict(demoEvidence, labels, fakeCall);

    const prompt: string = fakeCall.mock.calls[0][0];
    expect(prompt).toContain("TS2531");
    expect(prompt).toContain("saveCard(getUser().id, card);");
    expect(prompt).toContain("Who's buying");
  });

  it("returns the demo fallback when the call fails", async () => {
    const fakeCall = vi.fn().mockRejectedValue(new Error("network down"));
    expect(await explainConflict(demoEvidence, labels, fakeCall)).toEqual(DEMO_FALLBACK);
  });

  it("returns the demo fallback when Claude's reply is not JSON", async () => {
    const fakeCall = vi.fn().mockResolvedValue("Sure! Here's what happened: ...");
    expect(await explainConflict(demoEvidence, labels, fakeCall)).toEqual(DEMO_FALLBACK);
  });

  it("returns the demo fallback when there are too few or too many options", async () => {
    const one = { ...goodAnswer, options: [goodAnswer.options[0]] };
    const four = { ...goodAnswer, options: [...goodAnswer.options, ...goodAnswer.options] };
    expect(await explainConflict(demoEvidence, labels, vi.fn().mockResolvedValue(JSON.stringify(one)))).toEqual(DEMO_FALLBACK);
    expect(await explainConflict(demoEvidence, labels, vi.fn().mockResolvedValue(JSON.stringify(four)))).toEqual(DEMO_FALLBACK);
  });

  it("returns the demo fallback when a field is missing", async () => {
    const { question: _dropped, ...noQuestion } = goodAnswer;
    expect(await explainConflict(demoEvidence, labels, vi.fn().mockResolvedValue(JSON.stringify(noQuestion)))).toEqual(DEMO_FALLBACK);
  });

  it("uses the generic fallback for a conflict that isn't the demo one", async () => {
    const fakeCall = vi.fn().mockRejectedValue(new Error("network down"));
    expect(await explainConflict(otherEvidence, labels, fakeCall)).toEqual(genericFallback(otherEvidence));
  });

  // Edge case: models often wrap JSON in a markdown code block.
  it("still understands JSON wrapped in a ```json code block", async () => {
    const wrapped = "```json\n" + JSON.stringify(goodAnswer) + "\n```";
    const fakeCall = vi.fn().mockResolvedValue(wrapped);
    expect(await explainConflict(demoEvidence, labels, fakeCall)).toEqual(goodAnswer);
  });
});
