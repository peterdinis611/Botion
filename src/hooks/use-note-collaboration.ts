"use client";

import { useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { APP_EVENT_SUBSCRIPTION } from "@/graphql/operations";
import type { AppEventPayload, Note } from "@/graphql/types";

type RemoteNotePatch = Pick<Note, "id" | "title" | "content" | "updatedAt">;

export function useNoteCollaboration(
  noteId: string,
  serverUpdatedAt: string,
  onRemoteUpdate: (patch: RemoteNotePatch) => void,
) {
  const { isReady, isAuthenticated } = useAuth();
  const lastAppliedUpdatedAt = useRef(serverUpdatedAt);

  useEffect(() => {
    lastAppliedUpdatedAt.current = serverUpdatedAt;
  }, [noteId, serverUpdatedAt]);

  const applyRemote = useCallback(
    (remote: RemoteNotePatch) => {
      const remoteTs = new Date(remote.updatedAt).getTime();
      const appliedTs = new Date(lastAppliedUpdatedAt.current).getTime();
      if (remoteTs <= appliedTs) return;

      lastAppliedUpdatedAt.current = remote.updatedAt;
      onRemoteUpdate(remote);
    },
    [onRemoteUpdate],
  );

  const shouldSubscribe = isReady && isAuthenticated && Boolean(noteId);

  useSubscription<AppEventPayload>(APP_EVENT_SUBSCRIPTION, {
    skip: !shouldSubscribe,
    variables: { actions: ["NOTE_UPDATED", "NOTE_SHARED"] },
    onData: ({ data }) => {
      const event = data.data?.appEvent;
      const remote = event?.note;
      if (!remote || remote.id !== noteId) return;
      if (event?.action === "NOTE_UPDATED" || event?.action === "NOTE_SHARED") {
        applyRemote(remote);
      }
    },
  });
}
