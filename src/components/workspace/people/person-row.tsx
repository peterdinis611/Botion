"use client";

import { Loader2, UserMinus, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkspaceCollaborator } from "@/graphql/types";
import {
  collaboratorBadgeVariant,
  collaboratorColor,
  collaboratorInitials,
  collaboratorLabel,
  collaboratorRoleLabel,
} from "@/lib/collaborator-display";
import { cn } from "@/lib/utils";

type PersonRowAction =
  | { type: "remove"; onClick: () => void; loading?: boolean; label?: string }
  | { type: "cancel"; onClick: () => void; loading?: boolean; label?: string };

export function PersonRow({
  person,
  action,
}: {
  person: WorkspaceCollaborator;
  action?: PersonRowAction;
}) {
  const role = collaboratorRoleLabel(person.status, person.permission);
  const badgeVariant = collaboratorBadgeVariant(person.status);

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border/50 hover:bg-muted/30">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium text-white",
            collaboratorColor(person.id),
            person.status === "PENDING_INVITE" && "opacity-80",
          )}
        >
          {collaboratorInitials(person)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium">{collaboratorLabel(person)}</p>
          <Badge variant={badgeVariant} className="shrink-0 px-1.5 py-0 text-[10px]">
            {role}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{person.email}</p>
      </div>

      {action && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
          disabled={action.loading}
          title={action.label}
          onClick={action.onClick}
        >
          {action.loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : action.type === "cancel" ? (
            <X className="h-4 w-4" />
          ) : (
            <UserMinus className="h-4 w-4" />
          )}
        </Button>
      )}
    </li>
  );
}
