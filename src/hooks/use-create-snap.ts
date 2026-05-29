"use client";

import { useMutation } from "@apollo/client/react";
import { CREATE_SNAP_MUTATION, SNAPS_QUERY } from "@/graphql/operations";
import type { CreateSnapResult } from "@/graphql/types";
import { getSnapQueryVariables } from "@/lib/snap-scope";
import { uploadFile } from "@/lib/upload-file";

export function useCreateSnap(notebookId?: string, noteId?: string) {
  const variables = getSnapQueryVariables(notebookId, noteId);

  const [createSnapMutation, { loading }] = useMutation<CreateSnapResult>(
    CREATE_SNAP_MUTATION,
    {
      refetchQueries: [{ query: SNAPS_QUERY, variables }],
    },
  );

  async function createSnapFromFile(
    file: File,
    meta?: { title?: string; caption?: string },
  ) {
    const uploaded = await uploadFile(file);
    const { data } = await createSnapMutation({
      variables: {
        input: {
          fileId: uploaded.id,
          title: meta?.title?.trim() || undefined,
          caption: meta?.caption?.trim() || undefined,
          notebookId: notebookId ?? undefined,
          noteId: noteId ?? undefined,
        },
      },
    });
    return data?.createSnap;
  }

  return { createSnapFromFile, creating: loading };
}
