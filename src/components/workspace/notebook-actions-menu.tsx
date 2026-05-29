"use client";

import { FilePlus, Trash2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { REMOVE_NOTEBOOK_MUTATION, WORKSPACE_QUERY } from "@/graphql/operations";
import { notebookDisplayName } from "@/lib/workspace-icons";
import { buildWorkspaceHref } from "@/lib/workspace-url";

export function NotebookActionsMenu({
  notebookId,
  name,
  onNewPage,
}: {
  notebookId: string;
  name: string;
  onNewPage?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [removeNotebook, { loading }] = useMutation(REMOVE_NOTEBOOK_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });

  async function handleDelete() {
    const label = notebookDisplayName(name);
    if (
      !confirm(
        `Zmazať workspace „${label}“? Stránky zostanú, len sa odpoja od workspace.`,
      )
    ) {
      return;
    }
    await removeNotebook({ variables: { id: notebookId } });
    router.push(
      buildWorkspaceHref(searchParams, {
        clearNotebook: true,
        archived: false,
      }),
    );
  }

  return (
    <ItemActionsMenu label="Akcie workspace" contentClassName="w-52">
      {onNewPage && (
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onNewPage();
          }}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Nová stránka
        </DropdownMenuItem>
      )}
      {onNewPage && <DropdownMenuSeparator />}
      <DropdownMenuItem
        disabled={loading}
        className="text-destructive focus:text-destructive"
        onClick={() => void handleDelete()}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Zmazať workspace
      </DropdownMenuItem>
    </ItemActionsMenu>
  );
}
