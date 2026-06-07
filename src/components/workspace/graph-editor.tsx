"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionMode,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
  type Viewport,
} from "@xyflow/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHotkey, formatForDisplay } from "@tanstack/react-hotkeys";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GraphDecisionNode } from "@/components/workspace/graph-decision-node";
import { GraphEditorInspector } from "@/components/workspace/graph-editor-inspector";
import { GraphEditorToolbar } from "@/components/workspace/graph-editor-toolbar";
import { GraphFlowNode } from "@/components/workspace/graph-node";
import { GraphNoteNode } from "@/components/workspace/graph-note-node";
import { GraphPageNode } from "@/components/workspace/graph-page-node";
import { GraphPagePickerDialog } from "@/components/workspace/graph-page-picker-dialog";
import {
  GRAPH_QUERY,
  GRAPHS_QUERY,
  REMOVE_GRAPH_MUTATION,
  UPDATE_GRAPH_MUTATION,
} from "@/graphql/operations";
import type { GraphQueryResult, UpdateGraphResult } from "@/graphql/types";
import {
  buildExportPayload,
  cloneTemplateWithEdges,
  createNode,
  createWorkspacePageNode,
  duplicateNodes,
  GRAPH_DECISION_TYPE,
  GRAPH_NODE_TYPE,
  GRAPH_NOTE_TYPE,
  GRAPH_PAGE_TYPE,
  type GraphNodeData,
  type GraphNodeKind,
  type GraphTemplateId,
  parseFlowEdges,
  parseFlowNodes,
  parseFlowViewport,
  parseImportPayload,
  serializeFlow,
} from "@/lib/graph-flow";
import { getGraphQLErrorMessage } from "@/lib/graphql-error";
import { toastSaveError, toastSaveSuccess } from "@/lib/save-toast";

const nodeTypes = {
  [GRAPH_NODE_TYPE]: GraphFlowNode,
  [GRAPH_DECISION_TYPE]: GraphDecisionNode,
  [GRAPH_NOTE_TYPE]: GraphNoteNode,
  [GRAPH_PAGE_TYPE]: GraphPageNode,
};

function GraphEditorCanvas({
  graphId,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  saveVersion,
}: {
  graphId: string;
  title: string;
  description: string;
  onTitleChange: (t: string) => void;
  onDescriptionChange: (d: string) => void;
  saveVersion: number;
}) {
  const { data } = useQuery<GraphQueryResult>(GRAPH_QUERY, {
    variables: { id: graphId },
  });
  const graph = data?.graph;

  const [updateGraph] = useMutation<UpdateGraphResult>(UPDATE_GRAPH_MUTATION);

  const initialNodes = useMemo(
    () => (graph ? parseFlowNodes(graph.nodesJson) : []),
    [graph],
  );
  const initialEdges = useMemo(
    () => (graph ? parseFlowEdges(graph.edgesJson) : []),
    [graph],
  );
  const initialViewport = useMemo(
    () => parseFlowViewport(graph?.viewportJson),
    [graph?.viewportJson],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [pagePickerOpen, setPagePickerOpen] = useState(false);

  const hydratedGraphId = useRef<string | null>(null);
  const localEdits = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveGeneration = useRef(0);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const viewportRef = useRef(viewport);
  const titleRef = useRef(title);
  const descriptionRef = useRef(description);
  nodesRef.current = nodes;
  edgesRef.current = edges;
  viewportRef.current = viewport;
  titleRef.current = title;
  descriptionRef.current = description;

  const { fitView, zoomIn, zoomOut, deleteElements, screenToFlowPosition } = useReactFlow();

  useOnSelectionChange({
    onChange: ({ nodes: n, edges: e }) => {
      setSelectedNodes(n);
      setSelectedEdges(e);
    },
  });

  useEffect(() => {
    if (hydratedGraphId.current === graphId) return;
    hydratedGraphId.current = null;
    localEdits.current = 0;
    setNodes([]);
    setEdges([]);
    setViewport(undefined);
  }, [graphId, setNodes, setEdges]);

  useEffect(() => {
    if (!graph || hydratedGraphId.current === graphId) return;
    const fromServer = parseFlowNodes(graph.nodesJson);
    const fromServerEdges = parseFlowEdges(graph.edgesJson);
    const fromServerViewport = parseFlowViewport(graph.viewportJson);

    setNodes((current) => {
      if (current.length === 0) return fromServer;
      const serverIds = new Set(fromServer.map((n) => n.id));
      const localOnly = current.filter((n) => !serverIds.has(n.id));
      return [...fromServer, ...localOnly];
    });
    setEdges((current) => {
      if (current.length === 0) return fromServerEdges;
      const serverIds = new Set(fromServerEdges.map((e) => e.id));
      const localOnly = current.filter((e) => !serverIds.has(e.id));
      return [...fromServerEdges, ...localOnly];
    });
    setViewport(fromServerViewport);
    hydratedGraphId.current = graphId;
  }, [graph, graphId, setNodes, setEdges]);

  const saveNow = useCallback(async () => {
    if (!graph) return;
    const generation = ++saveGeneration.current;
    setSaveState("saving");
    try {
      const payload = serializeFlow(
        nodesRef.current,
        edgesRef.current,
        viewportRef.current,
      );
      await updateGraph({
        variables: {
          input: {
            id: graph.id,
            title: titleRef.current.trim() || "Untitled graph",
            description: descriptionRef.current.trim() || undefined,
            nodesJson: payload.nodesJson,
            edgesJson: payload.edgesJson,
            viewportJson: payload.viewportJson,
          },
        },
      });
      if (generation !== saveGeneration.current) return;
      setSaveState("saved");
      toastSaveSuccess("Graph saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err: unknown) {
      if (generation !== saveGeneration.current) return;
      setSaveState("idle");
      toastSaveError("Couldn't save graph", getGraphQLErrorMessage(err));
    }
  }, [graph, updateGraph]);

  useEffect(() => {
    if (hydratedGraphId.current !== graphId || !graph) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveNow();
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [nodes, edges, viewport, title, description, saveVersion, graph, graphId, saveNow]);

  const onConnect = useCallback(
    (connection: Connection) => {
      markLocalEdit();
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: false,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  function markLocalEdit() {
    localEdits.current += 1;
  }

  function centerFlowPosition() {
    const pane = document.querySelector(".react-flow");
    if (!pane) {
      return { x: 240, y: 160 };
    }
    const rect = pane.getBoundingClientRect();
    return screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  function handleAddNode(kind: GraphNodeKind) {
    markLocalEdit();
    const position = centerFlowPosition();
    setNodes((nds) => [...nds, createNode(kind, nds.length, position)]);
  }

  function handleAddWorkspacePage(note: { id: string; title: string }) {
    markLocalEdit();
    const position = centerFlowPosition();
    setNodes((nds) => [
      ...nds,
      createWorkspacePageNode(note.id, note.title, nds.length, position),
    ]);
  }

  function handleApplyTemplate(id: GraphTemplateId) {
    if (nodes.length > 0 && !confirm("Replace current canvas with this template?")) {
      return;
    }
    markLocalEdit();
    const { nodes: n, edges: e } = cloneTemplateWithEdges(id);
    setNodes(n);
    setEdges(e);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }

  function handleExport() {
    const payload = buildExportPayload(
      titleRef.current,
      descriptionRef.current,
      nodes,
      edges,
      viewport,
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titleRef.current.replace(/\s+/g, "-").toLowerCase() || "graph"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File) {
    const text = await file.text();
    const payload = parseImportPayload(text);
    if (!payload) {
      alert("Invalid graph JSON file.");
      return;
    }
    if (!confirm("Import will replace the current canvas. Continue?")) return;
    markLocalEdit();
    setNodes(parseFlowNodes(JSON.stringify(payload.nodes)));
    setEdges(parseFlowEdges(JSON.stringify(payload.edges)));
    if (payload.title) onTitleChange(payload.title);
    if (payload.description != null) onDescriptionChange(payload.description);
    if (payload.viewport) setViewport(payload.viewport);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }

  function handleDuplicateSelection() {
    const selected = nodes.filter((n) => n.selected);
    if (selected.length === 0) return;
    const clones = duplicateNodes(selected);
    setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), ...clones]);
  }

  function handleDeleteSelection() {
    const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
    const selectedEdgeIds = edges.filter((e) => e.selected).map((e) => e.id);
    if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;
    deleteElements({
      nodes: selectedNodeIds.map((id) => ({ id })),
      edges: selectedEdgeIds.map((id) => ({ id })),
    });
  }

  function handleUpdateNode(id: string, patch: Partial<GraphNodeData>) {
    markLocalEdit();
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...(n.data as GraphNodeData), ...patch } } : n,
      ),
    );
  }

  function handleUpdateEdge(id: string, patch: Partial<Edge>) {
    setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  useHotkey("Mod+S", () => {
    void saveNow();
  });

  useHotkey("Mod+D", () => {
    handleDuplicateSelection();
  });

  const hasSelection = nodes.some((n) => n.selected) || edges.some((e) => e.selected);

  return (
    <>
      <GraphEditorToolbar
        saveState={saveState}
        snapToGrid={snapToGrid}
        onSnapToGridChange={setSnapToGrid}
        showGrid={showGrid}
        onShowGridChange={setShowGrid}
        onAddNode={handleAddNode}
        onAddWorkspacePage={() => setPagePickerOpen(true)}
        onApplyTemplate={handleApplyTemplate}
        onFitView={() => fitView({ padding: 0.2 })}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onSave={() => void saveNow()}
        onExport={handleExport}
        onImport={(f) => void handleImport(f)}
        onDuplicateSelection={handleDuplicateSelection}
        onDeleteSelection={handleDeleteSelection}
        hasSelection={hasSelection}
      />

      <GraphPagePickerDialog
        open={pagePickerOpen}
        onOpenChange={setPagePickerOpen}
        onSelect={handleAddWorkspacePage}
      />

      <div className="flex min-h-0 flex-1">
        <div className="relative min-h-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            connectionRadius={28}
            defaultViewport={initialViewport}
            fitView={!initialViewport && nodes.length > 0}
            onMoveEnd={(_, vp) => setViewport(vp)}
            snapToGrid={snapToGrid}
            snapGrid={[16, 16]}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Shift", "Meta", "Control"]}
            selectionOnDrag
            panOnScroll
            className="bg-muted/20"
          >
            {showGrid && (
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            )}
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              className="!border-border !bg-card"
              zoomable
              pannable
            />
            <Panel
              position="bottom-center"
              className="mb-2 rounded-md border border-border bg-card/90 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur"
            >
              {formatForDisplay("Mod+S")} save · {formatForDisplay("Mod+D")} duplicate · Shift+drag multi-select · Del delete
            </Panel>
          </ReactFlow>
        </div>

        <GraphEditorInspector
          description={description}
          onDescriptionChange={onDescriptionChange}
          onDescriptionBlur={() => void saveNow()}
          selectedNodes={selectedNodes}
          selectedEdges={selectedEdges}
          onUpdateNode={handleUpdateNode}
          onUpdateEdge={handleUpdateEdge}
        />
      </div>
    </>
  );
}

export function GraphEditor({ graphId }: { graphId: string }) {
  const router = useRouter();
  const { data, loading } = useQuery<GraphQueryResult>(GRAPH_QUERY, {
    variables: { id: graphId },
  });
  const [removeGraph] = useMutation(REMOVE_GRAPH_MUTATION, {
    refetchQueries: [{ query: GRAPHS_QUERY }],
  });

  const graph = data?.graph;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saveVersion, setSaveVersion] = useState(0);

  useEffect(() => {
    if (!graph) return;
    setTitle(graph.title);
    setDescription(graph.description ?? "");
  }, [graph]);

  async function handleDeleteGraph() {
    if (!graph) return;
    if (!confirm(`Delete graph "${graph.title}"?`)) return;
    await removeGraph({ variables: { id: graph.id } });
    router.push("/workspace/graphs");
  }

  if (loading && !graph) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="flex-1 w-full rounded-lg" />
      </div>
    );
  }

  if (!graph) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <p className="text-muted-foreground">Graph not found.</p>
        <Button asChild variant="outline">
          <Link href="/workspace/graphs">Back to graphs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/workspace/graphs" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setSaveVersion((v) => v + 1)}
          className="max-w-sm border-none bg-transparent text-base font-semibold shadow-none focus-visible:ring-0"
        />
        <Button
          size="sm"
          variant="outline"
          className="ml-auto gap-1.5 text-destructive hover:text-destructive"
          onClick={() => void handleDeleteGraph()}
        >
          <Trash2 className="h-4 w-4" />
          Delete graph
        </Button>
      </header>

      <ReactFlowProvider>
        <GraphEditorCanvas
          graphId={graphId}
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          saveVersion={saveVersion}
        />
      </ReactFlowProvider>
    </div>
  );
}
