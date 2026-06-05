import type { Route } from "next";
import { asRoute } from "@/lib/routes";

export type WorkspaceFilters = {
  notebookId?: string;
  folderId?: string;
  pinned?: boolean;
  archived?: boolean;
  tagId?: string;
};

export function parseWorkspaceFilters(searchParams: URLSearchParams): WorkspaceFilters {
  return {
    notebookId: searchParams.get("notebook") ?? undefined,
    folderId: searchParams.get("folder") ?? undefined,
    pinned: searchParams.get("pinned") === "1",
    archived: searchParams.get("archived") === "1",
    tagId: searchParams.get("tag") ?? undefined,
  };
}

export function hasListFilters(filters: WorkspaceFilters): boolean {
  return Boolean(
    filters.pinned ||
      filters.archived ||
      filters.tagId ||
      filters.notebookId ||
      filters.folderId,
  );
}

export function buildWorkspacePath(
  pathname: string,
  filters: WorkspaceFilters,
  noteId?: string,
): Route {
  const params = new URLSearchParams();

  if (filters.notebookId) params.set("notebook", filters.notebookId);
  if (filters.folderId) params.set("folder", filters.folderId);
  if (filters.pinned) params.set("pinned", "1");
  if (filters.archived) params.set("archived", "1");
  if (filters.tagId) params.set("tag", filters.tagId);

  const base = noteId ? `/workspace/notes/${noteId}` : pathname;
  const qs = params.toString();
  return asRoute(qs ? `${base}?${qs}` : base);
}

export function buildWorkspaceHref(
  current: URLSearchParams,
  patch: Partial<WorkspaceFilters> & {
    clearTag?: boolean;
    clearPinned?: boolean;
    clearArchived?: boolean;
    clearNotebook?: boolean;
    clearFolder?: boolean;
  },
): Route {
  const filters = parseWorkspaceFilters(current);

  const next: WorkspaceFilters = {
    notebookId: patch.clearNotebook
      ? undefined
      : patch.notebookId !== undefined
        ? patch.notebookId
        : filters.notebookId,
    folderId: patch.clearFolder
      ? undefined
      : patch.folderId !== undefined
        ? patch.folderId
        : filters.folderId,
    pinned: patch.pinned !== undefined ? patch.pinned : filters.pinned,
    archived: patch.archived !== undefined ? patch.archived : filters.archived,
    tagId: patch.clearTag
      ? undefined
      : patch.tagId !== undefined
        ? patch.tagId
        : filters.tagId,
  };

  if (patch.clearPinned) next.pinned = false;
  if (patch.clearArchived) next.archived = false;

  return buildWorkspacePath("/workspace", next);
}
