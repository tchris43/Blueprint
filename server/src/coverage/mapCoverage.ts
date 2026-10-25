import type { MapNode } from "../../../shared/contract";

/** One number group in a coverage report, e.g. how many lines were run by tests. */
export type CoverageMetric = { total: number; covered: number; skipped: number; pct: number };

export type FileCoverage = {
  lines: CoverageMetric;
  statements: CoverageMetric;
  functions: CoverageMetric;
  branches: CoverageMetric;
};

/**
 * The shape of vitest's `coverage/coverage-summary.json`.
 * Keys are "total" plus one ABSOLUTE file path per source file, e.g.
 * "C:\\Users\\alice\\demo-shop\\account\\user.ts" or "/home/bob/demo-shop/account/user.ts".
 * See fixtures/coverage-summary.json for a real-looking example.
 */
export type IstanbulSummary = Record<string, FileCoverage>;

/**
 * Turns a coverage report into a "% tested" number for each box on the map.
 *
 * Rules:
 * - Match a node to a report entry by file: the report key ENDS WITH "/" + node.file.
 *   Windows keys use backslashes, so treat "\" and "/" as the same.
 * - Use the LINES percentage (`lines.pct`), rounded to a whole number.
 * - Several nodes can share one file (two functions in order.ts): they get the same number.
 * - A node whose file is not in the report gets 0 (no test ever loaded it).
 * - Ignore the "total" entry.
 *
 * Example:
 *   mapCoverage(
 *     { "/repo/account/user.ts": { lines: { pct: 87.5, ... }, ... } },
 *     [{ id: "account/user.ts#getUser", file: "account/user.ts", ... }],
 *   )
 *   → { "account/user.ts#getUser": 88 }
 */
export function mapCoverage(coverageJson: IstanbulSummary, nodes: MapNode[]): Record<string, number> {
  throw new Error("TODO: partner 3 writes this. See README.md in this folder.");
}
