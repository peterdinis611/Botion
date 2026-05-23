"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { GraphNodeData } from "@/lib/graph-flow";
import { cn } from "@/lib/utils";

function GraphNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as GraphNodeData;
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? "Node");

  useEffect(() => {
    setLabel(nodeData.label ?? "Node");
  }, [nodeData.label]);

  const commit = useCallback(() => {
    const next = label.trim() || "Node";
    setEditing(false);
    updateNodeData(id, { label: next });
  }, [id, label, updateNodeData]);

  const borderColor = nodeData.color ?? undefined;

  return (
    <div
      className={cn(
        "min-w-[120px] rounded-lg border-2 bg-card px-3 py-2 shadow-sm",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        !borderColor && "border-border",
      )}
      style={borderColor ? { borderColor, backgroundColor: `${borderColor}18` } : undefined}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      {editing ? (
        <input
          className="w-full bg-transparent text-sm font-medium outline-none"
          value={label}
          autoFocus
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setLabel(nodeData.label ?? "Node");
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="w-full text-left text-sm font-medium"
          onDoubleClick={() => setEditing(true)}
          title="Double-click to rename"
        >
          {nodeData.label ?? "Node"}
        </button>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-primary" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-primary" />
    </div>
  );
}

export const GraphFlowNode = memo(GraphNodeComponent);
