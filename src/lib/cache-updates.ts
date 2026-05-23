import type { ApolloCache } from "@apollo/client";
import { NOTE_FIELDS, WORKSPACE_QUERY } from "@/graphql/operations";
import type { Note, WorkspaceQueryResult } from "@/graphql/types";

export function upsertNoteInCache(
  cache: ApolloCache,
  note: Note,
  options?: { remove?: boolean },
) {
  const id =
    cache.identify({ __typename: "Note", id: note.id }) ?? `Note:${note.id}`;
  cache.writeFragment({
    id,
    fragment: NOTE_FIELDS,
    fragmentName: "NoteFields",
    data: { __typename: "Note", ...note },
  });

  cache.updateQuery<WorkspaceQueryResult>(
    { query: WORKSPACE_QUERY },
    (existing) => {
      if (!existing) return existing;
      const notes = existing.notes ?? [];

      if (options?.remove) {
        return {
          ...existing,
          notes: notes.filter((n) => n.id !== note.id),
        };
      }

      const index = notes.findIndex((n) => n.id === note.id);
      const nextNotes =
        index === -1
          ? [note, ...notes]
          : notes.map((n) => (n.id === note.id ? { ...n, ...note } : n));

      return { ...existing, notes: nextNotes };
    },
  );
}

export function removeNoteFromCache(cache: ApolloCache, noteId: string) {
  cache.updateQuery<WorkspaceQueryResult>(
    { query: WORKSPACE_QUERY },
    (existing) => {
      if (!existing) return existing;
      return {
        ...existing,
        notes: existing.notes.filter((n) => n.id !== noteId),
      };
    },
  );
  cache.evict({ id: cache.identify({ __typename: "Note", id: noteId }) });
  cache.gc();
}
