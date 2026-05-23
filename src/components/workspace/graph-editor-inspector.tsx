"use client";

import type { Edge, Node } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { GraphEdgeData, GraphNodeData } from "@/lib/graph-flow";
import { NODE_COLOR_PRESETS } from "@/lib/graph-flow";
import { cn } from "@/lib/utils";

export function GraphEditorInspector({
  description,
  onDescriptionChange,
  onDescriptionBlur,
  selectedNodes,
  selectedEdges,
  onUpdateNode,
  onUpdateEdge,
}: {
  description: string;
  onDescriptionChange: (v: string) => void;
  onDescriptionBlur: () => void;
  selectedNodes: Node[];
  selectedEdges: Edge[];
  onUpdateNode: (id: string, data: Partial<GraphNodeData>) => void;
  onUpdateEdge: (id: string, patch: Partial<Edge>) => void;
}) {
  const node = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const edge = selectedEdges.length === 1 ? selectedEdges[0] : null;
  const nodeData = (node?.data ?? {}) as GraphNodeData;
  const edgeData = (edge?.data ?? {}) as GraphEdgeData;

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Inspector
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <section className="space-y-2">
          <Label htmlFor="graph-description">Graph description</Label>
          <Textarea
            id="graph-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onBlur={onDescriptionBlur}
            placeholder="What is this diagram for?"
            rows={3}
            className="resize-none text-sm"
          />
        </section>

        <Separator />

        {node && (
          <section className="space-y-3">
            <p className="text-sm font-medium">Node</p>
            <div className="space-y-2">
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={nodeData.label ?? ""}
                onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Accent color</Label>
              <div className="flex flex-wrap gap-1.5">
                {NODE_COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "h-6 w-6 rounded-full border-2",
                      nodeData.color === c ? "border-foreground" : "border-transparent",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => onUpdateNode(node.id, { color: c })}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Type: {nodeData.kind ?? "default"}
            </p>
          </section>
        )}

        {edge && !node && (
          <section className="space-y-3">
            <p className="text-sm font-medium">Connection</p>
            <div className="space-y-2">
              <Label htmlFor="edge-label">Label</Label>
              <Input
                id="edge-label"
                value={(edge.label as string) ?? edgeData.label ?? ""}
                onChange={(e) => {
                  const label = e.target.value;
                  onUpdateEdge(edge.id, {
                    label,
                    data: { ...edgeData, label },
                  });
                }}
                placeholder="e.g. Yes, No"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(edge.animated)}
                onChange={(e) => onUpdateEdge(edge.id, { animated: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              Animated
            </label>
            <div className="space-y-2">
              <Label>Line style</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={edge.type ?? "smoothstep"}
                onChange={(e) => onUpdateEdge(edge.id, { type: e.target.value })}
              >
                <option value="smoothstep">Smooth step</option>
                <option value="default">Bezier</option>
                <option value="straight">Straight</option>
                <option value="step">Step</option>
              </select>
            </div>
          </section>
        )}

        {selectedNodes.length > 1 && (
          <p className="text-sm text-muted-foreground">
            {selectedNodes.length} nodes selected. Use toolbar to duplicate or delete.
          </p>
        )}

        {!node && !edge && selectedNodes.length <= 1 && selectedEdges.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Select a node or connection to edit its properties.
          </p>
        )}
      </div>
    </aside>
  );
}
