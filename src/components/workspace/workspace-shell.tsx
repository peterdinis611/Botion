"use client";

import { useQuery } from "@apollo/client/react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentHeader } from "@/components/workspace/document-header";
import { NoteEditor } from "@/components/workspace/note-editor";
import { SnapsPanel } from "@/components/workspace/snaps-panel";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { TrashView } from "@/components/workspace/trash-view";
import { WorkspaceHomeContent } from "@/components/workspace/workspace-home-content";
import {
  NOTE_QUERY,
  WORKSPACE_QUERY,
  WORKSPACE_TAGS_QUERY,
} from "@/graphql/operations";
import type {
  NoteQueryResult,
  Tag,
  WorkspaceQueryResult,
  WorkspaceTagsQueryResult,
} from "@/graphql/types";
import { splitLeadingEmoji } from "@/lib/icon-emoji";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
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
  const filters = parseWorkspaceFilters(searchParams);

  const { data, loading: workspaceLoading } =
    useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY);

  const { data: workspaceTagsData } = useQuery<WorkspaceTagsQueryResult>(
    WORKSPACE_TAGS_QUERY,
    {
      variables: { notebookId: filters.notebookId! },
      skip: !filters.notebookId,
      errorPolicy: "all",
    },
  );

  const { data: noteData, loading: noteLoading } = useQuery<NoteQueryResult>(
    NOTE_QUERY,
    {
      variables: { id: noteId! },
      skip: !noteId,
    },
  );

  const headerTitle = useMemo(() => {
    if (filters.archived && !noteId) return "Kôš";
    if (noteId && noteData?.note) {
      const { label } = splitLeadingEmoji(noteData.note.title);
      return label || "Untitled";
    }
    if (filters.notebookId) {
      const nb = data?.notebooks.find((n) => n.id === filters.notebookId);
      if (nb) return notebookDisplayName(nb.name);
    }
    if (filters.folderId) {
      const folder = data?.folders.find((f) => f.id === filters.folderId);
      if (folder) return folder.name;
    }
    return "Acme Inc.";
  }, [
    filters.archived,
    noteId,
    noteData?.note,
    filters.notebookId,
    filters.folderId,
    data?.notebooks,
    data?.folders,
  ]);

  const tagsForScope = useMemo((): Tag[] => {
    if (filters.notebookId) {
      return workspaceTagsData?.workspaceTags ?? [];
    }
    return data?.tags ?? [];
  }, [data?.tags, filters.notebookId, workspaceTagsData?.workspaceTags]);

  const headerIcon = useMemo(() => {
    if (filters.archived && !noteId) {
      return <span className="text-[15px] leading-none">🗑️</span>;
    }
    if (noteId && noteData?.note) {
      const { emoji } = splitLeadingEmoji(noteData.note.title);
      return (
        <span className="text-[15px] leading-none">{emoji ?? "📄"}</span>
      );
    }
    if (filters.notebookId) {
      const nb = data?.notebooks.find((n) => n.id === filters.notebookId);
      if (nb) {
        return (
          <span className="text-[15px] leading-none">
            {notebookEmoji(nb.id, nb.name)}
          </span>
        );
      }
    }
    return <span className="text-[15px] leading-none">🎯</span>;
  }, [filters.archived, noteId, noteData?.note, filters.notebookId, data?.notebooks]);

  return (
    <WorkspaceFrame className="flex min-h-0 flex-row" hideQuickFab>
      <div className="flex min-w-0 flex-1 flex-col border-r border-border/50 bg-background">
        <DocumentHeader
          title={headerTitle}
          icon={headerIcon}
          noteId={noteId}
          noteTitle={noteData?.note?.title}
          noteIsArchived={noteData?.note?.isArchived}
          noteIsPinned={noteData?.note?.isPinned}
          onNoteActionComplete={() =>
            noteId &&
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

        {noteId ? (
          noteLoading || workspaceLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Skeleton className="h-8 w-48" />
            </div>
          ) : noteData?.note ? (
            <NoteEditor
              note={{
                ...noteData.note,
                tags: noteData.note.tags,
              }}
              allTags={tagsForScope}
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
        ) : filters.archived ? (
          <TrashView />
        ) : (
          (children ?? (
            <WorkspaceHomeContent
              tags={tagsForScope}
              notebookId={filters.notebookId}
            />
          ))
        )}
      </div>

      <SnapsPanel notebookId={filters.notebookId} noteId={noteId} />
    </WorkspaceFrame>
  );
}
