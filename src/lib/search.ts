import { excerpt, stripHtml } from "@/lib/content";

export type SearchableNote = {
  id: string;
  title: string;
  content: string;
  notebookId?: string | null;
  updatedAt: string;
};

export type SearchableNotebook = {
  id: string;
  name: string;
  folderId?: string | null;
};

export type SearchableFolder = {
  id: string;
  name: string;
};

export type SearchHit<T> = {
  item: T;
  score: number;
};

/** Simple relevance scoring — earlier matches and title matches rank higher. */
export function scoreMatch(text: string, query: string): number {
  const hay = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  if (hay === q) return 100;
  if (hay.startsWith(q)) return 80;
  const idx = hay.indexOf(q);
  if (idx === -1) return 0;
  return Math.max(10, 60 - idx);
}

export function searchNotes(
  notes: SearchableNote[],
  query: string,
): SearchHit<SearchableNote>[] {
  const q = query.trim();
  if (!q) {
    return notes
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((item) => ({ item, score: 1 }));
  }

  return notes
    .map((note) => {
      const titleScore = scoreMatch(note.title || "Untitled", q) * 2;
      const bodyScore = scoreMatch(stripHtml(note.content), q);
      return { item: note, score: titleScore + bodyScore };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function searchByName<T extends { name: string }>(
  items: T[],
  query: string,
): SearchHit<T>[] {
  const q = query.trim();
  if (!q) return items.map((item) => ({ item, score: 1 }));
  return items
    .map((item) => ({ item, score: scoreMatch(item.name, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function noteSearchSubtitle(content: string): string {
  return excerpt(content, 60);
}

const RECENT_KEY = "botion-recent-pages";

export function getRecentNoteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function pushRecentNoteId(noteId: string) {
  const prev = getRecentNoteIds().filter((id) => id !== noteId);
  const next = [noteId, ...prev].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function splitHighlight(
  text: string,
  query: string,
): { before: string; match: string; after: string } | null {
  const q = query.trim();
  if (!q) return null;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return null;
  return {
    before: text.slice(0, idx),
    match: text.slice(idx, idx + q.length),
    after: text.slice(idx + q.length),
  };
}
