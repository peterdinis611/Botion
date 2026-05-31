"use client";

import { type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useEffect, useState } from "react";
import { GraphNodeHandles } from "@/components/workspace/graph-node-handles";
import type { GraphNodeData } from "@/lib/graph-flow";
import { cn } from "@/lib/utils";

function GraphDecisionNodeComponent({ id, data, selected, isConnectable }: NodeProps) {
  const nodeData = data as GraphNodeData;
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? "Decision?");

  useEffect(() => {
    setLabel(nodeData.label ?? "Decision?");
  }, [nodeData.label]);

  const commit = useCallback(() => {
    const next = label.trim() || "Decision?";
    setEditing(false);
    updateNodeData(id, { label: next });
  }, [id, label, updateNodeData]);

  const accent = nodeData.color ?? "#f59e0b";

  return (
    <div className="relative flex h-[100px] w-[100px] items-center justify-center">
      <GraphNodeHandles isConnectable={isConnectable} />
      <div
        className={cn(
          "absolute inset-2 rotate-45 rounded-md border-2 shadow-sm",
          selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
        style={{
          borderColor: accent,
          backgroundColor: `${accent}22`,
        }}
      />
      <div className="relative z-10 max-w-[72px] text-center">
        {editing ? (
          <input
            className="nodrag nopan w-full bg-transparent text-center text-xs font-semibold outline-none"
            value={label}
            autoFocus
            onChange={(e) => setLabel(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <button
            type="button"
            className="nodrag nopan text-xs font-semibold leading-tight"
            onDoubleClick={() => setEditing(true)}
          >
            {nodeData.label ?? "Decision?"}
          </button>
        )}
      </div>
    </div>
  );
}

export const GraphDecisionNode = memo(GraphDecisionNodeComponent);
