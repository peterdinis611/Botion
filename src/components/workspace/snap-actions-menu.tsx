"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";

export function SnapActionsMenu({
  onEdit,
  onDelete,
  deleting = false,
  className,
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  className?: string;
}) {
  return (
    <ItemActionsMenu
      label="Akcie snapu"
      className={className}
      contentClassName="w-44"
    >
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        Upraviť
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={deleting}
        className="text-destructive focus:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Zmazať
      </DropdownMenuItem>
    </ItemActionsMenu>
  );
}
