"use client";

import { useQuery } from "@apollo/client/react";
import { FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WORKSPACE_QUERY } from "@/graphql/operations";
import type { Note, WorkspaceQueryResult } from "@/graphql/types";
import { filterNotesBySearch } from "@/lib/search";
import { sidebarPagePrimary } from "@/lib/workspace-pages";

export function GraphPagePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (note: Pick<Note, "id" | "title">) => void;
}) {
  const [query, setQuery] = useState("");
  const { data, loading } = useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY, {
    skip: !open,
    fetchPolicy: "cache-first",
  });

  const notes = useMemo(() => {
    const list = (data?.notes ?? []).filter((n) => !n.isArchived);
    return filterNotesBySearch(list, query);
  }, [data?.notes, query]);

  function handlePick(note: Note) {
    onSelect({ id: note.id, title: sidebarPagePrimary(note) });
    onOpenChange(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(80vh,520px)] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle>Add workspace page</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && !data ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">Loading pages…</p>
          ) : notes.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {query ? "No pages match your search." : "No pages in this workspace yet."}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => handlePick(note)}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">
                      {sidebarPagePrimary(note)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-3">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
