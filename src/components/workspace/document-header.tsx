"use client";

import { useState } from "react";
import { CollaboratorAvatars } from "@/components/workspace/collaborator-avatars";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import { NotificationsPanel } from "@/components/workspace/notifications-panel";
import { PeoplePanel } from "@/components/workspace/people-panel";
import { useWorkspaceCollaborators } from "@/hooks/use-workspace-collaborators";
import { ui } from "@/lib/ui-surface";
import { cn } from "@/lib/utils";

export function DocumentHeader({
  title,
  icon,
  noteId,
  noteTitle,
  noteIsArchived,
  noteIsPinned,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  noteId?: string;
  noteTitle?: string;
  noteIsArchived?: boolean;
  noteIsPinned?: boolean;
  className?: string;
}) {
  const [peopleOpen, setPeopleOpen] = useState(false);
  const { collaborators, refetch } = useWorkspaceCollaborators(noteId);

  return (
    <>
      <header className={cn(ui.header, className)}>
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
              {title}
            </span>
            {noteId && (
              <span className="text-[11px] text-muted-foreground">Page</span>
            )}
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
              className="opacity-100"
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setPeopleOpen(true)}
          >
            Share
          </button>

          <CollaboratorAvatars
            collaborators={collaborators}
            onClick={() => setPeopleOpen(true)}
          />

          <NotificationsPanel onInviteAccepted={() => void refetch()} />
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
