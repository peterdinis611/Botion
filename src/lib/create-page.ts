import type { Route } from "next";
import type { Notebook } from "@/graphql/types";
import type { WorkspaceFilters } from "@/lib/workspace-url";
import { buildWorkspacePath } from "@/lib/workspace-url";

/** Where a new page should live in the workspace hierarchy. */
export type PageDestination = {
  /** `null` = inbox (not tied to a notebook). */
  notebookId: string | null;
};

export function resolvePageDestination(
  notebooks: Pick<Notebook, "id">[],
  options?: {
    preferredNotebookId?: string;
    urlNotebookId?: string;
  },
): PageDestination {
  const preferred = options?.preferredNotebookId ?? options?.urlNotebookId;

  if (preferred === "inbox") {
    return { notebookId: null };
  }

  if (preferred && notebooks.some((n) => n.id === preferred)) {
    return { notebookId: preferred };
  }

  if (notebooks.length === 1) {
    return { notebookId: notebooks[0].id };
  }

  if (options?.urlNotebookId && notebooks.some((n) => n.id === options.urlNotebookId)) {
    return { notebookId: options.urlNotebookId };
  }

  return { notebookId: null };
}

export function buildNewNotePath(
  noteId: string,
  filters: WorkspaceFilters,
  destination: PageDestination,
): Route {
  const next: WorkspaceFilters = {
    ...filters,
    archived: false,
    pinned: false,
    tagId: filters.tagId,
    folderId: filters.folderId,
    notebookId: destination.notebookId ?? undefined,
  };

  if (!destination.notebookId) {
    next.notebookId = undefined;
  }

  return buildWorkspacePath(`/workspace/notes/${noteId}`, next);
}
