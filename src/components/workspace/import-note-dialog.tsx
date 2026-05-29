"use client";

import { useMutation } from "@apollo/client/react";
import { FileUp, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_NOTE_MUTATION, WORKSPACE_QUERY } from "@/graphql/operations";
import type { CreateNoteResult } from "@/graphql/types";
import { serializeBlockContent } from "@/lib/content";
import { buildWorkspacePath, parseWorkspaceFilters } from "@/lib/workspace-url";

function textToBlockContent(text: string): string {
  const blocks = text.split(/\n\n+/).map((chunk) => ({
    type: "paragraph" as const,
    content: chunk.trim(),
  }));
  return serializeBlockContent(blocks);
}

export function ImportNoteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("Imported note");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createNote] = useMutation<CreateNoteResult>(CREATE_NOTE_MUTATION);

  async function handleImport() {
    const text = body.trim();
    if (!text) {
      setError("Paste text or upload a .txt / .md file.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { data } = await createNote({
        variables: {
          input: {
            title: title.trim() || "Imported note",
            content: textToBlockContent(text),
            notebookId: filters.notebookId,
          },
        },
        refetchQueries: [{ query: WORKSPACE_QUERY }],
      });
      const id = data?.createNote?.id;
      if (id) {
        router.push(buildWorkspacePath("/workspace", filters, id));
        setBody("");
        onOpenChange(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  function handleFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setBody(text);
      if (!title || title === "Imported note") {
        const base = file.name.replace(/\.[^.]+$/, "");
        setTitle(base || "Imported note");
      }
    };
    reader.readAsText(file);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <FileUp className="h-4 w-4" />
            Upload .txt or .md
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          <div className="space-y-2">
            <Label htmlFor="import-title">Title</Label>
            <Input
              id="import-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-body">Content</Label>
            <Textarea
              id="import-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Paste markdown or plain text…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void handleImport()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
