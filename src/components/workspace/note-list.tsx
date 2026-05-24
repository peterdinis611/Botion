"use client";

import { Pin, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { NoteListFilters } from "@/components/workspace/note-list-filters";
import type { Tag } from "@/graphql/types";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { excerpt } from "@/lib/content";
import { cn } from "@/lib/utils";

export type NoteListItem = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  updatedAt: string;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NoteList({
  notes,
  search,
  onSearchChange,
  title,
  totalCount,
  tags = [],
  loading = false,
}: {
  notes: NoteListItem[];
  search: string;
  onSearchChange: (value: string) => void;
  title: string;
  totalCount?: number;
  tags?: Tag[];
  loading?: boolean;
}) {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();
  const isFiltering = search.trim().length > 0;

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background/50">
      <div className="space-y-2 border-b border-border px-3 py-3">
        <div className="flex items-baseline justify-between gap-2 px-0.5">
          <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {isFiltering
              ? `${notes.length} of ${totalCount ?? notes.length}`
              : `${notes.length} pages`}
          </span>
        </div>

        <NoteListFilters tags={tags} />

        <div className="relative">
          <SlidersHorizontal className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter this list…"
            className="h-9 rounded-lg border-border/80 bg-muted/40 pl-8 pr-8 text-sm shadow-none focus-visible:ring-1"
          />
          {isFiltering && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear text filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={openPalette}
          className="w-full text-left text-[11px] text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          Search everywhere with ⌘K
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="space-y-2 p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg p-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="px-2 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {isFiltering ? "No matching pages" : "No pages for this filter"}
              </p>
              {!isFiltering && (
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0 text-primary"
                  onClick={openPalette}
                >
                  Quick find or create
                </Button>
              )}
            </div>
          ) : (
            <StaggerList>
              {notes.map((note) => {
                const href = `/workspace/notes/${note.id}`;
                const active = pathname === href;
                return (
                  <StaggerItem key={note.id}>
                    <Link
                      href={href}
                      className={cn(
                        "mb-0.5 block rounded-lg px-3 py-2.5 transition-colors",
                        active ? "bg-sidebar-accent shadow-sm" : "hover:bg-muted/60",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {note.isPinned && (
                          <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium leading-snug text-foreground">
                            {note.title || "Untitled"}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {excerpt(note.content, 100)}
                          </p>
                          <p className="mt-1.5 text-[10px] font-medium text-muted-foreground/70">
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerList>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
