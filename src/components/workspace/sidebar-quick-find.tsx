"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { cn } from "@/lib/utils";

export function SidebarQuickFind({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const { openPalette } = useCommandPalette();

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={openPalette}
        title="Quick find (⌘K)"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground shadow-sm transition-colors hover:bg-sidebar-accent hover:text-foreground",
          className,
        )}
      >
        <Search className="h-4 w-4 opacity-70" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      className={cn(
        "flex w-full items-center gap-2 rounded-md border border-border/80 bg-background/60 px-2.5 py-2 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:bg-sidebar-accent hover:text-foreground",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 opacity-70" />
      <span className="flex-1 truncate">Quick find…</span>
      <kbd className="hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
