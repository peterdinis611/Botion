"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPTY_TRASH_MUTATION, TRASH_NOTES_QUERY, WORKSPACE_QUERY } from "@/graphql/operations";
import type { Note } from "@/graphql/types";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import { excerpt } from "@/lib/content";
import { displayStoredTitle, splitLeadingEmoji } from "@/lib/icon-emoji";

function formatDeletedAt(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Dnes";
  if (days === 1) return "Včera";
  if (days < 7) return `Pred ${days} dňami`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TrashView() {
  const [search, setSearch] = useState("");

  const { data, loading, refetch } = useQuery<{ notes: Note[] }>(TRASH_NOTES_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [emptyTrash, { loading: emptying }] = useMutation<{ emptyTrash: number }>(
    EMPTY_TRASH_MUTATION,
    { refetchQueries: [{ query: TRASH_NOTES_QUERY }, { query: WORKSPACE_QUERY }] },
  );

  const notes = data?.notes ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => displayStoredTitle(n.title).toLowerCase().includes(q));
  }, [notes, search]);

  async function handleEmptyTrash() {
    if (notes.length === 0) return;
    if (
      !confirm(
        `Vyprázdniť kôš? Natrvalo sa zmaže ${notes.length} ${notes.length === 1 ? "stránka" : "stránok"}.`,
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
              <h1 className="text-[2rem] font-bold tracking-tight text-foreground">Kôš</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Stránky v koši sa dajú obnoviť alebo natrvalo zmazať.
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
              Vyprázdniť kôš
            </Button>
          )}
        </div>

        {notes.length > 3 && (
          <div className="relative mx-auto mt-5 max-w-[720px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hľadať v koši…"
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
                {search.trim() ? "Žiadne výsledky" : "Kôš je prázdny"}
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                {search.trim()
                  ? "Skúste iný výraz."
                  : "Zmazané stránky sa tu zobrazia po presunutí do koša."}
              </p>
            </div>
          ) : (
            <ul className="space-y-2 pt-4">
              {filtered.map((note) => {
                const { emoji } = splitLeadingEmoji(note.title);
                const noteHref = `/workspace/notes/${note.id}?archived=1`;
                return (
                  <li
                    key={note.id}
                    className="group relative flex items-stretch rounded-xl border border-border/50 bg-card/40 transition-colors hover:border-border hover:bg-card/70"
                  >
                    <Link
                      href={noteHref}
                      className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 pr-12"
                    >
                      <span className="mt-0.5 text-lg leading-none" aria-hidden>
                        {emoji ?? "📄"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {displayStoredTitle(note.title)}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {excerpt(note.content, 80) || "Prázdna stránka"}
                        </p>
                        <p className="mt-1.5 text-[10px] text-muted-foreground/70">
                          {formatDeletedAt(note.updatedAt)}
                        </p>
                      </div>
                    </Link>
                    <div className="absolute right-2 top-2.5">
                      <NoteActionsMenu
                        noteId={note.id}
                        title={note.title}
                        isArchived
                        href={noteHref}
                        showOpen={false}
                        onActionComplete={() => void refetch()}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
