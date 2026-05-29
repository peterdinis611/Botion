"use client";

import { useState } from "react";
import { CollaboratorAvatars } from "@/components/workspace/collaborator-avatars";
import { NoteActionsMenu } from "@/components/workspace/note-actions-menu";
import { NotificationsPanel } from "@/components/workspace/notifications-panel";
import { PeoplePanel } from "@/components/workspace/people-panel";
import { useWorkspaceCollaborators } from "@/hooks/use-workspace-collaborators";
import { cn } from "@/lib/utils";

export function DocumentHeader({
  title,
  icon,
  noteId,
  noteTitle,
  noteIsArchived,
  noteIsPinned,
  onNoteActionComplete,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  noteId?: string;
  noteTitle?: string;
  noteIsArchived?: boolean;
  noteIsPinned?: boolean;
  onNoteActionComplete?: () => void;
  className?: string;
}) {
  const [peopleOpen, setPeopleOpen] = useState(false);
  const { collaborators, refetch } = useWorkspaceCollaborators(noteId);

  return (
    <>
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-4 border-b border-border/40 px-6 py-3",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {icon}
            </span>
          )}
          <span className="truncate text-[13px] font-medium text-foreground">
            {title}
          </span>
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
              onActionComplete={onNoteActionComplete}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setPeopleOpen(true)}
          >
            People
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
