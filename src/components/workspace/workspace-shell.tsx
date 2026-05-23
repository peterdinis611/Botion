"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/workspace/empty-state";
import { NoteEditor } from "@/components/workspace/note-editor";
import { NoteList } from "@/components/workspace/note-list";
import { NotificationsPanel } from "@/components/workspace/notifications-panel";
import { ThemeToggle } from "@/components/workspace/theme-toggle";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import {
  CREATE_NOTE_MUTATION,
  NOTE_QUERY,
  NOTES_LIST_QUERY,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type {
  CreateNoteResult,
  Note,
  NoteQueryResult,
  WorkspaceQueryResult,
} from "@/graphql/types";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { buildWorkspacePath, parseWorkspaceFilters } from "@/lib/workspace-url";

export function WorkspaceShell({
  noteId,
  children,
}: {
  noteId?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const { createNewPage } = useWorkspaceCreate();
  const filters = parseWorkspaceFilters(searchParams);

  const { data, loading: workspaceLoading } =
    useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY);

  const { data: notesData, loading: notesLoading } = useQuery<{
    notes: Note[];
  }>(NOTES_LIST_QUERY, {
    variables: {
      notebookId: filters.notebookId,
      folderId: filters.folderId,
      isPinned: filters.pinned ? true : undefined,
      tagIds: filters.tagId ? [filters.tagId] : undefined,
      includeArchived: filters.archived ? true : false,
      searchQuery: search.trim() || undefined,
    },
    skip: workspaceLoading,
  });

  const { data: noteData, loading: noteLoading } = useQuery<NoteQueryResult>(
    NOTE_QUERY,
    {
      variables: { id: noteId! },
      skip: !noteId,
    },
  );

  const [createNote] = useMutation<CreateNoteResult>(CREATE_NOTE_MUTATION);

  const filteredNotes = useMemo(() => {
    let list = notesData?.notes ?? [];

    if (filters.archived) {
      list = list.filter((n) => n.isArchived);
    } else {
      list = list.filter((n) => !n.isArchived);
    }

    return list.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [notesData?.notes, filters.archived]);

  const listTitle = useMemo(() => {
    const parts: string[] = [];

    if (filters.archived) parts.push("Archive");
    else if (filters.pinned) parts.push("Pinned");

    if (filters.tagId) {
      const tag = data?.tags.find((t) => t.id === filters.tagId);
      if (tag) parts.push(`#${tag.name}`);
    }

    if (filters.notebookId) {
      const nb = data?.notebooks.find((n) => n.id === filters.notebookId);
      if (nb) parts.push(nb.name);
    } else if (filters.folderId) {
      const folder = data?.folders.find((f) => f.id === filters.folderId);
      if (folder) parts.push(folder.name);
    }

    if (parts.length === 0) return "All notes";
    return parts.join(" · ");
  }, [filters, data?.tags, data?.notebooks, data?.folders]);

  async function handleNewNote() {
    if (filters.notebookId) {
      await createNewPage(filters.notebookId);
      return;
    }
    const { data: created } = await createNote({
      variables: {
        input: {
          title: "Untitled",
          content: "",
          notebookId: filters.notebookId,
        },
      },
      refetchQueries: [{ query: WORKSPACE_QUERY }, { query: NOTES_LIST_QUERY }],
    });
    const id = created?.createNote?.id;
    if (id) {
      router.push(buildWorkspacePath("/workspace", filters, id));
    }
  }

  const listLoading = workspaceLoading || notesLoading;

  return (
    <WorkspaceFrame className="flex min-h-0 flex-row">
      <NoteList
        notes={filteredNotes}
        search={search}
        onSearchChange={setSearch}
        title={listTitle}
        totalCount={filteredNotes.length}
        tags={data?.tags ?? []}
        loading={listLoading}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-end gap-1 border-b border-border px-4 py-2">
          <NotificationsPanel />
          <ThemeToggle />
          <Button size="sm" className="gap-1.5" onClick={() => void handleNewNote()}>
            <Plus className="h-4 w-4" />
            New page
          </Button>
        </div>

        {noteId ? (
          noteLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Skeleton className="h-8 w-48" />
            </div>
          ) : noteData?.note ? (
            <NoteEditor
              note={{
                ...noteData.note,
                tags: noteData.note.tags,
              }}
              allTags={data?.tags ?? []}
              onDeleted={() =>
                router.push(
                  buildWorkspacePath(
                    "/workspace",
                    filters.archived
                      ? { ...filters, archived: true }
                      : { ...filters, archived: false },
                  ),
                )
              }
            />
          ) : (
            notFound()
          )
        ) : (
          (children ?? (
            <EmptyState
              title="Select a page"
              description="Pick a note from the list, press ⌘K to search, or create a new page."
            />
          ))
        )}
      </main>
    </WorkspaceFrame>
  );
}
