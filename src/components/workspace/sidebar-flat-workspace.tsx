"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NotebookActionsMenu } from "@/components/workspace/notebook-actions-menu";
import type { Notebook } from "@/graphql/types";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function SidebarFlatWorkspace({
  notebooks,
  onCreateWorkspace,
  onNewPage,
}: {
  notebooks: Notebook[];
  onCreateWorkspace?: () => void;
  onNewPage?: (notebookId: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const activeNotebookId = filters.notebookId;
  const pathname = usePathname();
  const isHome = pathname === "/workspace" && !activeNotebookId;

  const sorted = [...notebooks].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => router.push("/workspace")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
            isHome
              ? "bg-sidebar-accent font-medium text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
          )}
        >
          <span className="text-base leading-none">🎯</span>
          <span>Acme Inc.</span>
        </button>
        {onCreateWorkspace && (
          <button
            type="button"
            onClick={onCreateWorkspace}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground"
          >
            <span className="w-5 text-center text-base leading-none">+</span>
            <span>New workspace</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {sorted.map((nb) => {
        const active = activeNotebookId === nb.id;
        return (
          <div key={nb.id} className="group flex items-center gap-0.5">
            <Link
              href={buildWorkspaceHref(searchParams, { notebookId: nb.id, archived: false })}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
              )}
            >
              <span className="w-5 text-center text-base leading-none">
                {notebookEmoji(nb.id, nb.name)}
              </span>
              <span className="truncate">{notebookDisplayName(nb.name)}</span>
            </Link>
            <div className="mr-0.5 flex shrink-0 items-center gap-0.5">
              {onNewPage && (
                <button
                  type="button"
                  title="New page"
                  onClick={(e) => {
                    e.preventDefault();
                    onNewPage(nb.id);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover:opacity-100"
                >
                  +
                </button>
              )}
              <NotebookActionsMenu
                notebookId={nb.id}
                name={nb.name}
                onNewPage={onNewPage ? () => onNewPage(nb.id) : undefined}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
