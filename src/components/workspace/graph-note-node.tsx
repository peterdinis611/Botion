"use client";

import { Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useEffect, useState } from "react";
import { GraphNodeHandles } from "@/components/workspace/graph-node-handles";
import type { GraphNodeData } from "@/lib/graph-flow";
import { cn } from "@/lib/utils";

function GraphNoteNodeComponent({ id, data, selected, isConnectable }: NodeProps) {
  const nodeData = data as GraphNodeData;
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? "Note");

  useEffect(() => {
    setLabel(nodeData.label ?? "Note");
  }, [nodeData.label]);

  const commit = useCallback(() => {
    const next = label.trim() || "Note";
    setEditing(false);
    updateNodeData(id, { label: next });
  }, [id, label, updateNodeData]);

  const bg = nodeData.color ?? "#fef9c3";

  return (
    <div
      className={cn(
        "relative min-w-[140px] max-w-[200px] rounded-sm border border-amber-200/80 px-3 py-2 shadow-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      style={{ backgroundColor: bg }}
    >
      <GraphNodeHandles isConnectable={isConnectable} accent="amber" />
      {editing ? (
        <textarea
          className="nodrag nopan w-full resize-none bg-transparent text-sm font-medium outline-none"
          rows={3}
          value={label}
          autoFocus
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commit}
        />
      ) : (
        <button
          type="button"
          className="nodrag nopan w-full whitespace-pre-wrap text-left text-sm font-medium"
          onDoubleClick={() => setEditing(true)}
        >
          {nodeData.label ?? "Note"}
        </button>
      )}
    </div>
  );
}

export const GraphNoteNode = memo(GraphNoteNodeComponent);
