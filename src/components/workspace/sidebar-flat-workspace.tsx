"use client";

import { ChevronRight, FilePlus, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NotebookActionsMenu } from "@/components/workspace/notebook-actions-menu";
import { SidebarSortablePages } from "@/components/workspace/sidebar-sortable-pages";
import type { Note, Notebook } from "@/graphql/types";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
import { groupPagesByNotebook } from "@/lib/workspace-pages";
import { navigateAfterNoteAction } from "@/lib/note-navigation";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function SidebarFlatWorkspace({
  notebooks,
  notes,
  onCreateWorkspace,
  onNewPage,
}: {
  notebooks: Notebook[];
  notes: Note[];
  onCreateWorkspace?: () => void;
  onNewPage?: (notebookId?: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const activeNotebookId = filters.notebookId;
  const pathname = usePathname();
  const isHome = pathname === "/workspace" && !activeNotebookId;

  const { byNotebook, inbox } = useMemo(
    () => groupPagesByNotebook(notes),
    [notes],
  );

  const sorted = [...notebooks].sort((a, b) => a.sortOrder - b.sortOrder);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (activeNotebookId) {
      setExpanded((prev) => new Set(prev).add(activeNotebookId));
    }
  }, [activeNotebookId]);

  useEffect(() => {
    const openNote = notes.find((n) => pathname === `/workspace/notes/${n.id}`);
    if (openNote?.notebookId) {
      setExpanded((prev) => new Set(prev).add(openNote.notebookId!));
    }
  }, [pathname, notes]);

  function toggleExpanded(notebookId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(notebookId)) next.delete(notebookId);
      else next.add(notebookId);
      return next;
    });
  }

  function handlePageAction(action: Parameters<typeof navigateAfterNoteAction>[2]) {
    navigateAfterNoteAction(router, filters, action);
  }

  if (sorted.length === 0) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => router.push("/workspace")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
            isHome
              ? "bg-sidebar-accent font-medium text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
          )}
        >
          <span className="text-base leading-none">🎯</span>
          <span>Acme Inc.</span>
        </button>
        {inbox.length > 0 && (
          <InboxPagesSection
            pages={inbox}
            filters={filters}
            onNewPage={onNewPage}
            onPageAction={handlePageAction}
          />
        )}
        {onCreateWorkspace && (
          <button
            type="button"
            onClick={onCreateWorkspace}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New workspace</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {sorted.map((nb) => {
        const active = activeNotebookId === nb.id;
        const isOpen = expanded.has(nb.id);
        const pages = byNotebook.get(nb.id) ?? [];

        return (
          <div key={nb.id} className="py-0.5">
            <div
              className={cn(
                "group/nb flex items-center gap-0.5 rounded-lg",
                active && !isOpen && "bg-sidebar-accent/60",
              )}
            >
              <button
                type="button"
                aria-label={isOpen ? "Collapse pages" : "Expand pages"}
                onClick={() => toggleExpanded(nb.id)}
                className={cn(
                  "flex h-7 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                  pages.length === 0 && "opacity-30",
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isOpen && "rotate-90",
                  )}
                />
              </button>

              <Link
                href={buildWorkspaceHref(searchParams, {
                  notebookId: nb.id,
                  archived: false,
                })}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-[13px] transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm leading-none">
                  {notebookEmoji(nb.id, nb.name)}
                </span>
                <span className="truncate">{notebookDisplayName(nb.name)}</span>
                {pages.length > 0 && (
                  <span className="ml-auto shrink-0 rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                    {pages.length}
                  </span>
                )}
              </Link>

              <div className="flex shrink-0 items-center pr-0.5">
                {onNewPage && (
                  <button
                    type="button"
                    title="New page"
                    onClick={(e) => {
                      e.preventDefault();
                      onNewPage(nb.id);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/nb:opacity-100"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                  </button>
                )}
                <NotebookActionsMenu
                  notebookId={nb.id}
                  name={nb.name}
                  onNewPage={onNewPage ? () => onNewPage(nb.id) : undefined}
                />
              </div>
            </div>

            {isOpen && (
              <div className="relative ml-[9px] mt-0.5 pl-3 before:absolute before:bottom-2 before:left-0 before:top-1 before:w-px before:bg-border/35">
                <SidebarSortablePages
                  notebookId={nb.id}
                  pages={pages}
                  filters={filters}
                  onNewPage={onNewPage ? () => onNewPage(nb.id) : undefined}
                  onPageAction={handlePageAction}
                />
              </div>
            )}
          </div>
        );
      })}

      {inbox.length > 0 && (
        <InboxPagesSection
          pages={inbox}
          filters={filters}
          onNewPage={onNewPage}
          onPageAction={handlePageAction}
        />
      )}
    </div>
  );
}

function InboxPagesSection({
  pages,
  filters,
  onNewPage,
  onPageAction,
}: {
  pages: Note[];
  filters: ReturnType<typeof parseWorkspaceFilters>;
  onNewPage?: (notebookId?: string) => void;
  onPageAction?: (action: Parameters<typeof navigateAfterNoteAction>[2]) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-3 space-y-0.5 border-t border-border/30 pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <ChevronRight
          className={cn("h-3 w-3 transition-transform", open && "rotate-90")}
        />
        Inbox
        <span className="rounded bg-muted/50 px-1 text-[10px] tabular-nums">
          {pages.length}
        </span>
      </button>
      {open && (
        <div className="ml-1">
          <SidebarSortablePages
            pages={pages}
            filters={filters}
            onNewPage={onNewPage ? () => onNewPage("inbox") : undefined}
            onPageAction={onPageAction}
            emptyLabel="New inbox page"
          />
        </div>
      )}
    </div>
  );
}
