"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WorkspaceCollaborator } from "@/graphql/types";
import {
  collaboratorColor,
  collaboratorInitials,
  collaboratorLabel,
} from "@/lib/collaborator-display";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 5;

export function CollaboratorAvatars({
  collaborators,
  className,
  onClick,
}: {
  collaborators: WorkspaceCollaborator[];
  className?: string;
  onClick?: () => void;
}) {
  if (collaborators.length === 0) return null;

  const visible = collaborators.slice(0, MAX_VISIBLE);
  const overflow = collaborators.length - visible.length;

  const Wrapper = onClick ? "button" : "div";

  return (
    <TooltipProvider delayDuration={200}>
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={cn(
          "flex -space-x-1.5",
          onClick &&
            "cursor-pointer rounded-full outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        aria-label={onClick ? "Open people" : undefined}
      >
        {visible.map((member) => {
          const pending = member.status === "PENDING_INVITE";
          const canEdit =
            member.permission === "WRITE" || member.status === "NOTE_COLLABORATOR";
          return (
            <Tooltip key={`${member.id}-${member.status}-${member.email}`}>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    "h-7 w-7 border-2 border-background",
                    pending && "border-dashed opacity-80",
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      "text-[10px] font-medium text-white",
                      collaboratorColor(member.id),
                    )}
                  >
                    {collaboratorInitials(member)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">{collaboratorLabel(member)}</p>
                <p className="text-muted-foreground">
                  {pending
                    ? "Invite pending"
                    : canEdit
                      ? "Can edit"
                      : "Workspace member"}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {overflow > 0 && (
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
              +{overflow}
            </AvatarFallback>
          </Avatar>
        )}
      </Wrapper>
    </TooltipProvider>
  );
}
