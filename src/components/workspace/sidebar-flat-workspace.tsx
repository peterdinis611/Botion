"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Notebook } from "@/graphql/types";
import { notebookEmoji } from "@/lib/workspace-icons";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function SidebarFlatWorkspace({
  notebooks,
}: {
  notebooks: Notebook[];
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
    );
  }

  return (
    <div className="space-y-0.5">
      {sorted.map((nb) => {
        const active = activeNotebookId === nb.id;
        return (
          <Link
            key={nb.id}
            href={buildWorkspaceHref(searchParams, { notebookId: nb.id, archived: false })}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
            )}
          >
            <span className="w-5 text-center text-base leading-none">
              {notebookEmoji(nb.id, nb.name)}
            </span>
            <span className="truncate">{nb.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
