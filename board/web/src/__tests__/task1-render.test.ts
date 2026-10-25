// Task 1 — tasks/board/1-render-nodes-and-edges.md
// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.   Run: pnpm test:board

import { describe, expect, it } from "vitest";
import type { BoardState, MapNode } from "../../../../shared/contract";
import { COLUMN_WIDTH, ROW_HEIGHT, toFlowEdges, toFlowNodes } from "../flow";
import { sceneState } from "../sampleData";

describe("toFlowNodes", () => {
  it("makes one flow node per map node (scene 1 has 6)", () => {
    const nodes = toFlowNodes(sceneState(1), "code", "plans", null);
    expect(nodes.map((n) => n.id)).toEqual(sceneState(1).nodes.map((n) => n.id));
  });

  it("uses the x and y from the data when they are given", () => {
    const state = sceneState(4);
    const getUser = state.nodes.find((n) => n.id === "account/user.ts#getUser")!;
    const flow = toFlowNodes(state, "code", "plans", null).find((n) => n.id === getUser.id)!;
    expect(flow.position).toEqual({ x: getUser.x, y: getUser.y });
  });

  it("passes the map node, view and layer through as data, and uses the 'board' node type", () => {
    const [first] = toFlowNodes(sceneState(1), "product", "coverage", null);
    expect(first.type).toBe("board");
    expect(first.data.node.id).toBe(sceneState(1).nodes[0].id);
    expect(first.data.view).toBe("product");
    expect(first.data.layer).toBe("coverage");
  });

  it("marks only the selected node as selected", () => {
    const nodes = toFlowNodes(sceneState(9), "code", "plans", "account/user.ts#getUser");
    expect(nodes.filter((n) => n.data.selected).map((n) => n.id)).toEqual(["account/user.ts#getUser"]);
  });

  // Edge case: the live server may send nodes without x/y.
  it("lays out nodes without x/y in one column per folder, stacked top to bottom", () => {
    const bare = (id: string, column: string): MapNode => ({
      id, file: id, symbol: id, plainName: id, plainDesc: "", column, status: "existing", history: [],
    });
    const state: BoardState = {
      ...sceneState(1),
      nodes: [bare("checkout/a.ts", "checkout"), bare("account/b.ts", "account"), bare("checkout/c.ts", "checkout")],
      edges: [],
    };
    const positions = Object.fromEntries(toFlowNodes(state, "code", "plans", null).map((n) => [n.id, n.position]));
    expect(positions).toEqual({
      "checkout/a.ts": { x: 0, y: 0 },
      "account/b.ts": { x: COLUMN_WIDTH, y: 0 },
      "checkout/c.ts": { x: 0, y: ROW_HEIGHT },
    });
  });
});

describe("toFlowEdges", () => {
  it("makes one flow edge per map edge, from source to target", () => {
    const state = sceneState(2);
    const edges = toFlowEdges(state);
    expect(edges.map((e) => [e.source, e.target])).toEqual(state.edges.map((e) => [e.from, e.to]));
  });

  it("animates the edge between the two conflicting boxes in scene 4", () => {
    const hot = toFlowEdges(sceneState(4)).filter((e) => e.animated);
    expect(hot.map((e) => [e.source, e.target])).toEqual([["checkout/order.ts#placeOrder", "account/user.ts#getUser"]]);
  });

  it("stops animating once the conflict is decided (scene 6)", () => {
    expect(toFlowEdges(sceneState(6)).some((e) => e.animated)).toBe(false);
  });
});
