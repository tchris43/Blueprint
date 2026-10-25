// Task 1 — see tasks/board/1-render-nodes-and-edges.md

import type { Edge, Node } from "@xyflow/react";
import type { BoardState, MapNode, Participant } from "../../../shared/contract";
import type { Layer, View } from "./sampleData";

export const COLUMN_WIDTH = 240;
export const ROW_HEIGHT = 110;

/** Everything one box on the map needs to draw itself. */
export type NodeCardData = { node: MapNode; owner?: Participant; view: View; layer: Layer; selected: boolean };
export type BoardFlowNode = Node<NodeCardData, "board">;

/**
 * Turns the map's nodes into React Flow nodes.
 * - id: the map node's id. type: "board".
 * - position: the node's x/y. If it has none, x = (its column's index) * COLUMN_WIDTH and
 *   y = (how many nodes came before it in that column) * ROW_HEIGHT. Columns are numbered in
 *   the order they first appear.
 * - data: { node, owner (the Participant whose id is node.owner), view, layer, selected }.
 */
export function toFlowNodes(state: BoardState, view: View, layer: Layer, selectedId: string | null): BoardFlowNode[] {
  throw new Error("TODO: task 1");
}

/**
 * Turns the map's edges into React Flow edges: id `${from}->${to}`, source = from, target = to.
 * An edge whose BOTH ends are in an undecided conflict's nodeIds is "hot": set animated: true.
 */
export function toFlowEdges(state: BoardState): Edge[] {
  throw new Error("TODO: task 1");
}
