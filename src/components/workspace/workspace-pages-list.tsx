"use client";

import { FilePlus, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageListItem } from "@/components/workspace/page-list-item";
import { pageDisplayTitle, pagesForNotebook } from "@/lib/workspace-pages";
import type { Note } from "@/graphql/types";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { navigateAfterNoteAction } from "@/lib/note-navigation";
import { buildWorkspacePath, parseWorkspaceFilters, type WorkspaceFilters } from "@/lib/workspace-url";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function WorkspacePagesList({
  notes,
  notebookId,
  filters,
  compact = false,
}: {
  notes: Note[];
  notebookId?: string;
  filters: WorkspaceFilters;
  compact?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsedFilters = parseWorkspaceFilters(searchParams);
  const { openNewPageDialog } = useWorkspaceCreate();
  const pages = pagesForNotebook(notes, notebookId);

  function handleAction(action: Parameters<typeof navigateAfterNoteAction>[2]) {
    navigateAfterNoteAction(router, parsedFilters, action);
  }

  if (pages.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn(
          "rounded-xl border border-dashed border-border/60 bg-gradient-to-b from-muted/25 to-muted/10 text-center",
          compact ? "px-4 py-8" : "px-8 py-12",
        )}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 shadow-sm">
          <FileText className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-semibold text-foreground">No pages in this workspace</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Create a page to capture notes, docs, and ideas. Deleted pages always go to trash first.
        </p>
        <Button
          size="sm"
          className="mt-5 gap-1.5"
          onClick={() => openNewPageDialog(notebookId)}
        >
          <FilePlus className="h-4 w-4" />
          New page
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary/70" />
          <h2 className="text-sm font-semibold text-foreground">
            Pages
            <span className="ml-1.5 font-normal tabular-nums text-muted-foreground">
              {pages.length}
            </span>
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => openNewPageDialog(notebookId)}
        >
          <FilePlus className="h-3.5 w-3.5" />
          New page
        </Button>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-xl border border-border/50 bg-card/40 shadow-sm"
      >
        {pages.map((page) => {
          const href = buildWorkspacePath(
            "/workspace",
            {
              ...filters,
              notebookId: page.notebookId ?? notebookId,
              archived: false,
              pinned: false,
            },
            page.id,
          );

          return (
            <motion.li key={page.id} variants={fadeUp} className="list-none">
              <PageListItem
                page={page}
                href={href}
                onActionComplete={handleAction}
              />
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
