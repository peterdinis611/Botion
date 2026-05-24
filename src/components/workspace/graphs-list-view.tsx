"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  ArrowDownAZ,
  Clock,
  Copy,
  LayoutGrid,
  List,
  Network,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CREATE_GRAPH_MUTATION,
  GRAPH_QUERY,
  GRAPHS_QUERY,
  REMOVE_GRAPH_MUTATION,
} from "@/graphql/operations";
import type {
  CreateGraphResult,
  GraphListItem,
  GraphQueryResult,
  GraphsQueryResult,
} from "@/graphql/types";
import {
  cloneTemplateWithEdges,
  countGraphElements,
  GRAPH_TEMPLATES,
  type GraphTemplateId,
  serializeFlow,
} from "@/lib/graph-flow";
import { cn } from "@/lib/utils";

type SortKey = "updated" | "title" | "created";
type ViewMode = "grid" | "list";

export function GraphsListView() {
  const router = useRouter();
  const { data, loading } = useQuery<GraphsQueryResult>(GRAPHS_QUERY);
  const [fetchGraph] = useLazyQuery<GraphQueryResult>(GRAPH_QUERY);

  const [createGraph, { loading: creating }] = useMutation<CreateGraphResult>(
    CREATE_GRAPH_MUTATION,
    {
      refetchQueries: [{ query: GRAPHS_QUERY }],
    },
  );

  const [removeGraph] = useMutation(REMOVE_GRAPH_MUTATION, {
    refetchQueries: [{ query: GRAPHS_QUERY }],
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const graphs = data?.graphs ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...graphs];
    if (q) {
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          (g.description?.toLowerCase().includes(q) ?? false),
      );
    }
    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [graphs, search, sort]);

  async function handleCreate(templateId: GraphTemplateId = "blank") {
    const { nodes, edges } = cloneTemplateWithEdges(templateId);
    const flow = serializeFlow(nodes, edges);
    const template = GRAPH_TEMPLATES.find((t) => t.id === templateId);
    const { data: result } = await createGraph({
      variables: {
        input: {
          title: template?.label ?? "Untitled graph",
          description: template?.description ?? "",
          nodesJson: flow.nodesJson,
          edgesJson: flow.edgesJson,
        },
      },
    });
    const id = result?.createGraph?.id;
    if (id) router.push(`/workspace/graphs/${id}`);
  }

  async function handleDuplicate(g: GraphListItem) {
    const { data: full } = await fetchGraph({ variables: { id: g.id } });
    const graph = full?.graph;
    if (!graph) return;
    const { data: result } = await createGraph({
      variables: {
        input: {
          title: `${graph.title} (copy)`,
          description: graph.description ?? "",
          nodesJson: graph.nodesJson,
          edgesJson: graph.edgesJson,
          viewportJson: graph.viewportJson ?? undefined,
        },
      },
    });
    const id = result?.createGraph?.id;
    if (id) router.push(`/workspace/graphs/${id}`);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await removeGraph({ variables: { id } });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="border-b border-border px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Graphs</h1>
              <p className="text-sm text-muted-foreground">
                Flowcharts, mind maps, and diagrams with React Flow.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5" disabled={creating}>
                  <Plus className="h-4 w-4" />
                  New from template
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Templates</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {GRAPH_TEMPLATES.map((t) => (
                  <DropdownMenuItem key={t.id} onClick={() => void handleCreate(t.id)}>
                    <div>
                      <p className="font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="gap-1.5"
              onClick={() => void handleCreate("blank")}
              disabled={creating}
            >
              <Plus className="h-4 w-4" />
              Blank graph
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search graphs…"
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowDownAZ className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort("updated")}>
                <Clock className="mr-2 h-4 w-4" />
                Recently updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("created")}>
                Newest created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("title")}>
                Title A–Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex rounded-md border border-border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {filtered.length} graph{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <div className="p-6">
        {loading && !data ? (
          <div
            className={cn(
              "gap-3",
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col",
            )}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn("rounded-lg", viewMode === "grid" ? "h-32" : "h-20")}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <FadeIn className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Network className="mb-3 h-10 w-10 text-muted-foreground/60" />
            <p className="font-medium">
              {graphs.length === 0 ? "No graphs yet" : "No matching graphs"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {graphs.length === 0
                ? "Pick a template or start with a blank canvas."
                : "Try a different search term."}
            </p>
            {graphs.length === 0 && (
              <Button
                className="mt-4 gap-1.5"
                onClick={() => void handleCreate("flowchart")}
              >
                <Plus className="h-4 w-4" />
                Start with flowchart template
              </Button>
            )}
          </FadeIn>
        ) : viewMode === "grid" ? (
          <StaggerList as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <StaggerItem key={g.id}>
                <GraphCard
                  graph={g}
                  onDelete={() => void handleDelete(g.id, g.title)}
                  onDuplicate={() => void handleDuplicate(g)}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <StaggerList as="ul" className="space-y-2">
            {filtered.map((g) => (
              <StaggerItem key={g.id}>
                <GraphListRow
                  graph={g}
                  onDelete={() => void handleDelete(g.id, g.title)}
                  onDuplicate={() => void handleDuplicate(g)}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </div>
  );
}

function GraphStats({ graph }: { graph: GraphListItem }) {
  const counts = countGraphElements(graph.nodesJson, graph.edgesJson);
  return (
    <div className="flex gap-1.5">
      <Badge variant="secondary" className="text-[10px] font-normal">
        {counts.nodes} nodes
      </Badge>
      <Badge variant="secondary" className="text-[10px] font-normal">
        {counts.edges} edges
      </Badge>
    </div>
  );
}

function GraphCard({
  graph,
  onDelete,
  onDuplicate,
}: {
  graph: GraphListItem;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <li className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/workspace/graphs/${graph.id}`}
        className="block after:absolute after:inset-0"
      >
        <p className="font-medium leading-tight">{graph.title}</p>
        {graph.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {graph.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <GraphStats graph={graph} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Updated{" "}
          {new Date(graph.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </Link>
      <div className="absolute right-2 top-2 z-10 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            onDuplicate();
          }}
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

function GraphListRow({
  graph,
  onDelete,
  onDuplicate,
}: {
  graph: GraphListItem;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <li className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
      <Link href={`/workspace/graphs/${graph.id}`} className="min-w-0 flex-1">
        <p className="font-medium">{graph.title}</p>
        {graph.description && (
          <p className="truncate text-sm text-muted-foreground">{graph.description}</p>
        )}
      </Link>
      <GraphStats graph={graph} />
      <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {new Date(graph.updatedAt).toLocaleDateString()}
      </p>
      <div className="flex shrink-0 gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDuplicate}
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
