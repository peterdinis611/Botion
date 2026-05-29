"use client";

import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { SNAPS_QUERY, UPDATE_SNAP_MUTATION } from "@/graphql/operations";
import type { Snap, UpdateSnapResult } from "@/graphql/types";
import { getSnapQueryVariables } from "@/lib/snap-scope";

export function EditSnapDialog({
  snap,
  open,
  onOpenChange,
  notebookId,
  noteId,
}: {
  snap: Snap | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId?: string;
  noteId?: string;
}) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const [updateSnap, { loading }] = useMutation<UpdateSnapResult>(UPDATE_SNAP_MUTATION, {
    refetchQueries: [
      { query: SNAPS_QUERY, variables: getSnapQueryVariables(notebookId, noteId) },
    ],
  });

  useEffect(() => {
    if (!snap || !open) return;
    setTitle(snap.title);
    setCaption(snap.caption ?? "");
  }, [snap, open]);

  async function handleSave() {
    if (!snap) return;
    await updateSnap({
      variables: {
        input: {
          id: snap.id,
          title: title.trim() || "Untitled snap",
          caption: caption.trim() || undefined,
        },
      },
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit snap</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-snap-title">Title</Label>
            <Input
              id="edit-snap-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-snap-caption">Caption</Label>
            <Textarea
              id="edit-snap-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
