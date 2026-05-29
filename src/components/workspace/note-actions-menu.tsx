"use client";

import { Archive, ExternalLink, Pin, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { useNoteActions } from "@/hooks/use-note-actions";
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
  className?: string;
  onActionComplete?: () => void;
}) {
  const router = useRouter();
  const { busy, moveToTrash, restoreFromTrash, togglePin, deletePermanently } =
    useNoteActions({
      onComplete: onActionComplete,
    });

  const noteHref = href ?? `/workspace/notes/${noteId}${isArchived ? "?archived=1" : ""}`;

  function afterTrash() {
    onActionComplete?.();
    if (!isArchived) {
      router.push("/workspace?archived=1");
    }
  }

  return (
    <ItemActionsMenu
      size={size}
      className={cn(className)}
      contentClassName="w-52"
      label="Akcie stránky"
    >
      {showOpen && href && (
        <DropdownMenuItem asChild>
          <Link href={noteHref}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Otvoriť
          </Link>
        </DropdownMenuItem>
      )}

      {showPin && !isArchived && (
        <DropdownMenuItem
          disabled={busy}
          onClick={() => void togglePin(noteId, isPinned)}
        >
          <Pin className="mr-2 h-4 w-4" />
          {isPinned ? "Odopnúť" : "Pripnúť"}
        </DropdownMenuItem>
      )}

      {isArchived ? (
        <DropdownMenuItem
          disabled={busy}
          onClick={() => void restoreFromTrash(noteId)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Obnoviť zo koša
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          disabled={busy}
          onClick={() => void moveToTrash(noteId).then(afterTrash)}
        >
          <Archive className="mr-2 h-4 w-4" />
          Presunúť do koša
        </DropdownMenuItem>
      )}

      <DropdownMenuSeparator />

      <DropdownMenuItem
        disabled={busy}
        className="text-destructive focus:text-destructive"
        onClick={() => void deletePermanently(noteId, title)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Zmazať natrvalo
      </DropdownMenuItem>
    </ItemActionsMenu>
  );
}
