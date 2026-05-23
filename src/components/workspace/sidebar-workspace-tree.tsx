"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BookMarked,
  ChevronRight,
  FolderClosed,
  GripVertical,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  REORDER_FOLDERS_MUTATION,
  REORDER_NOTEBOOKS_MUTATION,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type { Folder, Notebook } from "@/graphql/types";

const folderKey = (id: string) => `folder:${id}`;
const notebookKey = (id: string) => `notebook:${id}`;

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function SidebarWorkspaceTree({
  folders,
  notebooks,
  onNewNotebookInFolder,
  onNewPage,
  onNewLooseNotebook,
}: {
  folders: Folder[];
  notebooks: Notebook[];
  onNewNotebookInFolder: (folderId: string) => void;
  onNewPage: (notebookId: string) => void;
  onNewLooseNotebook: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNotebookId = searchParams.get("notebook");
  const activeFolderId = searchParams.get("folder");

  const [orderedFolders, setOrderedFolders] = useState(() => sortByOrder(folders));
  const [orderedNotebooks, setOrderedNotebooks] = useState(() =>
    sortByOrder(notebooks),
  );

  useEffect(() => {
    setOrderedFolders(sortByOrder(folders));
  }, [folders]);

  useEffect(() => {
    setOrderedNotebooks(sortByOrder(notebooks));
  }, [notebooks]);

  const [reorderFolders] = useMutation(REORDER_FOLDERS_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });
  const [reorderNotebooks] = useMutation(REORDER_NOTEBOOKS_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const looseNotebooks = useMemo(
    () => orderedNotebooks.filter((nb) => !nb.folderId),
    [orderedNotebooks],
  );

  const notebooksByFolder = useMemo(() => {
    const map = new Map<string, Notebook[]>();
    for (const folder of orderedFolders) {
      const inFolder = orderedNotebooks.filter((nb) => nb.folderId === folder.id);
      map.set(folder.id, sortByOrder(inFolder));
    }
    return map;
  }, [orderedFolders, orderedNotebooks]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeStr = String(active.id);
    const overStr = String(over.id);

    if (activeStr.startsWith("folder:") && overStr.startsWith("folder:")) {
      const activeId = activeStr.replace("folder:", "");
      const overId = overStr.replace("folder:", "");
      const oldIndex = orderedFolders.findIndex((f) => f.id === activeId);
      const newIndex = orderedFolders.findIndex((f) => f.id === overId);
      if (oldIndex < 0 || newIndex < 0) return;

      const next = arrayMove(orderedFolders, oldIndex, newIndex);
      setOrderedFolders(next);
      await reorderFolders({ variables: { ids: next.map((f) => f.id) } });
      return;
    }

    if (activeStr.startsWith("notebook:") && overStr.startsWith("notebook:")) {
      const activeId = activeStr.replace("notebook:", "");
      const overId = overStr.replace("notebook:", "");
      const activeNb = orderedNotebooks.find((n) => n.id === activeId);
      const overNb = orderedNotebooks.find((n) => n.id === overId);
      if (!activeNb || !overNb || activeNb.folderId !== overNb.folderId) return;

      const scope = sortByOrder(
        orderedNotebooks.filter((n) => n.folderId === activeNb.folderId),
      );
      const oldIndex = scope.findIndex((n) => n.id === activeId);
      const newIndex = scope.findIndex((n) => n.id === overId);
      if (oldIndex < 0 || newIndex < 0) return;

      const reordered = arrayMove(scope, oldIndex, newIndex);
      const folderId = activeNb.folderId ?? null;

      setOrderedNotebooks((prev) => {
        const others = prev.filter((n) => n.folderId !== folderId);
        return [...others, ...reordered];
      });

      await reorderNotebooks({
        variables: {
          ids: reordered.map((n) => n.id),
          folderId: folderId ?? undefined,
        },
      });
    }
  }

  if (orderedFolders.length === 0 && looseNotebooks.length === 0) {
    return (
      <div className="px-2 py-3">
        <p className="text-xs text-muted-foreground">
          No folders yet. Create one to organize notebooks.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 w-full justify-start gap-2 text-muted-foreground"
          onClick={onNewLooseNotebook}
        >
          <Plus className="h-3.5 w-3.5" />
          New notebook
        </Button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedFolders.map((f) => folderKey(f.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-0.5">
          {orderedFolders.map((folder) => {
            const folderNotebooks = notebooksByFolder.get(folder.id) ?? [];
            const isFolderActive = activeFolderId === folder.id;

            return (
              <SortableTreeRow key={folder.id} id={folderKey(folder.id)}>
                <Collapsible defaultOpen className="group/collapsible">
                  <div
                    className={cn(
                      "relative flex items-center rounded-md pr-1 transition-colors",
                      isFolderActive
                        ? "bg-sidebar-accent"
                        : "hover:bg-sidebar-accent/70",
                    )}
                  >
                    <CollapsibleTrigger className="flex h-8 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-1 text-left text-sm"
                      onClick={() =>
                        router.push(`/workspace?folder=${folder.id}`)
                      }
                    >
                      <FolderClosed
                        className="h-4 w-4 shrink-0 opacity-80"
                        style={{ color: folder.color }}
                      />
                      <span
                        className={cn(
                          "truncate",
                          isFolderActive && "font-medium",
                        )}
                      >
                        {folder.name}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover/collapsible:opacity-100"
                      onClick={() => onNewNotebookInFolder(folder.id)}
                      title="Add notebook"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <CollapsibleContent>
                    <div className="relative ml-3 border-l border-border/80 pl-2">
                      <SortableContext
                        items={folderNotebooks.map((n) => notebookKey(n.id))}
                        strategy={verticalListSortingStrategy}
                      >
                        {folderNotebooks.map((nb, i) => (
                          <NotebookRow
                            key={nb.id}
                            id={notebookKey(nb.id)}
                            notebook={nb}
                            active={activeNotebookId === nb.id}
                            isLast={i === folderNotebooks.length - 1}
                            onSelect={() =>
                              router.push(`/workspace?notebook=${nb.id}`)
                            }
                            onNewPage={() => onNewPage(nb.id)}
                          />
                        ))}
                      </SortableContext>
                      {folderNotebooks.length === 0 && (
                        <p className="py-2 pl-6 text-xs text-muted-foreground">
                          Empty folder
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </SortableTreeRow>
            );
          })}
        </div>
      </SortableContext>

      {looseNotebooks.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/90">
            Notebooks
          </p>
          <SortableContext
            items={looseNotebooks.map((n) => notebookKey(n.id))}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0.5">
              {looseNotebooks.map((nb) => (
                <NotebookRow
                  key={nb.id}
                  id={notebookKey(nb.id)}
                  notebook={nb}
                  active={activeNotebookId === nb.id}
                  onSelect={() => router.push(`/workspace?notebook=${nb.id}`)}
                  onNewPage={() => onNewPage(nb.id)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 h-8 w-full justify-start gap-2 px-2 text-muted-foreground hover:text-foreground"
        onClick={onNewLooseNotebook}
      >
        <Plus className="h-3.5 w-3.5" />
        New notebook
      </Button>
    </DndContext>
  );
}

function SortableTreeRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
      }}
      className="group/row relative"
    >
      <button
        type="button"
        className="absolute left-0 top-1.5 z-10 flex h-6 w-4 cursor-grab items-center justify-center text-muted-foreground opacity-0 active:cursor-grabbing group-hover/row:opacity-100"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3 w-3" />
      </button>
      <div className="pl-1">{children}</div>
    </div>
  );
}

function NotebookRow({
  id,
  notebook,
  active,
  isLast,
  onSelect,
  onNewPage,
}: {
  id: string;
  notebook: Notebook;
  active: boolean;
  isLast?: boolean;
  onSelect: () => void;
  onNewPage: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
      }}
      className={cn(
        "group/nb relative flex items-center rounded-md pr-0.5",
        active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/70",
        !isLast && "mb-0.5",
      )}
    >
      <button
        type="button"
        className="absolute -left-5 top-1.5 z-10 flex h-6 w-4 cursor-grab items-center justify-center text-muted-foreground opacity-0 active:cursor-grabbing group-hover/nb:opacity-100"
        {...attributes}
        {...listeners}
        aria-label="Drag notebook"
      >
        <GripVertical className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pl-2 pr-1 text-left text-sm"
      >
        <BookMarked
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          style={{ color: active ? notebook.color : undefined }}
        />
        <span className={cn("truncate", active && "font-medium")}>
          {notebook.name}
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 opacity-0 group-hover/nb:opacity-100"
        onClick={onNewPage}
        title="New page"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
