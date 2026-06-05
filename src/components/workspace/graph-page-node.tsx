"use client";

import { type NodeProps } from "@xyflow/react";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { GraphNodeHandles } from "@/components/workspace/graph-node-handles";
import type { GraphNodeData } from "@/lib/graph-flow";
import { asRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

function GraphPageNodeComponent({ data, selected, isConnectable }: NodeProps) {
  const nodeData = data as GraphNodeData;
  const title = nodeData.label?.trim() || "Untitled";
  const href = nodeData.noteId ? `/workspace/notes/${nodeData.noteId}` : undefined;
  const bg = nodeData.color ?? "#e8f5f3";

  return (
    <div
      className={cn(
        "relative min-w-[160px] max-w-[220px] rounded-lg border border-primary/25 px-3 py-2.5 shadow-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      style={{ backgroundColor: bg }}
    >
      <GraphNodeHandles isConnectable={isConnectable} />

      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Workspace page
          </p>
        </div>
      </div>

      {href && (
        <Link
          href={asRoute(href)}
          className="nodrag nopan mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open page
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

export const GraphPageNode = memo(GraphPageNodeComponent);
