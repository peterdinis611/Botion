"use client";

import { useEffect, useMemo, useRef } from "react";
import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";
import {
  isHtmlContent,
  parseBlockContent,
  serializeBlockContent,
} from "@/lib/content";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

type BlockEditorProps = {
  noteId: string;
  content: string;
  onChange: (serialized: string) => void;
};

function plainTextToBlocks(text: string): PartialBlock[] {
  return text.split("\n").map((line) => ({
    type: "paragraph",
    content: line || "",
  }));
}

export function BlockEditor({ noteId, content, onChange }: BlockEditorProps) {
  const { resolvedTheme } = useTheme();
  const migratedRef = useRef<string | null>(null);

  const initialBlocks = useMemo((): PartialBlock[] | undefined => {
    const blocks = parseBlockContent(content);
    if (blocks) return blocks;
    return undefined;
  }, [noteId]);

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  useEffect(() => {
    if (!editor || migratedRef.current === noteId) return;
    migratedRef.current = noteId;

    const existing = parseBlockContent(content);
    if (existing) {
      editor.replaceBlocks(editor.document, existing);
      return;
    }

    if (!content.trim()) return;

    void (async () => {
      let blocks: PartialBlock[];
      if (isHtmlContent(content)) {
        blocks = await editor.tryParseHTMLToBlocks(content);
      } else {
        blocks = plainTextToBlocks(content);
      }
      editor.replaceBlocks(editor.document, blocks);
    })();
  }, [editor, content, noteId]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(() => {
      onChange(serializeBlockContent(editor.document));
    });

    return () => {
      unsubscribe();
    };
  }, [editor, onChange]);

  return (
    <div className="blocknote-wrapper rounded-lg border border-border/60 bg-card/30">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        className="min-h-[50vh]"
      />
    </div>
  );
}
