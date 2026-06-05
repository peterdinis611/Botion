"use client";

import { SnapsDrawer } from "@/components/workspace/snaps-drawer";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { WorkspaceTopBar } from "@/components/workspace/workspace-top-bar";
import { ui } from "@/lib/ui-surface";
import { cn } from "@/lib/utils";

export function WorkspaceSectionShell({
  title,
  icon,
  children,
  notebookId,
  showSnapsToggle = true,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  notebookId?: string;
  showSnapsToggle?: boolean;
  className?: string;
}) {
  return (
    <WorkspaceFrame hideQuickFab>
      <div className={cn(ui.canvas, "relative flex min-h-0 min-w-0 flex-1 flex-col")}>
        <WorkspaceTopBar
          title={title}
          icon={icon}
          notebookId={notebookId}
          showSnapsToggle={showSnapsToggle}
        />

        <div className={cn("relative flex min-h-0 flex-1", className)}>
          {children}
          <SnapsDrawer notebookId={notebookId} />
        </div>
      </div>
    </WorkspaceFrame>
  );
}
