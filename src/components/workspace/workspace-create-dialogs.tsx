"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmojiPicker } from "@/components/workspace/emoji-picker";

export function WorkspaceCreateDialogs({
  dialog,
  name,
  emoji,
  onNameChange,
  onEmojiChange,
  onClose,
  onCreate,
}: {
  dialog: "folder" | "notebook" | null;
  name: string;
  emoji: string;
  onNameChange: (value: string) => void;
  onEmojiChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  const isNotebook = dialog === "notebook";
  const title = isNotebook ? "New workspace" : "New folder";
  const placeholder = isNotebook ? "Personal" : "Projects";
  const hint = isNotebook
    ? "Workspaces group your pages and tags in one place."
    : "Folders help organize multiple workspaces.";

  return (
    <Dialog open={dialog !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 overflow-hidden border-border/80 p-0 sm:max-w-[420px]">
        <DialogHeader className="space-y-0 border-b border-border/50 px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">{hint}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5">
          <div className="flex items-start gap-3">
            <EmojiPicker
              value={emoji}
              onChange={onEmojiChange}
              size="lg"
              aria-label="Workspace icon"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="create-name" className="text-[13px] text-muted-foreground">
                Name
              </Label>
              <Input
                id="create-name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="h-10 border-border/70 bg-muted/20"
                onKeyDown={(e) => e.key === "Enter" && onCreate()}
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void onCreate()} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
