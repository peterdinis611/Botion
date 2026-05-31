"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPTY_TRASH_MUTATION, TRASH_NOTES_QUERY, WORKSPACE_QUERY } from "@/graphql/operations";
import type { Note } from "@/graphql/types";
import { useNoteActions } from "@/hooks/use-note-actions";
import { excerpt } from "@/lib/content";
import { displayStoredTitle, splitLeadingEmoji } from "@/lib/icon-emoji";
import { filterNotesBySearch } from "@/lib/search";
import { cn } from "@/lib/utils";

function formatDeletedAt(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function TrashNoteRow({
  note,
  onChanged,
}: {
  note: Note;
  onChanged: () => void;
}) {
  const { busy, restoreFromTrash, deletePermanently } = useNoteActions();
  const { emoji } = splitLeadingEmoji(note.title);
  const noteHref = `/workspace/notes/${note.id}?archived=1`;

  return (
    <li className="group flex items-stretch gap-2 rounded-xl border border-border/50 bg-card/40 transition-colors hover:border-border hover:bg-card/70">
      <Link
        href={noteHref}
        className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5"
      >
        <span className="mt-0.5 text-lg leading-none" aria-hidden>
          {emoji ?? "📄"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">
            {displayStoredTitle(note.title)}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {excerpt(note.content, 80) || "Empty page"}
          </p>
          <p className="mt-1.5 text-[10px] text-muted-foreground/70">
            {formatDeletedAt(note.updatedAt)}
          </p>
        </div>
      </Link>
      <div className="flex shrink-0 flex-col justify-center gap-1.5 pr-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          disabled={busy}
          onClick={() => void restoreFromTrash(note.id).then(onChanged)}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Restore
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
          )}
          disabled={busy}
          onClick={() => void deletePermanently(note.id, note.title).then(onChanged)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete permanently
        </Button>
      </div>
    </li>
  );
}

export function TrashView() {
  const [search, setSearch] = useState("");

  const { data, loading, refetch } = useQuery<{ notes: Note[] }>(TRASH_NOTES_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [emptyTrash, { loading: emptying }] = useMutation<{ emptyTrash: number }>(
    EMPTY_TRASH_MUTATION,
    { refetchQueries: [{ query: TRASH_NOTES_QUERY }, { query: WORKSPACE_QUERY }] },
  );

  const notes = data?.notes ?? [];

  const filtered = useMemo(
    () => filterNotesBySearch(notes, search),
    [notes, search],
  );

  async function handleEmptyTrash() {
    if (notes.length === 0) return;
    const countLabel = notes.length === 1 ? "1 page" : `${notes.length} pages`;
    if (
      !confirm(
        `Empty trash? This will permanently delete ${countLabel}. This cannot be undone.`,
      )
    ) {
      return;
    }
    await emptyTrash();
    await refetch();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border/40 px-8 py-8 sm:px-12">
        <div className="mx-auto flex max-w-[720px] flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="text-2xl leading-none" aria-hidden>
                🗑️
              </span>
              <h1 className="text-[2rem] font-bold tracking-tight text-foreground">Trash</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Pages stay here until you restore them or delete them permanently from trash.
            </p>
          </div>
          {notes.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={emptying}
              onClick={() => void handleEmptyTrash()}
            >
              {emptying ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-3.5 w-3.5" />
              )}
              Empty trash
            </Button>
          )}
        </div>

        {notes.length > 3 && (
          <div className="relative mx-auto mt-5 max-w-[720px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trash…"
              className="h-9 max-w-sm border-border/60 bg-muted/20"
            />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[720px] px-8 pb-16 sm:px-12">
          {loading && notes.length === 0 ? (
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-3 text-4xl opacity-40" aria-hidden>
                🗑️
              </span>
              <p className="text-sm font-medium text-foreground">
                {search.trim() ? "No results" : "Trash is empty"}
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                {search.trim()
                  ? "Try a different search."
                  : "Deleted pages appear here after you move them to trash."}
              </p>
            </div>
          ) : (
            <ul className="space-y-2 pt-4">
              {filtered.map((note) => (
                <TrashNoteRow
                  key={note.id}
                  note={note}
                  onChanged={() => void refetch()}
                />
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
