"use client";

import { useQuery } from "@apollo/client/react";
import { CommandPaletteProvider } from "@/hooks/use-command-palette";
import { AppSidebar } from "@/components/workspace/app-sidebar";
import { CommandPalette } from "@/components/workspace/command-palette";
import { QuickActionsFab } from "@/components/workspace/quick-actions-fab";
import { WORKSPACE_QUERY } from "@/graphql/operations";
import type { WorkspaceQueryResult } from "@/graphql/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export function WorkspaceFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  const { data, loading } = useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY);

  if (loading && !data) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Skeleton
          className={cn(
            "shrink-0",
            collapsed ? "w-[52px]" : "w-[260px]",
          )}
        />
        <Skeleton className="flex-1" />
      </div>
    );
  }

  return (
    <CommandPaletteProvider>
      <CommandPalette
        notes={data?.notes ?? []}
        notebooks={data?.notebooks ?? []}
        folders={data?.folders ?? []}
      />
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar
          folders={data?.folders ?? []}
          notebooks={data?.notebooks ?? []}
          tags={data?.tags ?? []}
        />
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1",
            className ?? "flex-col",
          )}
        >
          {children}
        </div>
      </div>
      <QuickActionsFab />
    </CommandPaletteProvider>
  );
}
