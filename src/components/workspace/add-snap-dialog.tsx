"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { useSnapsPanelOptional } from "@/components/workspace/snaps-panel-context";
import { useCreateSnap } from "@/hooks/use-create-snap";
import { cn } from "@/lib/utils";

export function AddSnapDialog({
  open,
  onOpenChange,
  notebookId,
  noteId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId?: string;
  noteId?: string;
  onCreated?: (snapId: string) => void;
}) {
  const panel = useSnapsPanelOptional();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { createSnapFromFile, creating } = useCreateSnap(notebookId, noteId);

  function reset() {
    setTitle("");
    setCaption("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    panel?.clearPrefillFile();
  }

  function handleFileChange(next: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
    setError(null);
  }

  useEffect(() => {
    if (!open || !panel?.prefillFile) return;
    handleFileChange(panel.prefillFile);
    panel.clearPrefillFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, panel?.prefillFile]);

  async function handleSubmit() {
    if (!file) {
      setError("Choose an image first.");
      return;
    }

    setError(null);
    try {
      const snap = await createSnapFromFile(file, { title, caption });
      if (snap?.id) onCreated?.(snap.id);
      reset();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create snap");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add snap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-10 transition-colors hover:bg-muted/40",
              preview && "py-4",
            )}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 w-full rounded-lg object-contain"
              />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload, or paste / drag an image
                </span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          <div className="space-y-2">
            <Label htmlFor="snap-title">Title</Label>
            <Input
              id="snap-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled snap"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snap-caption">Caption</Label>
            <Textarea
              id="snap-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={creating || !file}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Add snap"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
