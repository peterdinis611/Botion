import Fuse, { type FuseOptionKey, type IFuseOptions } from "fuse.js";
import { excerpt, stripHtml } from "@/lib/content";
import { displayStoredTitle } from "@/lib/icon-emoji";
import { sidebarPagePrimary } from "@/lib/workspace-pages";

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

const DEFAULT_FUSE_OPTIONS = {
  threshold: 0.45,
  ignoreLocation: true,
  minMatchCharLength: 1,
  distance: 100,
} satisfies IFuseOptions<unknown>;

function fuseSearch<T>(
  items: T[],
  query: string,
  keys: FuseOptionKey<T>[],
  options?: { limit?: number },
): SearchHit<T>[] {
  const q = query.trim();
  if (!q) {
    return items.map((item) => ({ item, score: 1 }));
  }

  const fuse = new Fuse(items, { ...DEFAULT_FUSE_OPTIONS, keys });
  const results = fuse.search(q, options?.limit ? { limit: options.limit } : undefined);

  return results.map((result) => ({
    item: result.item,
    score: 1 - (result.score ?? 1),
  }));
}

type NoteSearchDocument = SearchableNote & {
  titlePlain: string;
  contentPlain: string;
};

function toNoteSearchDocument(note: SearchableNote): NoteSearchDocument {
  return {
    ...note,
    titlePlain: stripHtml(note.title || "Untitled"),
    contentPlain: stripHtml(note.content),
  };
}

const NOTE_SEARCH_KEYS: FuseOptionKey<NoteSearchDocument>[] = [
  { name: "titlePlain", weight: 0.55 },
  { name: "contentPlain", weight: 0.35 },
];

export function searchNotes(
  notes: SearchableNote[],
  query: string,
  limit = 50,
): SearchHit<SearchableNote>[] {
  const q = query.trim();
  if (!q) {
    return [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((item) => ({ item, score: 1 }));
  }

  const docs = notes.map(toNoteSearchDocument);
  const byId = new Map(notes.map((note) => [note.id, note]));

  return fuseSearch(docs, q, NOTE_SEARCH_KEYS, { limit }).map((hit) => ({
    item: byId.get(hit.item.id) ?? hit.item,
    score: hit.score,
  }));
}

export function searchByName<T extends { name: string }>(
  items: T[],
  query: string,
  limit = 50,
): SearchHit<T>[] {
  return fuseSearch(items, query, ["name"], { limit });
}

type SidebarPageSearchDocument = {
  id: string;
  label: string;
  titlePlain: string;
  contentPlain: string;
};

function toSidebarPageDocument(
  note: Pick<SearchableNote, "id" | "title" | "content">,
): SidebarPageSearchDocument {
  return {
    id: note.id,
    label: sidebarPagePrimary(note),
    titlePlain: displayStoredTitle(note.title),
    contentPlain: stripHtml(note.content),
  };
}

const SIDEBAR_PAGE_KEYS: FuseOptionKey<SidebarPageSearchDocument>[] = [
  { name: "label", weight: 0.5 },
  { name: "titlePlain", weight: 0.35 },
  { name: "contentPlain", weight: 0.15 },
];

/** Fuzzy page search for sidebar, graph picker, etc. Returns matching note ids in rank order. */
export function searchPageIds(
  notes: Pick<SearchableNote, "id" | "title" | "content">[],
  query: string,
): string[] {
  const q = query.trim();
  if (!q) return notes.map((note) => note.id);

  const docs = notes.map(toSidebarPageDocument);
  return fuseSearch(docs, q, SIDEBAR_PAGE_KEYS).map((hit) => hit.item.id);
}

export function filterNotesBySearch<T extends Pick<SearchableNote, "id" | "title" | "content">>(
  notes: T[],
  query: string,
): T[] {
  const q = query.trim();
  if (!q) return notes;

  const order = searchPageIds(notes, q);
  const rank = new Map(order.map((id, index) => [id, index]));
  return notes
    .filter((note) => rank.has(note.id))
    .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
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
