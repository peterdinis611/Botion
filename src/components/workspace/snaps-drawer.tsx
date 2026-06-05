"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnapsPanel } from "@/components/workspace/snaps-panel";
import { useSnapsPanel } from "@/components/workspace/snaps-panel-context";
import { drawerSlide, springBounceSoft } from "@/lib/motion";
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
    <AnimatePresence>
      {snapsOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close Snaps"
            className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[1px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSnapsOpen(false)}
          />

          <motion.aside
            className={cn(
              "absolute right-0 top-0 z-30 flex h-full w-[min(100%,300px)] flex-col border-l border-panel-border bg-panel shadow-2xl",
            )}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerSlide}
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
            <motion.div
              className="min-h-0 flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springBounceSoft, delay: 0.06 }}
            >
              <SnapsPanel
                notebookId={notebookId}
                noteId={noteId}
                className="h-full w-full border-0 shadow-none"
              />
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
