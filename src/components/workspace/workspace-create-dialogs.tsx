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

export function WorkspaceCreateDialogs({
  dialog,
  name,
  onNameChange,
  onClose,
  onCreate,
}: {
  dialog: "folder" | "notebook" | null;
  name: string;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <Dialog open={dialog !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {dialog === "folder" ? "New folder" : "New notebook"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter a name for the new {dialog === "folder" ? "folder" : "notebook"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="create-name">Name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={dialog === "folder" ? "Projects" : "Personal"}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
