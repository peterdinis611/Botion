"use client";

import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { WorkspaceTopBar } from "@/components/workspace/workspace-top-bar";
import { ui } from "@/lib/ui-surface";
import { cn } from "@/lib/utils";

export function WorkspaceSectionShell({
  title,
  icon,
  children,
  notebookId,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  notebookId?: string;
  className?: string;
}) {
  return (
    <WorkspaceFrame>
      <div className={cn(ui.canvas, "relative flex min-h-0 min-w-0 flex-1 flex-col")}>
        <WorkspaceTopBar title={title} icon={icon} notebookId={notebookId} />

        <div className={cn("relative flex min-h-0 flex-1", className)}>{children}</div>
      </div>
    </WorkspaceFrame>
  );
}
