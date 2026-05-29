"use client";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";
import { isHtmlContent, parseBlockContent, serializeBlockContent } from "@/lib/content";
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
  const loadedNoteIdRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useCreateBlockNote({
    placeholders: {
      default: "Start writing, or type '/' for commands…",
      emptyDocument: "Start writing, or type '/' for commands…",
    },
  });

  const loadContent = useCallback(
    async (serialized: string) => {
      if (!editor) return;

      const existing = parseBlockContent(serialized);
      if (existing) {
        editor.replaceBlocks(editor.document, existing);
        return;
      }

      if (!serialized.trim()) {
        editor.replaceBlocks(editor.document, [{ type: "paragraph", content: "" }]);
        return;
      }

      let blocks: PartialBlock[];
      if (isHtmlContent(serialized)) {
        blocks = await editor.tryParseHTMLToBlocks(serialized);
      } else {
        blocks = plainTextToBlocks(serialized);
      }
      editor.replaceBlocks(editor.document, blocks);
    },
    [editor],
  );

  useEffect(() => {
    if (!editor || loadedNoteIdRef.current === noteId) return;
    loadedNoteIdRef.current = noteId;
    void loadContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, noteId, loadContent]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(() => {
      onChangeRef.current(serializeBlockContent(editor.document));
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);

  return (
    <div className="blocknote-wrapper blocknote-notion -mx-1 mt-1">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        className="min-h-[58vh]"
      />
    </div>
  );
}
