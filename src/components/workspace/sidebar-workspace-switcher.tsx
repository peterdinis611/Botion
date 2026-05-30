"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note, Notebook } from "@/graphql/types";
import { groupPagesByNotebook } from "@/lib/workspace-pages";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

const HOME_LABEL = "Acme Inc.";
const HOME_EMOJI = "🎯";

export function SidebarWorkspaceSwitcher({
  notebooks,
  notes,
  onCreateWorkspace,
}: {
  notebooks: Notebook[];
  notes: Note[];
  onCreateWorkspace?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const activeNotebookId = filters.notebookId;

  const sorted = [...notebooks].sort((a, b) => a.sortOrder - b.sortOrder);
  const { byNotebook, inbox } = groupPagesByNotebook(notes);

  const activeNotebook = sorted.find((nb) => nb.id === activeNotebookId);
  const currentLabel = activeNotebook
    ? notebookDisplayName(activeNotebook.name)
    : HOME_LABEL;
  const currentEmoji = activeNotebook
    ? notebookEmoji(activeNotebook.id, activeNotebook.name)
    : HOME_EMOJI;

  function goHome() {
    router.push(
      buildWorkspaceHref(searchParams, {
        clearNotebook: true,
        clearFolder: true,
        clearTag: true,
        archived: false,
        pinned: false,
      }),
    );
  }

  function goNotebook(notebookId: string) {
    router.push(
      buildWorkspaceHref(searchParams, {
        notebookId,
        archived: false,
        clearTag: true,
        clearFolder: true,
        pinned: false,
      }),
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-0.5 text-left outline-none ring-sidebar-ring focus-visible:ring-2"
          aria-label="Switch workspace"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm leading-none">
            {currentEmoji}
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">
            {currentLabel}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={goHome} className="gap-2">
          <span className="text-base leading-none">{HOME_EMOJI}</span>
          <span className="min-w-0 flex-1 truncate">{HOME_LABEL}</span>
          {!activeNotebookId && (
            <Check className="h-4 w-4 shrink-0 text-primary" />
          )}
          <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
            {inbox.length}
          </span>
        </DropdownMenuItem>

        {sorted.length > 0 && <DropdownMenuSeparator />}

        {sorted.map((nb) => {
          const count = (byNotebook.get(nb.id) ?? []).length;
          const isActive = activeNotebookId === nb.id;

          return (
            <DropdownMenuItem
              key={nb.id}
              onClick={() => goNotebook(nb.id)}
              className="gap-2"
            >
              <span className="text-base leading-none">
                {notebookEmoji(nb.id, nb.name)}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {notebookDisplayName(nb.name)}
              </span>
              {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
              <span
                className={cn(
                  "text-[10px] tabular-nums text-muted-foreground",
                  isActive && "ml-0",
                )}
              >
                {count}
              </span>
            </DropdownMenuItem>
          );
        })}

        {onCreateWorkspace && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateWorkspace} className="gap-2">
              <Plus className="h-4 w-4" />
              New workspace
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
