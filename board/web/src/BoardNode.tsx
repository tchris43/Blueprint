// Glue between React Flow and NodeCard. You shouldn't need to change this.
// Register it with <ReactFlow nodeTypes={{ board: BoardNode }} … /> in task 1.

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { BoardFlowNode } from "./flow";
import { NodeCard } from "./NodeCard";

export function BoardNode({ data }: NodeProps<BoardFlowNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeCard {...data} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
