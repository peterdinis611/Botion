"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { PageTransition } from "@/components/motion/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/workspace/app-sidebar";
import { DemoAccountBanner } from "@/components/workspace/demo-account-banner";
import { CommandPalette } from "@/components/workspace/command-palette";
import { QuickActionsFab } from "@/components/workspace/quick-actions-fab";
import { TRASH_NOTES_QUERY, WORKSPACE_QUERY } from "@/graphql/operations";
import type { WorkspaceQueryResult } from "@/graphql/types";
import { clearLoginGracePeriod } from "@/lib/session-flash";
import { SnapsPanelProvider } from "@/components/workspace/snaps-panel-context";
import { CommandPaletteProvider } from "@/hooks/use-command-palette";
import { useSidebar } from "@/hooks/use-sidebar";
import { ui } from "@/lib/ui-surface";
import { cn } from "@/lib/utils";

export function WorkspaceFrame({
  children,
  className,
  hideQuickFab = false,
}: {
  children: React.ReactNode;
  className?: string;
  hideQuickFab?: boolean;
}) {
  const { collapsed } = useSidebar();
  const { data, loading, error } = useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY);

  useQuery(TRASH_NOTES_QUERY, { fetchPolicy: "cache-first" });

  useEffect(() => {
    if (data && !error) clearLoginGracePeriod();
  }, [data, error]);

  if (loading && !data) {
    return (
      <div className={ui.appShell}>
        <Skeleton className={cn("shrink-0", collapsed ? ui.sidebarCollapsed : ui.sidebarExpanded)} />
        <Skeleton className="flex-1 rounded-none" />
      </div>
    );
  }

  return (
    <CommandPaletteProvider>
      <SnapsPanelProvider>
        <CommandPalette
          notes={data?.notes ?? []}
          notebooks={data?.notebooks ?? []}
          folders={data?.folders ?? []}
        />
        <div className={ui.appShell}>
          <AppSidebar
            notebooks={data?.notebooks ?? []}
            notes={data?.notes ?? []}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-canvas">
            <DemoAccountBanner />
            <PageTransition
              className={cn("flex min-h-0 min-w-0 flex-1", className ?? "flex-col")}
            >
              {children}
            </PageTransition>
          </div>
        </div>
      </SnapsPanelProvider>
    </CommandPaletteProvider>
  );
}
