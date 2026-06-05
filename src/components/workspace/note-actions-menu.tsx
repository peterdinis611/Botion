"use client";

import { Archive, ExternalLink, Pin, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { useNoteActions } from "@/hooks/use-note-actions";
import {
  navigateAfterNoteAction,
  type NoteActionResult,
} from "@/lib/note-navigation";
import { asRoute } from "@/lib/routes";
import { parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function NoteActionsMenu({
  noteId,
  title,
  isArchived = false,
  isPinned = false,
  href,
  size = "sm",
  showPin = true,
  showOpen = true,
  showDeleteInMenu = true,
  className,
  onActionComplete,
}: {
  noteId: string;
  title?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  href?: string;
  size?: "sm" | "md";
  showPin?: boolean;
  showOpen?: boolean;
  /** When false (e.g. trash row with inline buttons), hide trash-only actions from ⋯ menu */
  showDeleteInMenu?: boolean;
  className?: string;
  onActionComplete?: (action: NoteActionResult) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const { busy, moveToTrash, restoreFromTrash, togglePin, deletePermanently } =
    useNoteActions();

  const noteHref = href ?? `/workspace/notes/${noteId}${isArchived ? "?archived=1" : ""}`;

  async function handleMoveToTrash() {
    await moveToTrash(noteId);
    if (!isArchived) {
      navigateAfterNoteAction(router, filters, "trash");
    }
    onActionComplete?.("trash");
  }

  async function handleRestore() {
    await restoreFromTrash(noteId);
    navigateAfterNoteAction(router, filters, "restore");
    onActionComplete?.("restore");
  }

  async function handleDeletePermanently() {
    await deletePermanently(noteId, title);
    navigateAfterNoteAction(router, filters, "permanent-delete");
    onActionComplete?.("permanent-delete");
  }

  if (!showDeleteInMenu && isArchived) {
    return null;
  }

  return (
    <ItemActionsMenu
      size={size}
      className={cn(className)}
      contentClassName="w-52"
      label="Page actions"
    >
      {showOpen && href && (
        <DropdownMenuItem asChild>
          <Link href={asRoute(noteHref)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Link>
        </DropdownMenuItem>
      )}

      {showPin && !isArchived && (
        <DropdownMenuItem
          disabled={busy}
          onClick={() => void togglePin(noteId, isPinned)}
        >
          <Pin className="mr-2 h-4 w-4" />
          {isPinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
      )}

      {isArchived ? (
        <>
          <DropdownMenuItem
            disabled={busy}
            onClick={() => void handleRestore()}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={busy}
            className="text-destructive focus:text-destructive"
            onClick={() => void handleDeletePermanently()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete permanently
          </DropdownMenuItem>
        </>
      ) : (
        <DropdownMenuItem
          disabled={busy}
          className="text-destructive focus:text-destructive"
          onClick={() => void handleMoveToTrash()}
        >
          <Archive className="mr-2 h-4 w-4" />
          Move to trash
        </DropdownMenuItem>
      )}
    </ItemActionsMenu>
  );
}
