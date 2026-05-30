"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Loader2, Pin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BlockEditor } from "@/components/workspace/block-editor";
import { EmojiPicker } from "@/components/workspace/emoji-picker";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import { NoteColorPicker } from "@/components/workspace/note-color-picker";
import { TagPicker } from "@/components/workspace/tag-picker";
import { UPDATE_NOTE_MUTATION } from "@/graphql/operations";
import type { Tag, UpdateNoteResult } from "@/graphql/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useNoteCollaboration } from "@/hooks/use-note-collaboration";
import { removeNoteFromCache, upsertNoteInCache } from "@/lib/cache-updates";
import { joinWithLeadingEmoji, splitLeadingEmoji } from "@/lib/icon-emoji";
import { pushRecentNoteId } from "@/lib/search";
import { cn } from "@/lib/utils";

export type EditorNote = {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  notebookId?: string | null;
  updatedAt: string;
  tags?: Tag[];
};

function parseNoteTitle(stored: string) {
  const { emoji, label } = splitLeadingEmoji(stored);
  const bare = stored.trim();
  if (!bare || bare === "Untitled") {
    return { pageEmoji: emoji ?? "📄", displayTitle: "" };
  }
  return {
    pageEmoji: emoji ?? "📄",
    displayTitle: label || bare,
  };
}

export function NoteEditor({
  note,
  allTags,
}: {
  note: EditorNote;
  allTags: Tag[];
}) {
  const client = useApolloClient();
  const initial = parseNoteTitle(note.title);
  const [displayTitle, setDisplayTitle] = useState(initial.displayTitle);
  const [pageEmoji, setPageEmoji] = useState(initial.pageEmoji);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [saving, setSaving] = useState(false);
  const [editorReloadKey, setEditorReloadKey] = useState(0);
  const lastSaved = useRef({
    title: note.title,
    content: note.content,
    color: note.color,
  });
  const lastSavedUpdatedAt = useRef(note.updatedAt);

  const storedTitle = useMemo(
    () => joinWithLeadingEmoji(pageEmoji, displayTitle),
    [pageEmoji, displayTitle],
  );

  const debouncedTitle = useDebounce(storedTitle, 700);
  const debouncedContent = useDebounce(content, 700);
  const debouncedColor = useDebounce(color, 400);

  const [updateNote] = useMutation<UpdateNoteResult>(UPDATE_NOTE_MUTATION);

  useEffect(() => {
    const parsed = parseNoteTitle(note.title);
    setDisplayTitle(parsed.displayTitle);
    setPageEmoji(parsed.pageEmoji);
    setContent(note.content);
    setColor(note.color);
    setIsPinned(note.isPinned);
    lastSaved.current = {
      title: note.title,
      content: note.content,
      color: note.color,
    };
    lastSavedUpdatedAt.current = note.updatedAt;
    pushRecentNoteId(note.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: note.id only
  }, [note.id]);

  const handleContentChange = useCallback((serialized: string) => {
    setContent(serialized);
  }, []);

  const applyRemoteNote = useCallback(
    (remote: { title?: string; content?: string; updatedAt: string }) => {
      if (remote.title !== undefined) {
        const parsed = parseNoteTitle(remote.title);
        setDisplayTitle(parsed.displayTitle);
        setPageEmoji(parsed.pageEmoji);
        lastSaved.current.title = remote.title;
      }
      if (remote.content !== undefined) {
        setContent(remote.content);
        lastSaved.current.content = remote.content;
        setEditorReloadKey((k) => k + 1);
      }
      lastSavedUpdatedAt.current = remote.updatedAt;
    },
    [],
  );

  useNoteCollaboration(note.id, note.updatedAt, applyRemoteNote);

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
          lastSavedUpdatedAt.current = data.updateNote.updatedAt;
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
    const nextTitle = debouncedTitle || "Untitled";
    if (nextTitle !== lastSaved.current.title) {
      changes.title = nextTitle;
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

  const updatedLabel = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  }).format(
    Math.round(
      (new Date(note.updatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
    "day",
  );

  const hasCustomBg = color !== "#ffffff" && color !== "#1a1a1a";

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col bg-background"
      style={{ backgroundColor: hasCustomBg ? color : undefined }}
    >
      <div className="mx-auto w-full max-w-[740px] flex-1 overflow-y-auto px-6 py-8 pb-24 sm:px-12 sm:py-12">
        {/* Page hero */}
        <section className="mb-10">
          <div className="mb-5 flex items-end gap-4">
            <EmojiPicker
              value={pageEmoji}
              onChange={setPageEmoji}
              size="lg"
              aria-label="Page icon"
            />
            <input
              value={displayTitle}
              onChange={(e) => setDisplayTitle(e.target.value)}
              placeholder="Untitled"
              className="min-w-0 flex-1 border-none bg-transparent pb-0.5 text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground caret-foreground outline-none placeholder:text-muted-foreground/30 sm:text-[2.75rem]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-muted/15 px-3 py-2.5 backdrop-blur-sm">
            <TagPicker
              noteId={note.id}
              selectedTags={note.tags ?? []}
              allTags={allTags}
              notebookId={note.notebookId}
              variant="muted-gold"
            />

            <div className="ml-auto flex items-center gap-0.5">
              {saving ? (
                <span className="mr-2 flex items-center gap-1.5 rounded-md bg-background/60 px-2 py-1 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving…
                </span>
              ) : (
                <span className="mr-1 hidden rounded-md px-2 py-1 text-[11px] text-muted-foreground/75 sm:inline">
                  Edited {updatedLabel}
                </span>
              )}

              <NoteColorPicker color={color} onChange={setColor} />

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", isPinned && "text-tag")}
                onClick={togglePin}
                title={isPinned ? "Unpin" : "Pin"}
              >
                <Pin className="h-3.5 w-3.5" />
              </Button>

              <NoteActionsMenu
                noteId={note.id}
                title={storedTitle}
                isArchived={note.isArchived}
                isPinned={isPinned}
                showPin={false}
                showOpen={false}
                size="md"
                className="opacity-100"
              />
            </div>
          </div>
        </section>

        <section className="note-editor-body">
          <BlockEditor
            key={`${note.id}-${editorReloadKey}`}
            noteId={note.id}
            content={content}
            onChange={handleContentChange}
          />
        </section>
      </div>
    </div>
  );
}
