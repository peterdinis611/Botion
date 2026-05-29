"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Archive, Loader2, Pin, Plus, RotateCcw, Trash2, Type } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BlockEditor } from "@/components/workspace/block-editor";
import { NoteColorPicker } from "@/components/workspace/note-color-picker";
import { TagPicker } from "@/components/workspace/tag-picker";
import { REMOVE_NOTE_MUTATION, UPDATE_NOTE_MUTATION } from "@/graphql/operations";
import type { Tag, UpdateNoteResult } from "@/graphql/types";
import { useDebounce } from "@/hooks/use-debounce";
import { removeNoteFromCache, upsertNoteInCache } from "@/lib/cache-updates";
import { pushRecentNoteId } from "@/lib/search";
import { cn } from "@/lib/utils";

export type EditorNote = {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: string;
  tags?: Tag[];
};

export function NoteEditor({
  note,
  allTags,
  onDeleted,
}: {
  note: EditorNote;
  allTags: Tag[];
  onDeleted?: () => void;
}) {
  const client = useApolloClient();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [saving, setSaving] = useState(false);
  const lastSaved = useRef({
    title: note.title,
    content: note.content,
    color: note.color,
  });

  const debouncedTitle = useDebounce(title, 700);
  const debouncedContent = useDebounce(content, 700);
  const debouncedColor = useDebounce(color, 400);

  const [updateNote] = useMutation<UpdateNoteResult>(UPDATE_NOTE_MUTATION);
  const [removeNote] = useMutation(REMOVE_NOTE_MUTATION);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setIsPinned(note.isPinned);
    lastSaved.current = {
      title: note.title,
      content: note.content,
      color: note.color,
    };
    pushRecentNoteId(note.id);
  }, [note.id, note.title, note.content, note.color, note.isPinned]);

  const persist = useCallback(
    async (patch: {
      title?: string;
      content?: string;
      color?: string;
      isPinned?: boolean;
      isArchived?: boolean;
    }) => {
      setSaving(true);
      try {
        const { data } = await updateNote({
          variables: {
            input: {
              id: note.id,
              ...patch,
            },
          },
        });
        if (data?.updateNote) {
          upsertNoteInCache(client.cache, data.updateNote);
          if (patch.title !== undefined) lastSaved.current.title = patch.title;
          if (patch.content !== undefined) lastSaved.current.content = patch.content;
          if (patch.color !== undefined) lastSaved.current.color = patch.color;
        }
      } finally {
        setSaving(false);
      }
    },
    [client.cache, note.id, updateNote],
  );

  useEffect(() => {
    const changes: {
      title?: string;
      content?: string;
      color?: string;
    } = {};
    if (debouncedTitle !== lastSaved.current.title) {
      changes.title = debouncedTitle || "Untitled";
    }
    if (debouncedContent !== lastSaved.current.content) {
      changes.content = debouncedContent;
    }
    if (debouncedColor !== lastSaved.current.color) {
      changes.color = debouncedColor;
    }
    if (Object.keys(changes).length > 0) {
      void persist(changes);
    }
  }, [debouncedTitle, debouncedContent, debouncedColor, persist]);

  async function togglePin() {
    const next = !isPinned;
    setIsPinned(next);
    await persist({ isPinned: next });
  }

  async function archiveNote() {
    await persist({ isArchived: true });
    onDeleted?.();
  }

  async function restoreNote() {
    await persist({ isArchived: false });
    onDeleted?.();
  }

  async function deleteNote() {
    await removeNote({ variables: { id: note.id } });
    removeNoteFromCache(client.cache, note.id);
    onDeleted?.();
  }

  const updatedLabel = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  }).format(
    Math.round(
      (new Date(note.updatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
    "day",
  );

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col bg-background"
      style={{ backgroundColor: color !== "#ffffff" && color !== "#1a1a1a" ? color : undefined }}
    >
      <div className="mx-auto w-full max-w-[720px] flex-1 overflow-y-auto px-10 py-10 pb-24">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="mb-3 w-full border-none bg-transparent text-[2rem] font-bold leading-tight tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
        />

        <div className="mb-8">
          <TagPicker
            noteId={note.id}
            selectedTags={note.tags ?? []}
            allTags={allTags}
            variant="muted-gold"
          />
        </div>

        <BlockEditor noteId={note.id} content={content} onChange={setContent} />
      </div>

      <div className="pointer-events-none absolute bottom-8 left-10 z-10 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto h-10 w-10 rounded-full border border-border/60 bg-[#2a2a2a] shadow-none hover:bg-[#333]"
          aria-label="Add block"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto h-10 w-10 rounded-full border border-border/60 bg-[#2a2a2a] shadow-none hover:bg-[#333]"
          aria-label="Text formatting"
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>

      {saving && (
        <div className="absolute right-6 top-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </div>
      )}

      <div className="absolute right-4 top-3 flex items-center gap-0.5 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100">
        <NoteColorPicker color={color} onChange={setColor} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={togglePin}
          title={isPinned ? "Unpin" : "Pin"}
        >
          <Pin className={cn("h-3.5 w-3.5", isPinned && "text-tag")} />
        </Button>
        {note.isArchived ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={restoreNote} title="Restore">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={archiveNote} title="Archive">
            <Archive className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={deleteNote}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        <span className="sr-only">Edited {updatedLabel}</span>
      </div>
    </div>
  );
}
