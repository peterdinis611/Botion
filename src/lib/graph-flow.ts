import type { Edge, Node, Viewport } from "@xyflow/react";

export const GRAPH_NODE_TYPE = "graphNode";
export const GRAPH_DECISION_TYPE = "graphDecision";
export const GRAPH_NOTE_TYPE = "graphNote";

export type GraphNodeKind = "default" | "decision" | "note";

export type GraphNodeData = {
  label?: string;
  kind?: GraphNodeKind;
  color?: string;
  note?: string;
};

export type GraphEdgeData = {
  label?: string;
};

export const NODE_COLOR_PRESETS = [
  "#0d9488",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#64748b",
  "#ffffff",
] as const;

export type GraphTemplateId =
  | "blank"
  | "flowchart"
  | "mindmap"
  | "sequence";

export type GraphTemplate = {
  id: GraphTemplateId;
  label: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
};

function node(
  id: string,
  label: string,
  x: number,
  y: number,
  kind: GraphNodeKind = "default",
  color?: string,
): Node {
  const type =
    kind === "decision"
      ? GRAPH_DECISION_TYPE
      : kind === "note"
        ? GRAPH_NOTE_TYPE
        : GRAPH_NODE_TYPE;
  return {
    id,
    type,
    position: { x, y },
    data: { label, kind, color } satisfies GraphNodeData,
  };
}

function edge(
  source: string,
  target: string,
  label?: string,
  animated = false,
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    label,
    animated,
    type: "smoothstep",
    data: { label } satisfies GraphEdgeData,
  };
}

export const GRAPH_TEMPLATES: GraphTemplate[] = [
  {
    id: "blank",
    label: "Blank",
    description: "Single starter node",
    nodes: [node("1", "Start", 280, 120)],
    edges: [],
  },
  {
    id: "flowchart",
    label: "Flowchart",
    description: "Start → process → decision → end",
    nodes: [
      node("start", "Start", 280, 40, "default", "#0d9488"),
      node("process", "Process", 280, 140),
      node("decision", "Decision?", 280, 260, "decision", "#f59e0b"),
      node("yes", "Yes branch", 120, 380),
      node("no", "No branch", 440, 380),
      node("end", "End", 280, 500, "default", "#64748b"),
    ],
    edges: [
      edge("start", "process"),
      edge("process", "decision"),
      edge("decision", "yes", "Yes"),
      edge("decision", "no", "No"),
      edge("yes", "end"),
      edge("no", "end"),
    ],
  },
  {
    id: "mindmap",
    label: "Mind map",
    description: "Central topic with branches",
    nodes: [
      node("center", "Main topic", 300, 200, "default", "#0d9488"),
      node("b1", "Idea A", 80, 80, "note", "#fef3c7"),
      node("b2", "Idea B", 520, 80, "note", "#fef3c7"),
      node("b3", "Idea C", 80, 320, "note", "#fef3c7"),
      node("b4", "Idea D", 520, 320, "note", "#fef3c7"),
    ],
    edges: [
      edge("center", "b1"),
      edge("center", "b2"),
      edge("center", "b3"),
      edge("center", "b4"),
    ],
  },
  {
    id: "sequence",
    label: "Sequence",
    description: "Linear step flow",
    nodes: [
      node("s1", "Step 1", 80, 180),
      node("s2", "Step 2", 280, 180),
      node("s3", "Step 3", 480, 180),
      node("s4", "Step 4", 680, 180),
    ],
    edges: [
      edge("s1", "s2", "", true),
      edge("s2", "s3", "", true),
      edge("s3", "s4", "", true),
    ],
  },
];

export function getTemplate(id: GraphTemplateId): GraphTemplate {
  return GRAPH_TEMPLATES.find((t) => t.id === id) ?? GRAPH_TEMPLATES[0];
}

export function cloneTemplate(id: GraphTemplateId): {
  nodes: Node[];
  edges: Edge[];
} {
  const t = getTemplate(id);
  return {
    nodes: t.nodes.map((n) => ({
      ...n,
      id: crypto.randomUUID(),
      data: { ...(n.data as GraphNodeData) },
    })),
    edges: [],
  };
}

/** Re-wire edges after template clone regenerates node ids */
export function cloneTemplateWithEdges(id: GraphTemplateId): {
  nodes: Node[];
  edges: Edge[];
} {
  const t = getTemplate(id);
  const idMap = new Map<string, string>();
  const nodes = t.nodes.map((n) => {
    const newId = crypto.randomUUID();
    idMap.set(n.id, newId);
    return {
      ...n,
      id: newId,
      data: { ...(n.data as GraphNodeData) },
    };
  });
  const edges = t.edges.map((e) => ({
    ...e,
    id: crypto.randomUUID(),
    source: idMap.get(e.source) ?? e.source,
    target: idMap.get(e.target) ?? e.target,
    type: e.type ?? "smoothstep",
  }));
  return { nodes, edges };
}

export function createNode(
  kind: GraphNodeKind = "default",
  index = 0,
  position?: { x: number; y: number },
): Node {
  const type =
    kind === "decision"
      ? GRAPH_DECISION_TYPE
      : kind === "note"
        ? GRAPH_NOTE_TYPE
        : GRAPH_NODE_TYPE;
  const labels: Record<GraphNodeKind, string> = {
    default: "New node",
    decision: "Decision?",
    note: "Note",
  };
  const colors: Partial<Record<GraphNodeKind, string>> = {
    default: "#ffffff",
    decision: "#fef3c7",
    note: "#fef9c3",
  };
  return {
    id: crypto.randomUUID(),
    type,
    position: position ?? { x: 120 + index * 48, y: 80 + index * 48 },
    data: {
      label: labels[kind],
      kind,
      color: colors[kind],
    } satisfies GraphNodeData,
  };
}

export function createDefaultNode(index = 0): Node {
  return createNode("default", index);
}

export function parseFlowNodes(json: string): Node[] {
  try {
    const parsed = JSON.parse(json) as Node[];
    if (!Array.isArray(parsed)) return [createDefaultNode()];
    return parsed.map((n) => {
      const data = (n.data ?? {}) as GraphNodeData;
      const kind = data.kind ?? "default";
      const type =
        n.type ??
        (kind === "decision"
          ? GRAPH_DECISION_TYPE
          : kind === "note"
            ? GRAPH_NOTE_TYPE
            : GRAPH_NODE_TYPE);
      return { ...n, type, data };
    });
  } catch {
    return [createDefaultNode()];
  }
}

export function parseFlowEdges(json: string): Edge[] {
  try {
    const parsed = JSON.parse(json) as Edge[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((e) => ({
      ...e,
      type: e.type ?? "smoothstep",
      label: e.label ?? (e.data as GraphEdgeData)?.label,
    }));
  } catch {
    return [];
  }
}

export function parseFlowViewport(json?: string | null): Viewport | undefined {
  if (!json) return undefined;
  try {
    const parsed = JSON.parse(json) as Viewport;
    if (
      typeof parsed.x === "number" &&
      typeof parsed.y === "number" &&
      typeof parsed.zoom === "number"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export function serializeFlow(
  nodes: Node[],
  edges: Edge[],
  viewport?: Viewport,
) {
  return {
    nodesJson: JSON.stringify(nodes),
    edgesJson: JSON.stringify(edges),
    viewportJson: viewport ? JSON.stringify(viewport) : undefined,
  };
}

export function duplicateNodes(nodes: Node[], offset = 40): Node[] {
  return nodes.map((n) => ({
    ...n,
    id: crypto.randomUUID(),
    position: {
      x: n.position.x + offset,
      y: n.position.y + offset,
    },
    selected: true,
  }));
}

export type GraphExportPayload = {
  version: 1;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
};

export function buildExportPayload(
  title: string,
  description: string | undefined | null,
  nodes: Node[],
  edges: Edge[],
  viewport?: Viewport,
): GraphExportPayload {
  return {
    version: 1,
    title,
    description: description ?? undefined,
    nodes,
    edges,
    viewport,
  };
}

export function parseImportPayload(raw: string): GraphExportPayload | null {
  try {
    const parsed = JSON.parse(raw) as GraphExportPayload;
    if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function countGraphElements(nodesJson?: string, edgesJson?: string) {
  try {
    const n = nodesJson ? (JSON.parse(nodesJson) as unknown[]).length : 0;
    const e = edgesJson ? (JSON.parse(edgesJson) as unknown[]).length : 0;
    return { nodes: n, edges: e };
  } catch {
    return { nodes: 0, edges: 0 };
  }
}
