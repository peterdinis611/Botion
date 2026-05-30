"use client";

import Link from "next/link";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import type { Note } from "@/graphql/types";
import { splitLeadingEmoji } from "@/lib/icon-emoji";
import type { NoteActionResult } from "@/lib/note-navigation";
import { pageDisplayTitle } from "@/lib/workspace-pages";
import { cn } from "@/lib/utils";

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function PageListItem({
  page,
  href,
  active = false,
  variant = "card",
  onActionComplete,
}: {
  page: Note;
  href: string;
  active?: boolean;
  variant?: "card" | "sidebar";
  onActionComplete?: (action: NoteActionResult) => void;
}) {
  const { emoji } = splitLeadingEmoji(page.title);
  const title = pageDisplayTitle(page);

  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "group/page flex items-center gap-0.5 rounded-md pr-0.5",
          active && "bg-sidebar-accent",
        )}
      >
        <Link
          href={href}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 truncate px-2 py-1.5 text-[12px] transition-colors",
            active
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="shrink-0 text-[11px] leading-none">{emoji ?? "📄"}</span>
          <span className="truncate">{title}</span>
        </Link>
        <NoteActionsMenu
          noteId={page.id}
          title={page.title}
          isArchived={page.isArchived}
          isPinned={page.isPinned}
          showOpen={false}
          showPin={false}
          size="sm"
          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover/page:opacity-100"
          onActionComplete={onActionComplete}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/page flex items-stretch border-b border-border/40 last:border-b-0 transition-colors",
        active && "bg-primary/5",
      )}
    >
      <Link
        href={href}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 hover:bg-muted/30"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-base leading-none">
          {emoji ?? "📄"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">
            Updated {formatRelative(page.updatedAt)}
          </span>
        </span>
      </Link>
      <div className="flex shrink-0 items-center pr-3 opacity-0 transition-opacity group-hover/page:opacity-100">
        <NoteActionsMenu
          noteId={page.id}
          title={page.title}
          isArchived={page.isArchived}
          isPinned={page.isPinned}
          showOpen={false}
          showPin={false}
          size="sm"
          className="opacity-100"
          onActionComplete={onActionComplete}
        />
      </div>
    </div>
  );
}
