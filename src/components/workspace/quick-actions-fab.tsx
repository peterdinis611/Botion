"use client";

import { motion } from "framer-motion";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";

export function QuickActionsFab() {
  const { openPalette } = useCommandPalette();
  const { openNewPageDialog, openFolderDialog, openNotebookDialog } = useWorkspaceCreate();

  return (
    <motion.div
      className="pointer-events-none fixed bottom-5 right-80 z-50"
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="pointer-events-auto"
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              aria-label="Quick actions"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-52">
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openNewPageDialog()}>
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
    </motion.div>
  );
}
