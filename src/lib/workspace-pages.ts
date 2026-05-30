import type { Note, Notebook } from "@/graphql/types";
import { excerpt } from "@/lib/content";
import { displayStoredTitle } from "@/lib/icon-emoji";

export function sortPagesByUpdated(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    if (a.sortOrder !== b.sortOrder) {
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function formatPageAge(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function pageDisplayTitle(note: Pick<Note, "title">): string {
  return displayStoredTitle(note.title, "Untitled");
}

/** Sidebar label: prefer title, else first words of content, else Untitled + age. */
export function sidebarPagePrimary(note: Pick<Note, "title" | "content">): string {
  const title = pageDisplayTitle(note);
  if (title !== "Untitled") return title;
  const preview = excerpt(note.content, 32);
  if (preview) return preview;
  return "Untitled";
}

export function sidebarPageNeedsAge(note: Pick<Note, "title" | "content">): boolean {
  return pageDisplayTitle(note) === "Untitled" && !excerpt(note.content, 1);
}

export function groupPagesByNotebook(notes: Note[]) {
  const byNotebook = new Map<string, Note[]>();
  const inbox: Note[] = [];

  for (const note of notes) {
    if (!note.notebookId) {
      inbox.push(note);
      continue;
    }
    const list = byNotebook.get(note.notebookId) ?? [];
    list.push(note);
    byNotebook.set(note.notebookId, list);
  }

  for (const [id, list] of byNotebook) {
    byNotebook.set(id, sortPagesByUpdated(list));
  }

  return {
    byNotebook,
    inbox: sortPagesByUpdated(inbox),
  };
}

export function pagesForNotebook(notes: Note[], notebookId?: string): Note[] {
  if (!notebookId) {
    return sortPagesByUpdated(notes.filter((n) => !n.notebookId));
  }
  return sortPagesByUpdated(notes.filter((n) => n.notebookId === notebookId));
}

export function notebookPageCount(
  byNotebook: Map<string, Note[]>,
  notebookId: string,
): number {
  return byNotebook.get(notebookId)?.length ?? 0;
}

export function ensureExpandedNotebook(
  expanded: Set<string>,
  notebookId: string,
): Set<string> {
  if (expanded.has(notebookId)) return expanded;
  const next = new Set(expanded);
  next.add(notebookId);
  return next;
}

export type NotebookWithPages = Notebook & { pageCount: number };

export function notebooksWithPageCounts(
  notebooks: Notebook[],
  byNotebook: Map<string, Note[]>,
): NotebookWithPages[] {
  return notebooks.map((nb) => ({
    ...nb,
    pageCount: notebookPageCount(byNotebook, nb.id),
  }));
}
