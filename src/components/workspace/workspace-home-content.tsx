"use client";

import { PenLine, Sparkles } from "lucide-react";
import { DailyBriefSection } from "@/components/workspace/daily-brief-section";
import { WorkspaceTagChips } from "@/components/workspace/sidebar-workspace-tags";
import { WorkspacePagesList } from "@/components/workspace/workspace-pages-list";
import type { Note, Tag } from "@/graphql/types";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import type { WorkspaceFilters } from "@/lib/workspace-url";
import { QuickActionsFab } from "./quick-actions-fab";

export function WorkspaceHomeContent({
  tags = [],
  notebookId,
  notes = [],
  filters,
}: {
  tags?: Tag[];
  notebookId?: string;
  notes?: Note[];
  filters: WorkspaceFilters;
}) {
  const { openNewPageDialog } = useWorkspaceCreate();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Hlavný stĺpec — stránky */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-6">
          <div className="mb-5">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {notebookId ? "Workspace pages" : "All pages"}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {notebookId ? "Pages in this workspace" : "Your pages"}
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
              Pick up where you left off, or start something new.
            </p>
          </div>

          <WorkspaceTagChips tags={tags} notebookId={notebookId} />

          <div className="mt-6 min-h-0 flex-1">
            <WorkspacePagesList
              notes={notes}
              notebookId={notebookId}
              filters={filters}
            />
          </div>
        </section>

        {/* Pravý panel — deň + rýchly štart (nie stála 3. kolóna Snaps) */}
        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-border/50 bg-muted/20 px-5 py-6 lg:w-[min(360px,38%)] lg:border-l lg:border-t-0 lg:bg-muted/10">
          <DailyBriefSection variant="rail" />

          <button
            type="button"
            onClick={() => openNewPageDialog(notebookId)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-card px-4 py-4 text-left transition-all hover:border-primary/50 hover:bg-accent/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <PenLine className="h-5 w-5 text-primary" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Start writing</span>
              <span className="text-xs text-muted-foreground">
                Blank page or template
              </span>
            </span>
          </button>
        </aside>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-10">
        <QuickActionsFab />
      </div>
    </div>
  );
}
