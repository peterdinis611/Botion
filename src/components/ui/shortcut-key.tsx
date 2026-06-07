"use client";

import { formatForDisplay } from "@tanstack/react-hotkeys";
import { cn } from "@/lib/utils";

export function ShortcutKey({
  keys,
  className,
}: {
  keys: string;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground",
        className,
      )}
    >
      {formatForDisplay(keys)}
    </kbd>
  );
}
