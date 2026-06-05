"use client";

import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import type { Note, Notebook } from "@/graphql/types";
import { filterNotesBySearch } from "@/lib/search";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
import { sidebarPagePrimary } from "@/lib/workspace-pages";

export function useSidebarPageFilter(notes: Note[], query: string) {
  return useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return filterNotesBySearch(notes, q);
  }, [notes, query]);
}

export function SidebarWorkspaceSearch({
  notebooks,
  notes,
  query,
  onQueryChange,
}: {
  notebooks: Notebook[];
  notes: Note[];
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const filtered = useSidebarPageFilter(notes, query);
  const sorted = [...notebooks].sort((a, b) => a.sortOrder - b.sortOrder);

  const matchCount = filtered?.length ?? 0;

  return (
    <div className="mb-2 space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Find a page…"
          className="h-8 border-border/60 bg-background/80 pl-8 pr-8 text-[13px] shadow-none focus-visible:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {filtered && (
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border/40 bg-card/50 p-1.5">
          {matchCount === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No pages match &ldquo;{query.trim()}&rdquo;
            </p>
          ) : (
            filtered.map((note) => {
              const nb = sorted.find((n) => n.id === note.notebookId);
              return (
                <a
                  key={note.id}
                  href={`/workspace/notes/${note.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] hover:bg-sidebar-accent"
                >
                  <span className="truncate font-medium text-foreground">
                    {sidebarPagePrimary(note)}
                  </span>
                  {nb && (
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                      {notebookEmoji(nb.id, nb.name)}{" "}
                      {notebookDisplayName(nb.name)}
                    </span>
                  )}
                </a>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function filterNotesForSidebar(notes: Note[], query: string): Note[] {
  return filterNotesBySearch(notes, query);
}
