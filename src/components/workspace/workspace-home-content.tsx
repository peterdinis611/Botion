"use client";

import { Check, FilePlus, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkspaceTagChips } from "@/components/workspace/sidebar-workspace-tags";
import { WorkspacePagesList } from "@/components/workspace/workspace-pages-list";
import type { Note, Tag } from "@/graphql/types";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import type { WorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";
import { QuickActionsFab } from "./quick-actions-fab";

const CHECKLIST_KEY = "botion-demo-checklist";

type CheckItem = { id: string; label: string; done: boolean };

const DEFAULT_LEFT: CheckItem[] = [
  { id: "1", label: "Setting up research meeting", done: true },
  { id: "2", label: "Check to-do's", done: false },
  { id: "3", label: "Make the logo bigger", done: false },
];

const DEFAULT_RIGHT: CheckItem[] = [
  { id: "4", label: "Review design mockups", done: true },
  { id: "5", label: "Send weekly update", done: false },
  { id: "6", label: "Schedule user interviews", done: false },
];

function loadChecklist(): { left: CheckItem[]; right: CheckItem[] } {
  if (typeof window === "undefined") {
    return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT };
  }
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT };
    return JSON.parse(raw) as { left: CheckItem[]; right: CheckItem[] };
  } catch {
    return { left: DEFAULT_LEFT, right: DEFAULT_RIGHT };
  }
}

function ChecklistItem({
  item,
  onToggle,
}: {
  item: CheckItem;
  onToggle: (id: string) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-[15px] leading-snug",
        item.done
          ? "text-muted-foreground/70 line-through"
          : "text-muted-foreground",
      )}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.id)}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border",
          item.done
            ? "border-transparent bg-muted-foreground/30 text-foreground"
            : "border-muted-foreground/40 bg-transparent",
        )}
      >
        {item.done && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </span>
      <span>{item.label}</span>
    </label>
  );
}

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
  const [left, setLeft] = useState<CheckItem[]>(DEFAULT_LEFT);
  const [right, setRight] = useState<CheckItem[]>(DEFAULT_RIGHT);

  useEffect(() => {
    const saved = loadChecklist();
    setLeft(saved.left);
    setRight(saved.right);
  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify({ left, right }));
  }, [left, right]);

  function toggle(id: string) {
    const toggleList = (items: CheckItem[]) =>
      items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    setLeft((prev) => toggleList(prev));
    setRight((prev) => toggleList(prev));
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-180 flex-1 overflow-y-auto px-8 py-8 pb-24 sm:px-10 sm:py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-foreground">
              {notebookId ? "Workspace home" : "Quick Notes"}
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
              Pages live here and in the sidebar. Deleting always sends them to trash first.
            </p>
          </div>
          <Button
            className="gap-1.5 shadow-sm"
            onClick={() => openNewPageDialog(notebookId)}
          >
            <FilePlus className="h-4 w-4" />
            New page
          </Button>
        </div>

        <WorkspaceTagChips tags={tags} notebookId={notebookId} />

        <div className="mb-8">
          <button
            type="button"
            onClick={() => openNewPageDialog(notebookId)}
            className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/15 px-4 py-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-sm">
              <PenLine className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </span>
            <span>
              <span className="block text-sm font-medium text-foreground">
                Start writing
              </span>
              <span className="text-xs text-muted-foreground">
                Blank page or pick a template
              </span>
            </span>
          </button>
        </div>

        <div className="mb-12">
          <WorkspacePagesList
            notes={notes}
            notebookId={notebookId}
            filters={filters}
          />
        </div>

        <details className="rounded-xl border border-border/40 bg-muted/10 px-5 py-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Demo checklist & brief
          </summary>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              <div className="space-y-3">
                {left.map((item) => (
                  <ChecklistItem key={item.id} item={item} onToggle={toggle} />
                ))}
              </div>
              <div className="space-y-3">
                {right.map((item) => (
                  <ChecklistItem key={item.id} item={item} onToggle={toggle} />
                ))}
              </div>
            </div>
            <p className="text-[15px] leading-[1.7] text-muted-foreground">
              We are creating a website for a company that helps people build their own
              businesses. The website will feature a clean, modern design with intuitive
              navigation and compelling content.
            </p>
          </div>
        </details>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-10 z-10 flex gap-2">
        <QuickActionsFab />
      </div>
    </div>
  );
}
