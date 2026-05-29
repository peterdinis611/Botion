"use client";

import { useQuery } from "@apollo/client/react";
import { WORKSPACE_COLLABORATORS_QUERY } from "@/graphql/operations";
import type { WorkspaceCollaboratorsQueryResult } from "@/graphql/types";

export function useWorkspaceCollaborators(noteId?: string) {
  const { data, loading, refetch } = useQuery<WorkspaceCollaboratorsQueryResult>(
    WORKSPACE_COLLABORATORS_QUERY,
    {
      variables: { noteId: noteId ?? null },
      fetchPolicy: "cache-and-network",
    },
  );

  const collaborators = (data?.workspaceCollaborators ?? []).filter(
    (c) => c.status !== "SELF",
  );

  return { collaborators, all: data?.workspaceCollaborators ?? [], loading, refetch };
}
