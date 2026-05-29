"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import {
  REMOVE_NOTE_MUTATION,
  TRASH_NOTES_QUERY,
  UPDATE_NOTE_MUTATION,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type { UpdateNoteResult } from "@/graphql/types";
import { removeNoteFromCache, upsertNoteInCache } from "@/lib/cache-updates";
import { displayStoredTitle } from "@/lib/icon-emoji";

const refetchAll = [
  { query: WORKSPACE_QUERY },
  { query: TRASH_NOTES_QUERY },
];

export function useNoteActions(options?: { onComplete?: () => void }) {
  const client = useApolloClient();
  const [busy, setBusy] = useState(false);
  const [updateNote] = useMutation<UpdateNoteResult>(UPDATE_NOTE_MUTATION);
  const [removeNote] = useMutation(REMOVE_NOTE_MUTATION);

  const wrap = useCallback(
    async (fn: () => Promise<void>) => {
      setBusy(true);
      try {
        await fn();
        options?.onComplete?.();
      } finally {
        setBusy(false);
      }
    },
    [options],
  );

  const moveToTrash = useCallback(
    (noteId: string) =>
      wrap(async () => {
        const { data } = await updateNote({
          variables: { input: { id: noteId, isArchived: true } },
          awaitRefetchQueries: true,
          refetchQueries: refetchAll,
        });
        if (data?.updateNote) {
          upsertNoteInCache(client.cache, { ...data.updateNote, isArchived: true });
        }
      }),
    [client.cache, updateNote, wrap],
  );

  const restoreFromTrash = useCallback(
    (noteId: string) =>
      wrap(async () => {
        const { data } = await updateNote({
          variables: { input: { id: noteId, isArchived: false } },
          awaitRefetchQueries: true,
          refetchQueries: refetchAll,
        });
        if (data?.updateNote) {
          upsertNoteInCache(client.cache, { ...data.updateNote, isArchived: false });
        }
      }),
    [client.cache, updateNote, wrap],
  );

  const togglePin = useCallback(
    (noteId: string, isPinned: boolean) =>
      wrap(async () => {
        const { data } = await updateNote({
          variables: { input: { id: noteId, isPinned: !isPinned } },
          refetchQueries: [{ query: WORKSPACE_QUERY }],
        });
        if (data?.updateNote) {
          upsertNoteInCache(client.cache, data.updateNote);
        }
      }),
    [client.cache, updateNote, wrap],
  );

  const deletePermanently = useCallback(
    async (noteId: string, title?: string) => {
      const label = displayStoredTitle(title ?? "") || "Untitled";
      if (
        !confirm(
          `Permanently delete "${label}"? This cannot be undone.`,
        )
      ) {
        return;
      }
      setBusy(true);
      try {
        await removeNote({
          variables: { id: noteId },
          awaitRefetchQueries: true,
          refetchQueries: refetchAll,
        });
        removeNoteFromCache(client.cache, noteId);
        options?.onComplete?.();
      } finally {
        setBusy(false);
      }
    },
    [client.cache, options, removeNote],
  );

  return {
    busy,
    moveToTrash,
    restoreFromTrash,
    togglePin,
    deletePermanently,
  };
}
