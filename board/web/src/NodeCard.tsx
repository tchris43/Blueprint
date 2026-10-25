// Task 2 — see tasks/board/2-color-and-tag-nodes.md

import type { NodeCardData } from "./flow";

/**
 * One box on the map. Matches the boxes in docs/mockup/scene-4-collision.png.
 * - Root element has data-status={node.status} and a CSS class you style per status.
 * - A small tag line: "Existing code", "Building · Bob", "Conflict · decide", "Built", "Not in plan", …
 * - Code view: node.symbol + node.file.   Product view: node.plainName + node.plainDesc.
 * - Coverage layer: the tag becomes "88% tested" and the fill color comes from the percentage.
 */
export function NodeCard({ node, owner, view, layer, selected }: NodeCardData) {
  return null; // TODO: task 2
}
