"use client";

import { Clock, FileText, FolderOpen, Plus, Search, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SearchHighlight } from "@/components/workspace/search-highlight";
import type { Note, WorkspaceQueryResult } from "@/graphql/types";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { displayStoredTitle } from "@/lib/icon-emoji";
import { notebookDisplayName } from "@/lib/workspace-icons";
import { buildWorkspaceHref } from "@/lib/workspace-url";
import {
  getRecentNoteIds,
  noteSearchSubtitle,
  pushRecentNoteId,
  searchByName,
  searchNotes,
} from "@/lib/search";

export function CommandPalette({
  notes,
  notebooks,
  folders,
}: {
  notes: Note[];
  notebooks: WorkspaceQueryResult["notebooks"];
  folders: WorkspaceQueryResult["folders"];
}) {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const { openNewPageDialog, createNewPage } = useWorkspaceCreate();
  const [query, setQuery] = useState("");

  const notebookMap = useMemo(
    () => new Map(notebooks.map((nb) => [nb.id, notebookDisplayName(nb.name)])),
    [notebooks],
  );

  const recentNotes = useMemo(() => {
    const ids = getRecentNoteIds();
    return ids
      .map((id) => notes.find((n) => n.id === id))
      .filter((n): n is Note => Boolean(n));
  }, [notes, open]);

  const noteResults = useMemo(
    () => searchNotes(notes, query).slice(0, 12),
    [notes, query],
  );
  const notebookResults = useMemo(
    () => searchByName(notebooks, query).slice(0, 8),
    [notebooks, query],
  );
  const folderResults = useMemo(
    () => searchByName(folders, query).slice(0, 6),
    [folders, query],
  );

  const showRecent = !query.trim() && recentNotes.length > 0;
  const hasResults =
    noteResults.length > 0 ||
    notebookResults.length > 0 ||
    folderResults.length > 0 ||
    showRecent;

  function navigateToNote(id: string) {
    pushRecentNoteId(id);
    setOpen(false);
    setQuery("");
    router.push(`/workspace/notes/${id}`);
  }

  function navigate(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  function handleNewNote(notebookId?: string) {
    setOpen(false);
    setQuery("");
    openNewPageDialog(notebookId);
  }

  function handleQuickBlank(notebookId?: string) {
    setOpen(false);
    setQuery("");
    void createNewPage(notebookId);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
      commandValue={query}
      onCommandValueChange={setQuery}
    >
      <CommandInput placeholder="Search pages, notebooks, folders…" />
      <CommandList className="max-h-[min(420px,50vh)]">
        {!hasResults && query.trim() && (
          <CommandEmpty className="py-8">
            <p className="text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              Try another keyword or create a new page
            </p>
          </CommandEmpty>
        )}

        {!query.trim() && !showRecent && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Type to search · ↑↓ to navigate · Enter to open
          </p>
        )}

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleNewNote()}>
            <Plus className="h-4 w-4" />
            New page
          </CommandItem>
          <CommandItem onSelect={() => navigate("/workspace")}>
            <Search className="h-4 w-4" />
            All notes
          </CommandItem>
          <CommandItem onSelect={() => navigate("/workspace?pinned=1")}>
            <Star className="h-4 w-4" />
            Pinned
          </CommandItem>
          <CommandItem
            onSelect={() =>
              navigate(
                buildWorkspaceHref(new URLSearchParams(), {
                  archived: true,
                  clearNotebook: true,
                  clearFolder: true,
                  clearTag: true,
                  pinned: false,
                }),
              )
            }
          >
            <Trash2 className="h-4 w-4" />
            Trash
          </CommandItem>
        </CommandGroup>

        {showRecent && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              {recentNotes.map((note) => (
                <CommandItem
                  key={note.id}
                  value={`recent-${note.id}-${note.title}`}
                  onSelect={() => navigateToNote(note.id)}
                >
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{displayStoredTitle(note.title)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {noteSearchSubtitle(note.content)}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {noteResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Pages (${noteResults.length})`}>
              {noteResults.map(({ item: note }) => (
                <CommandItem
                  key={note.id}
                  value={`note-${note.id}-${note.title}`}
                  onSelect={() => navigateToNote(note.id)}
                  className="items-start py-2.5"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium leading-snug">
                      <SearchHighlight
                        text={displayStoredTitle(note.title)}
                        query={query}
                      />
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      <SearchHighlight
                        text={noteSearchSubtitle(note.content)}
                        query={query}
                      />
                    </p>
                    {note.notebookId && notebookMap.has(note.notebookId) && (
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        {notebookMap.get(note.notebookId)}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {notebookResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Notebooks">
              {notebookResults.map(({ item: nb }) => (
                <CommandItem
                  key={nb.id}
                  value={`notebook-${nb.id}-${nb.name}`}
                  onSelect={() => navigate(`/workspace?notebook=${nb.id}`)}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: nb.color }}
                  />
                  <SearchHighlight text={notebookDisplayName(nb.name)} query={query} />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {folderResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Folders">
              {folderResults.map(({ item: folder }) => (
                <CommandItem
                  key={folder.id}
                  value={`folder-${folder.id}-${folder.name}`}
                  onSelect={() => navigate(`/workspace?folder=${folder.id}`)}
                >
                  <FolderOpen
                    className="h-4 w-4 shrink-0"
                    style={{ color: folder.color }}
                  />
                  <SearchHighlight text={folder.name} query={query} />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
