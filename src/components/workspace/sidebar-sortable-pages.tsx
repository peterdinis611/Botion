"use client";

import { useMutation } from "@apollo/client/react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SortableSidebarPageRow } from "@/components/workspace/sidebar-page-row";
import type { Note } from "@/graphql/types";
import { REORDER_NOTES_MUTATION, WORKSPACE_QUERY } from "@/graphql/operations";
import type { NoteActionResult } from "@/lib/note-navigation";
import { sortPagesByUpdated } from "@/lib/workspace-pages";
import { buildWorkspacePath, type WorkspaceFilters } from "@/lib/workspace-url";

export function SidebarSortablePages({
  notebookId,
  pages,
  filters,
  onNewPage,
  onPageAction,
  emptyLabel = "Add a page",
}: {
  notebookId?: string;
  pages: Note[];
  filters: WorkspaceFilters;
  onNewPage?: () => void;
  onPageAction?: (action: NoteActionResult) => void;
  emptyLabel?: string;
}) {
  const pathname = usePathname();
  const [ordered, setOrdered] = useState(() => sortPagesByUpdated(pages));

  useEffect(() => {
    setOrdered(sortPagesByUpdated(pages));
  }, [pages]);

  const [reorderNotes] = useMutation(REORDER_NOTES_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((p) => p.id === active.id);
    const newIndex = ordered.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);

    await reorderNotes({
      variables: {
        ids: next.map((p) => p.id),
        notebookId: notebookId ?? null,
      },
    });
  }

  if (pages.length === 0) {
    return (
      <button
        type="button"
        onClick={onNewPage}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] text-muted-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-foreground"
      >
        <Plus className="h-3 w-3 opacity-60" />
        {emptyLabel}
      </button>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => void handleDragEnd(e)}
    >
      <SortableContext
        items={ordered.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="max-h-[min(320px,45vh)] space-y-px overflow-y-auto py-0.5">
          {ordered.map((page) => {
            const pageHref = buildWorkspacePath(
              "/workspace",
              {
                notebookId: notebookId ?? page.notebookId ?? undefined,
                folderId: filters.folderId,
                archived: false,
                pinned: false,
                tagId: filters.tagId,
              },
              page.id,
            );
            return (
              <SortableSidebarPageRow
                key={page.id}
                page={page}
                href={pageHref}
                active={pathname === `/workspace/notes/${page.id}`}
                onActionComplete={onPageAction}
              />
            );
          })}
        </div>
      </SortableContext>

      {onNewPage && (
        <button
          type="button"
          onClick={onNewPage}
          className="mt-0.5 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] text-muted-foreground/70 transition-colors hover:bg-sidebar-accent/40 hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
          New page
        </button>
      )}
    </DndContext>
  );
}
