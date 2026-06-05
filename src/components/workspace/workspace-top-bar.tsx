"use client";

import { CalendarDays, FilePlus, Home, Images, Network, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CollaboratorAvatars } from "@/components/workspace/collaborator-avatars";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import { NotificationsPanel } from "@/components/workspace/notifications-panel";
import { PeoplePanel } from "@/components/workspace/people-panel";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useSnapsPanel } from "@/components/workspace/snaps-panel-context";
import { useWorkspaceCollaborators } from "@/hooks/use-workspace-collaborators";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { asRoute } from "@/lib/routes";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function WorkspaceTopBar({
  title,
  icon,
  noteId,
  noteTitle,
  noteIsArchived,
  noteIsPinned,
  notebookId,
  showSnapsToggle = true,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  noteId?: string;
  noteTitle?: string;
  noteIsArchived?: boolean;
  noteIsPinned?: boolean;
  notebookId?: string;
  showSnapsToggle?: boolean;
  className?: string;
}) {
  const [peopleOpen, setPeopleOpen] = useState(false);
  const { openPalette } = useCommandPalette();
  const { openNewPageDialog } = useWorkspaceCreate();
  const { snapsOpen, toggleSnaps } = useSnapsPanel();
  const { collaborators, refetch } = useWorkspaceCollaborators(noteId);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);

  const navItems = [
    { href: "/workspace", label: "Home", icon: Home, active: pathname === "/workspace" && !filters.archived },
    { href: "/workspace/calendar", label: "Calendar", icon: CalendarDays, active: pathname === "/workspace/calendar" },
    { href: "/workspace/graphs", label: "Graphs", icon: Network, active: pathname.startsWith("/workspace/graphs") },
    {
      href: buildWorkspaceHref(searchParams, {
        archived: true,
        pinned: false,
        clearTag: true,
        clearNotebook: true,
        clearFolder: true,
      }),
      label: "Trash",
      icon: Trash2,
      active: Boolean(filters.archived),
      onClick: () =>
        router.push(
          buildWorkspaceHref(searchParams, {
            archived: true,
            pinned: false,
            clearTag: true,
            clearNotebook: true,
            clearFolder: true,
          }),
        ),
    },
  ] as const;

  return (
    <>
      <header
        className={cn(
          "flex shrink-0 items-center gap-3 border-b border-border/50 bg-background/90 px-4 py-2 backdrop-blur-md sm:px-5",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">{title}</p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {noteId ? "Page" : "Workspace"}
            </p>
          </div>
          {noteId && (
            <NoteActionsMenu
              noteId={noteId}
              title={noteTitle}
              isArchived={noteIsArchived}
              isPinned={noteIsPinned}
              showOpen={false}
              showPin={false}
              size="sm"
            />
          )}
        </div>

        <nav className="hidden shrink-0 items-center gap-0.5 rounded-xl border border-border/50 bg-muted/30 p-0.5 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            if ("onClick" in item && item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    item.active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                href={asRoute(item.href)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  item.active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={openPalette}
          className="hidden min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/70 sm:flex sm:max-w-xs lg:max-w-sm"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span>Search pages…</span>
          <kbd className="ml-auto rounded border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:hidden"
            onClick={openPalette}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {showSnapsToggle && (
            <Button
              variant={snapsOpen ? "secondary" : "ghost"}
              size="sm"
              className="hidden gap-1.5 sm:inline-flex"
              onClick={toggleSnaps}
            >
              <Images className="h-4 w-4" />
              Snaps
            </Button>
          )}

          <button
            type="button"
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
            onClick={() => setPeopleOpen(true)}
          >
            Share
          </button>

          <CollaboratorAvatars
            collaborators={collaborators}
            onClick={() => setPeopleOpen(true)}
          />

          <NotificationsPanel onInviteAccepted={() => void refetch()} />

          <Button
            size="sm"
            className="ml-1 gap-1.5 rounded-xl"
            onClick={() => openNewPageDialog(notebookId)}
          >
            <FilePlus className="h-4 w-4" />
            <span className="hidden sm:inline">New page</span>
          </Button>
        </div>
      </header>

      <PeoplePanel
        open={peopleOpen}
        onOpenChange={setPeopleOpen}
        pageTitle={title}
        noteId={noteId}
        onChanged={() => void refetch()}
      />
    </>
  );
}
