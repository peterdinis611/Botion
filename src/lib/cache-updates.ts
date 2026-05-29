import type { ApolloCache } from "@apollo/client";
import { NOTE_FIELDS, TRASH_NOTES_QUERY, WORKSPACE_QUERY } from "@/graphql/operations";
import type { Note, WorkspaceQueryResult } from "@/graphql/types";

type TrashQueryResult = { notes: Note[] };

function writeNoteFragment(cache: ApolloCache, note: Note) {
  const id = cache.identify({ __typename: "Note", id: note.id }) ?? `Note:${note.id}`;
  cache.writeFragment({
    id,
    fragment: NOTE_FIELDS,
    fragmentName: "NoteFields",
    data: { __typename: "Note", ...note },
  });
}

function updateWorkspaceNotes(
  cache: ApolloCache,
  updater: (notes: Note[]) => Note[],
) {
  cache.updateQuery<WorkspaceQueryResult>({ query: WORKSPACE_QUERY }, (existing) => {
    if (!existing) return existing;
    return { ...existing, notes: updater(existing.notes ?? []) };
  });
}

function updateTrashNotes(cache: ApolloCache, updater: (notes: Note[]) => Note[]) {
  cache.updateQuery<TrashQueryResult>({ query: TRASH_NOTES_QUERY }, (existing) => {
    const notes = existing?.notes ?? [];
    return { notes: updater(notes) };
  });
}

export function upsertNoteInCache(
  cache: ApolloCache,
  note: Note,
  options?: { remove?: boolean },
) {
  writeNoteFragment(cache, note);

  if (options?.remove) {
    updateWorkspaceNotes(cache, (notes) => notes.filter((n) => n.id !== note.id));
    updateTrashNotes(cache, (notes) => notes.filter((n) => n.id !== note.id));
    return;
  }

  if (note.isArchived) {
    updateWorkspaceNotes(cache, (notes) => notes.filter((n) => n.id !== note.id));
    updateTrashNotes(cache, (notes) => {
      const index = notes.findIndex((n) => n.id === note.id);
      if (index === -1) return [note, ...notes];
      return notes.map((n) => (n.id === note.id ? { ...n, ...note } : n));
    });
    return;
  }

  updateTrashNotes(cache, (notes) => notes.filter((n) => n.id !== note.id));
  updateWorkspaceNotes(cache, (notes) => {
    const index = notes.findIndex((n) => n.id === note.id);
    if (index === -1) return [note, ...notes];
    return notes.map((n) => (n.id === note.id ? { ...n, ...note } : n));
  });
}

export function removeNoteFromCache(cache: ApolloCache, noteId: string) {
  updateWorkspaceNotes(cache, (notes) => notes.filter((n) => n.id !== noteId));
  updateTrashNotes(cache, (notes) => notes.filter((n) => n.id !== noteId));
  cache.evict({ id: cache.identify({ __typename: "Note", id: noteId }) });
  cache.gc();
}
