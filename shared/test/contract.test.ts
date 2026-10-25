// pnpm check:contract — if anyone's code or data breaks the contract, this fails, not the demo.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BoardStateSchema, LabelsFileSchema, SampleStateFileSchema } from "../schema";

const shared = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (name: string) => JSON.parse(readFileSync(join(shared, name), "utf8"));

const sample = readJson("sample-state.json");

describe("sample-state.json", () => {
  it("has all 9 demo scenes, scene-0 to scene-8", () => {
    const parsed = SampleStateFileSchema.parse(sample);
    expect(parsed.scenes.map((s) => s.id)).toEqual(Array.from({ length: 9 }, (_, i) => `scene-${i}`));
  });

  for (const scene of sample.scenes as { id: string; state: unknown }[]) {
    it(`${scene.id} is a valid BoardState`, () => {
      const result = BoardStateSchema.safeParse(scene.state);
      expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
    });
  }

  it("every edge and conflict points at nodes that exist in that scene", () => {
    for (const scene of sample.scenes) {
      const ids = new Set(scene.state.nodes.map((n: { id: string }) => n.id));
      for (const edge of scene.state.edges) {
        expect(ids.has(edge.from) && ids.has(edge.to), `${scene.id}: ${edge.from} -> ${edge.to}`).toBe(true);
      }
      for (const conflict of scene.state.conflicts) {
        for (const nodeId of conflict.nodeIds) expect(ids.has(nodeId), `${scene.id}: ${nodeId}`).toBe(true);
      }
    }
  });
});

describe("labels.json", () => {
  it("has the right shape", () => {
    const result = LabelsFileSchema.safeParse(readJson("labels.json"));
    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
  });
});
