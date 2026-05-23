"use client";

import Link from "next/link";
import {
  Archive,
  CalendarDays,
  FolderPlus,
  Network,
  NotebookPen,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickActionsFab() {
  const { openPalette } = useCommandPalette();
  const { createNewPage, openFolderDialog, openNotebookDialog } =
    useWorkspaceCreate();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="pointer-events-auto h-12 w-12 rounded-full shadow-lg"
            aria-label="Quick actions"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-52">
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void createNewPage()}>
            <Plus className="mr-2 h-4 w-4" />
            New page
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openPalette}>
            <Search className="mr-2 h-4 w-4" />
            Quick find
            <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openNotebookDialog()}>
            <NotebookPen className="mr-2 h-4 w-4" />
            New notebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openFolderDialog()}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/workspace/calendar">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/workspace/graphs">
              <Network className="mr-2 h-4 w-4" />
              Graphs
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/workspace/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/workspace?archived=1">
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
