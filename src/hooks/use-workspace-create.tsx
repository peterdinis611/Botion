"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { WorkspaceCreateDialogs } from "@/components/workspace/workspace-create-dialogs";
import { ALL_PICKER_EMOJIS } from "@/lib/emoji-picker-data";
import { joinWithLeadingEmoji, pickRandomEmoji } from "@/lib/icon-emoji";
import {
  CREATE_FOLDER_MUTATION,
  CREATE_NOTE_MUTATION,
  CREATE_NOTEBOOK_MUTATION,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type {
  CreateFolderResult,
  CreateNotebookResult,
  CreateNoteResult,
} from "@/graphql/types";

type CreateDialog = "folder" | "notebook" | null;

type WorkspaceCreateContextValue = {
  openFolderDialog: () => void;
  openNotebookDialog: (folderId?: string) => void;
  createNewPage: (notebookId?: string) => Promise<void>;
};

const WorkspaceCreateContext = createContext<WorkspaceCreateContextValue | null>(null);

export function WorkspaceCreateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<CreateDialog>(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [targetFolderId, setTargetFolderId] = useState<string | undefined>();

  const resetDialog = useCallback(() => {
    setDialog(null);
    setName("");
    setEmoji(pickRandomEmoji(ALL_PICKER_EMOJIS));
    setTargetFolderId(undefined);
  }, []);

  const refetch = [{ query: WORKSPACE_QUERY }];

  const [createNote] = useMutation<CreateNoteResult>(CREATE_NOTE_MUTATION, {
    refetchQueries: refetch,
  });
  const [createNotebook] = useMutation<CreateNotebookResult>(CREATE_NOTEBOOK_MUTATION, {
    refetchQueries: refetch,
  });
  const [createFolder] = useMutation<CreateFolderResult>(CREATE_FOLDER_MUTATION, {
    refetchQueries: refetch,
  });

  const openFolderDialog = useCallback(() => {
    setDialog("folder");
    setName("");
    setEmoji(pickRandomEmoji(ALL_PICKER_EMOJIS));
    setTargetFolderId(undefined);
  }, []);

  const openNotebookDialog = useCallback((folderId?: string) => {
    setDialog("notebook");
    setTargetFolderId(folderId);
    setName("");
    setEmoji(pickRandomEmoji(ALL_PICKER_EMOJIS));
  }, []);

  const createNewPage = useCallback(
    async (notebookId?: string) => {
      const { data } = await createNote({
        variables: {
          input: {
            title: "Untitled",
            content: "",
            notebookId,
          },
        },
      });
      const note = data?.createNote;
      if (note?.id) {
        const qs = notebookId ? `?notebook=${notebookId}` : "";
        router.push(`/workspace/notes/${note.id}${qs}`);
      }
    },
    [createNote, router],
  );

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const displayName = joinWithLeadingEmoji(emoji, trimmed);

    try {
      if (dialog === "folder") {
        await createFolder({
          variables: { input: { name: displayName, color: "#64748b" } },
        });
      } else if (dialog === "notebook") {
        const { data } = await createNotebook({
          variables: {
            input: {
              name: displayName,
              color: "#94a3b8",
              folderId: targetFolderId,
            },
          },
        });
        const notebookId = data?.createNotebook?.id;
        if (notebookId) {
          router.push(`/workspace?notebook=${notebookId}`);
        }
      }
    } finally {
      resetDialog();
    }
  }

  const value = useMemo(
    () => ({
      openFolderDialog,
      openNotebookDialog,
      createNewPage,
    }),
    [openFolderDialog, openNotebookDialog, createNewPage],
  );

  return (
    <WorkspaceCreateContext.Provider value={value}>
      {children}
      <WorkspaceCreateDialogs
        dialog={dialog}
        name={name}
        emoji={emoji}
        onNameChange={setName}
        onEmojiChange={setEmoji}
        onClose={resetDialog}
        onCreate={handleCreate}
      />
    </WorkspaceCreateContext.Provider>
  );
}

export function useWorkspaceCreate() {
  const ctx = useContext(WorkspaceCreateContext);
  if (!ctx) {
    throw new Error("useWorkspaceCreate must be used within WorkspaceCreateProvider");
  }
  return ctx;
}
