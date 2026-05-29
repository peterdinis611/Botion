"use client";

import { Check, Plus, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkspaceTagChips } from "@/components/workspace/sidebar-workspace-tags";
import type { Tag } from "@/graphql/types";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
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
}: {
  tags?: Tag[];
  notebookId?: string;
}) {
  const { openNewPageDialog } = useWorkspaceCreate();

  function startWriting() {
    openNewPageDialog(notebookId);
  }
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
      <div className="mx-auto w-full max-w-180 flex-1 overflow-y-auto px-10 py-10 pb-24">
        <h1 className="mb-4 text-[2rem] font-bold leading-tight tracking-tight text-foreground">
          Quick Notes
        </h1>

        <WorkspaceTagChips tags={tags} notebookId={notebookId} />

        <button
          type="button"
          onClick={startWriting}
          className="mb-8 block w-full cursor-text rounded-lg border border-dashed border-border/60 px-4 py-3 text-left text-[15px] leading-[1.7] text-muted-foreground transition-colors hover:border-border hover:bg-muted/30 hover:text-foreground"
        >
          Click here to start writing…
        </button>

        <p className="mb-8 text-[15px] leading-[1.7] text-muted-foreground">
          We are a company that helps people build their own businesses. We provide
          tools, resources, and support to help entrepreneurs succeed in their ventures.
        </p>

        <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
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

        <h2 className="mb-3 text-xl font-bold text-foreground">Brief</h2>
        <p className="text-[15px] leading-[1.7] text-muted-foreground">
          We are creating a website for a company that helps people build their own
          businesses. The website will feature a clean, modern design with intuitive
          navigation and compelling content that showcases our services and success
          stories. Our goal is to convert visitors into clients by clearly communicating
          the value we provide.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-10 z-10 flex gap-2">
        <QuickActionsFab />
      </div>
    </div>
  );
}
