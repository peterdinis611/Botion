"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { NewPageDialog } from "@/components/workspace/new-page-dialog";
import { WorkspaceCreateDialogs } from "@/components/workspace/workspace-create-dialogs";
import { ALL_PICKER_EMOJIS } from "@/lib/emoji-picker-data";
import { joinWithLeadingEmoji, pickRandomEmoji } from "@/lib/icon-emoji";
import {
  buildNewNotePath,
  resolvePageDestination,
  type PageDestination,
} from "@/lib/create-page";
import { BLANK_PAGE_STARTER } from "@/lib/page-starters";
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
  WorkspaceQueryResult,
} from "@/graphql/types";
import { parseWorkspaceFilters } from "@/lib/workspace-url";

type CreateDialog = "folder" | "notebook" | null;

export type CreatePageOptions = {
  notebookId?: string;
  title?: string;
  content?: string;
};

type WorkspaceCreateContextValue = {
  openFolderDialog: () => void;
  openNotebookDialog: (folderId?: string) => void;
  openNewPageDialog: (notebookId?: string) => void;
  /** Quick create: blank page in the resolved notebook (URL context or argument). */
  createNewPage: (notebookId?: string) => Promise<void>;
  createPage: (options?: CreatePageOptions) => Promise<string | undefined>;
};

const WorkspaceCreateContext = createContext<WorkspaceCreateContextValue | null>(null);

export function WorkspaceCreateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);

  const { data: workspaceData } = useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY);
  const notebooks = workspaceData?.notebooks ?? [];

  const [dialog, setDialog] = useState<CreateDialog>(null);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [newPageNotebookHint, setNewPageNotebookHint] = useState<string | undefined>();
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

  const navigateToNote = useCallback(
    (noteId: string, destination: PageDestination) => {
      router.push(buildNewNotePath(noteId, filters, destination));
    },
    [router, filters],
  );

  const createPage = useCallback(
    async (options?: CreatePageOptions): Promise<string | undefined> => {
      const destination = resolvePageDestination(notebooks, {
        preferredNotebookId: options?.notebookId,
        urlNotebookId: filters.notebookId,
      });

      const { data } = await createNote({
        variables: {
          input: {
            title: options?.title ?? BLANK_PAGE_STARTER.title,
            content: options?.content ?? BLANK_PAGE_STARTER.content,
            notebookId: destination.notebookId ?? undefined,
          },
        },
      });

      const noteId = data?.createNote?.id;
      if (noteId) {
        navigateToNote(noteId, destination);
      }
      return noteId;
    },
    [createNote, notebooks, filters.notebookId, navigateToNote],
  );

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

  const openNewPageDialog = useCallback((notebookId?: string) => {
    setNewPageNotebookHint(notebookId ?? filters.notebookId);
    setNewPageOpen(true);
  }, [filters.notebookId]);

  const createNewPage = useCallback(
    async (notebookId?: string) => {
      await createPage({ notebookId });
    },
    [createPage],
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
          setNewPageNotebookHint(notebookId);
          setNewPageOpen(true);
        }
      }
    } catch (error) {
      console.error("[workspace create]", error);
    } finally {
      resetDialog();
    }
  }

  const value = useMemo(
    () => ({
      openFolderDialog,
      openNotebookDialog,
      openNewPageDialog,
      createNewPage,
      createPage,
    }),
    [openFolderDialog, openNotebookDialog, openNewPageDialog, createNewPage, createPage],
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
      <NewPageDialog
        open={newPageOpen}
        onOpenChange={setNewPageOpen}
        filters={filters}
        defaultNotebookId={newPageNotebookHint}
        onCreated={(noteId, destination) => navigateToNote(noteId, destination)}
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
