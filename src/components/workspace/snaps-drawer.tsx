"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnapsPanel } from "@/components/workspace/snaps-panel";
import { useSnapsPanel } from "@/components/workspace/snaps-panel-context";
import { cn } from "@/lib/utils";

export function SnapsDrawer({
  notebookId,
  noteId,
}: {
  notebookId?: string;
  noteId?: string;
}) {
  const { snapsOpen, setSnapsOpen } = useSnapsPanel();

  return (
    <>
      {snapsOpen && (
        <button
          type="button"
          aria-label="Close Snaps"
          className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSnapsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "absolute right-0 top-0 z-30 flex h-full w-[min(100%,300px)] flex-col border-l border-panel-border bg-panel shadow-2xl transition-transform duration-300 ease-out",
          snapsOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
        aria-hidden={!snapsOpen}
      >
        <div className="flex items-center justify-end border-b border-panel-border px-2 py-1.5 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSnapsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SnapsPanel
          notebookId={notebookId}
          noteId={noteId}
          className="h-full w-full border-0 shadow-none"
        />
      </aside>
    </>
  );
}
