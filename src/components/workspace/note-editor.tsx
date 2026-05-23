"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { Archive, Loader2, Pin, RotateCcw, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { BlockEditor } from "@/components/workspace/block-editor";
import { TagPicker } from "@/components/workspace/tag-picker";
import { NoteColorPicker } from "@/components/workspace/note-color-picker";
import { Button } from "@/components/ui/button";
import {
  REMOVE_NOTE_MUTATION,
  UPDATE_NOTE_MUTATION,
} from "@/graphql/operations";
import type { Tag, UpdateNoteResult } from "@/graphql/types";
import { removeNoteFromCache, upsertNoteInCache } from "@/lib/cache-updates";
import { pushRecentNoteId } from "@/lib/search";

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
          if (patch.content !== undefined)
            lastSaved.current.content = patch.content;
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
      className="flex h-full flex-1 flex-col bg-background"
      style={{ backgroundColor: color !== "#ffffff" ? color : undefined }}
    >
      <div className="flex items-center justify-between border-b border-border/80 bg-background/80 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </>
          ) : (
            <span>Edited {updatedLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <NoteColorPicker color={color} onChange={setColor} />
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePin}
            className={isPinned ? "text-primary" : ""}
          >
            <Pin className="h-4 w-4" />
            {isPinned ? "Pinned" : "Pin"}
          </Button>
          {note.isArchived ? (
            <Button variant="ghost" size="sm" onClick={restoreNote}>
              <RotateCcw className="h-4 w-4" />
              Restore
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={archiveNote}>
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={deleteNote}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="mb-2 w-full border-none bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
        />

        <div className="mb-6">
          <TagPicker
            noteId={note.id}
            selectedTags={note.tags ?? []}
            allTags={allTags}
          />
        </div>

        <BlockEditor noteId={note.id} content={content} onChange={setContent} />
      </div>
    </div>
  );
}
