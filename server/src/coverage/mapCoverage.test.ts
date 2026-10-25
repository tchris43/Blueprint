// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.
// Run only these tests:  pnpm test:coverage

import { describe, expect, it } from "vitest";
import type { MapNode } from "../../../shared/contract";
import summary from "./fixtures/coverage-summary.json";
import { mapCoverage, type IstanbulSummary } from "./mapCoverage";

/** A minimal map box for testing. Only `id` and `file` matter here. */
function node(id: string): MapNode {
  return { id, file: id.split("#")[0], symbol: id, plainName: "", plainDesc: "", column: "", status: "existing", history: [] };
}

const report = summary as IstanbulSummary;

describe("mapCoverage", () => {
  it("returns an empty object when there are no nodes", () => {
    expect(mapCoverage(report, [])).toEqual({});
  });

  it("uses the lines percentage for a matching file", () => {
    expect(mapCoverage(report, [node("payments/charge.ts#chargeCard")])).toEqual({ "payments/charge.ts#chargeCard": 95 });
  });

  it("rounds to a whole number", () => {
    // user.ts is 87.5% → 88, order.ts is 90.9% → 91
    const result = mapCoverage(report, [node("account/user.ts#getUser"), node("checkout/order.ts#placeOrder")]);
    expect(result).toEqual({ "account/user.ts#getUser": 88, "checkout/order.ts#placeOrder": 91 });
  });

  it("works for module nodes (a whole file, no #symbol)", () => {
    expect(mapCoverage(report, [node("account/AccountPage.ts")])).toEqual({ "account/AccountPage.ts": 40 });
  });

  it("gives two nodes in the same file the same number", () => {
    const result = mapCoverage(report, [node("checkout/order.ts#placeOrder"), node("checkout/order.ts#cartTotalCents")]);
    expect(result["checkout/order.ts#placeOrder"]).toBe(91);
    expect(result["checkout/order.ts#cartTotalCents"]).toBe(91);
  });

  it("gives 0 to a file that is not in the report (the demo's untested cardCache.ts)", () => {
    expect(mapCoverage(report, [node("payments/cardCache.ts")])).toEqual({ "payments/cardCache.ts": 0 });
  });

  it("does not match a file that only ends with the same letters", () => {
    // "user.ts" must not match "account/user.ts" unless it's the whole path segment
    const lookalike: IstanbulSummary = { "/repo/superuser.ts": report["/home/alice/demo-shop/account/user.ts"] };
    expect(mapCoverage(lookalike, [node("user.ts")])).toEqual({ "user.ts": 0 });
  });

  // Edge case
  it("handles Windows paths with backslashes", () => {
    const windows: IstanbulSummary = {
      "C:\\Users\\alice\\demo-shop\\account\\user.ts": report["/home/alice/demo-shop/account/user.ts"],
    };
    expect(mapCoverage(windows, [node("account/user.ts#getUser")])).toEqual({ "account/user.ts#getUser": 88 });
  });
});
