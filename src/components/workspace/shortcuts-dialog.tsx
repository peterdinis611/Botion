"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShortcutsView } from "@/components/workspace/shortcuts-view";
import { useShortcutsDialog } from "@/hooks/use-shortcuts-dialog";

export function ShortcutsDialog() {
  const { open, setOpen } = useShortcutsDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="shrink-0 space-y-1 px-6 pb-2 pt-6 text-left">
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Quick reference for navigation, search, and editor actions across Botion.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-1 px-6 pb-6">
          <ShortcutsView />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
