"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Archive, Pin, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWorkspaceHref } from "@/lib/workspace-url";
import type { Tag as TagType } from "@/graphql/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function NoteListFilters({ tags }: { tags: TagType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pinned = searchParams.get("pinned") === "1";
  const archived = searchParams.get("archived") === "1";
  const tagId = searchParams.get("tag");
  const activeTag = tags.find((t) => t.id === tagId);

  const hasFilters = pinned || archived || Boolean(tagId);

  function navigate(patch: Parameters<typeof buildWorkspaceHref>[1]) {
    router.push(buildWorkspaceHref(searchParams, patch));
  }

  function togglePinned() {
    navigate({ pinned: !pinned, archived: archived && !pinned ? false : archived });
  }

  function toggleArchived() {
    navigate({
      archived: !archived,
      pinned: pinned && !archived ? false : pinned,
    });
  }

  function selectTag(id: string | undefined) {
    if (id) {
      navigate({ tagId: id });
    } else {
      navigate({ clearTag: true });
    }
  }

  function clearAll() {
    router.push(
      buildWorkspaceHref(searchParams, {
        pinned: false,
        archived: false,
        clearTag: true,
      }),
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={pinned} onClick={togglePinned} icon={Pin}>
          Pinned
        </FilterChip>
        <FilterChip active={archived} onClick={toggleArchived} icon={Archive}>
          Archive
        </FilterChip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors",
                activeTag
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Tag className="h-3 w-3" />
              {activeTag ? activeTag.name : "Tag"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tags.length === 0 ? (
              <DropdownMenuItem disabled>No tags yet</DropdownMenuItem>
            ) : (
              tags.map((tag) => (
                <DropdownMenuItem
                  key={tag.id}
                  onClick={() => selectTag(tag.id)}
                  className="gap-2"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 truncate">{tag.name}</span>
                  {tagId === tag.id && (
                    <span className="text-[10px] text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))
            )}
            {tagId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => selectTag(undefined)}>
                  Clear tag filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-muted-foreground"
            onClick={clearAll}
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </button>
  );
}
