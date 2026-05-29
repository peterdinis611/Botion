"use client";

import { useQuery } from "@apollo/client/react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentHeader } from "@/components/workspace/document-header";
import { NoteEditor } from "@/components/workspace/note-editor";
import { SnapsPanel } from "@/components/workspace/snaps-panel";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { WorkspaceHomeContent } from "@/components/workspace/workspace-home-content";
import { NOTE_QUERY, WORKSPACE_QUERY } from "@/graphql/operations";
import type { NoteQueryResult, WorkspaceQueryResult } from "@/graphql/types";
import { notebookEmoji } from "@/lib/workspace-icons";
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

  const { data: noteData, loading: noteLoading } = useQuery<NoteQueryResult>(
    NOTE_QUERY,
    {
      variables: { id: noteId! },
      skip: !noteId,
    },
  );

  const headerTitle = useMemo(() => {
    if (filters.notebookId) {
      const nb = data?.notebooks.find((n) => n.id === filters.notebookId);
      if (nb) return nb.name;
    }
    if (filters.folderId) {
      const folder = data?.folders.find((f) => f.id === filters.folderId);
      if (folder) return folder.name;
    }
    return "Acme Inc.";
  }, [filters.notebookId, filters.folderId, data?.notebooks, data?.folders]);

  const headerIcon = useMemo(() => {
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
  }, [filters.notebookId, data?.notebooks]);

  return (
    <WorkspaceFrame className="flex min-h-0 flex-row" hideQuickFab>
      <div className="flex min-w-0 flex-1 flex-col border-r border-border/50 bg-background">
        <DocumentHeader title={headerTitle} icon={headerIcon} />

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
          (children ?? <WorkspaceHomeContent />)
        )}
      </div>

      <SnapsPanel notebookId={filters.notebookId} noteId={noteId} />
    </WorkspaceFrame>
  );
}
