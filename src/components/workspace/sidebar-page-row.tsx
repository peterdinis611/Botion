"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pin } from "lucide-react";
import Link from "next/link";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import type { Note } from "@/graphql/types";
import { splitLeadingEmoji } from "@/lib/icon-emoji";
import { asRoute } from "@/lib/routes";
import type { NoteActionResult } from "@/lib/note-navigation";
import {
  formatPageAge,
  sidebarPageNeedsAge,
  sidebarPagePrimary,
} from "@/lib/workspace-pages";
import { cn } from "@/lib/utils";

function PageRowContent({
  page,
  href,
  active = false,
  onActionComplete,
  dragHandle,
}: {
  page: Note;
  href: string;
  active?: boolean;
  onActionComplete?: (action: NoteActionResult) => void;
  dragHandle?: React.ReactNode;
}) {
  const { emoji } = splitLeadingEmoji(page.title);
  const label = sidebarPagePrimary(page);
  const showAge = sidebarPageNeedsAge(page);
  const age = formatPageAge(page.updatedAt);

  return (
    <div
      className={cn(
        "group/page relative flex min-h-[30px] items-center rounded-md",
        active && "bg-sidebar-accent/90",
        !active && "hover:bg-sidebar-accent/50",
      )}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden
        />
      )}

      {dragHandle}

      <Link
        href={asRoute(href)}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 py-1.5 pl-1 pr-1 text-[12px] leading-tight",
          active ? "font-medium text-foreground" : "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center text-[10px] leading-none",
            active ? "opacity-100" : "opacity-70 group-hover/page:opacity-100",
          )}
        >
          {emoji ?? "📄"}
        </span>

        <span className="flex min-w-0 flex-1 items-baseline gap-1">
          <span className="truncate">{label}</span>
          {showAge && (
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground/55">
              · {age}
            </span>
          )}
        </span>

        {page.isPinned && (
          <Pin className="h-3 w-3 shrink-0 text-tag opacity-70" aria-label="Pinned" />
        )}
      </Link>

      <NoteActionsMenu
        noteId={page.id}
        title={page.title}
        isArchived={page.isArchived}
        isPinned={page.isPinned}
        showOpen={false}
        showPin={false}
        size="sm"
        className={cn(
          "mr-0.5 h-6 w-6 shrink-0",
          active
            ? "opacity-60 hover:opacity-100 data-[state=open]:opacity-100"
            : "opacity-0 group-hover/page:opacity-60 hover:!opacity-100 data-[state=open]:opacity-100",
        )}
        onActionComplete={onActionComplete}
      />
    </div>
  );
}

export function SidebarPageRow(props: {
  page: Note;
  href: string;
  active?: boolean;
  onActionComplete?: (action: NoteActionResult) => void;
}) {
  return <PageRowContent {...props} />;
}

export function SortableSidebarPageRow(props: {
  page: Note;
  href: string;
  active?: boolean;
  onActionComplete?: (action: NoteActionResult) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "relative z-20 opacity-80 shadow-sm")}
    >
      <PageRowContent
        {...props}
        dragHandle={
          <button
            type="button"
            className="flex h-6 w-4 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground/35 opacity-0 transition-opacity hover:text-muted-foreground active:cursor-grabbing group-hover/page:opacity-100"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
            onClick={(e) => e.preventDefault()}
          >
            <GripVertical className="h-3 w-3" />
          </button>
        }
      />
    </div>
  );
}
