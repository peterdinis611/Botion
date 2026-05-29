"use client";

import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ItemActionsMenu({
  children,
  align = "end",
  side = "bottom",
  label = "More actions",
  size = "sm",
  className,
  contentClassName,
  onTriggerClick,
}: {
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  label?: string;
  size?: "sm" | "md";
  className?: string;
  contentClassName?: string;
  onTriggerClick?: (e: React.MouseEvent) => void;
}) {
  const btnClass =
    size === "md"
      ? "h-8 w-8"
      : "h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(btnClass, "shrink-0 text-muted-foreground hover:text-foreground", className)}
          aria-label={label}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTriggerClick?.(e);
          }}
        >
          <MoreHorizontal className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn("w-48", contentClassName)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
