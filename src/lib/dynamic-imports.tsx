"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function EditorSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-8">
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-5/6 max-w-lg" />
    </div>
  );
}

function PanelSkeleton({ lines = 6 }: { lines?: number }) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-6">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function GraphSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/20">
      <Skeleton className="h-[70%] w-[85%] rounded-2xl" />
    </div>
  );
}

export const NoteEditor = dynamic(
  () =>
    import("@/components/workspace/note-editor").then((m) => ({
      default: m.NoteEditor,
    })),
  { loading: () => <EditorSkeleton />, ssr: false },
);

export const CalendarView = dynamic(
  () =>
    import("@/components/workspace/calendar-view").then((m) => ({
      default: m.CalendarView,
    })),
  { loading: () => <PanelSkeleton lines={8} /> },
);

export const GraphsListView = dynamic(
  () =>
    import("@/components/workspace/graphs-list-view").then((m) => ({
      default: m.GraphsListView,
    })),
  { loading: () => <PanelSkeleton lines={5} /> },
);

export const GraphEditor = dynamic(
  () =>
    import("@/components/workspace/graph-editor").then((m) => ({
      default: m.GraphEditor,
    })),
  { loading: () => <GraphSkeleton />, ssr: false },
);

export const SettingsView = dynamic(
  () =>
    import("@/components/workspace/settings-view").then((m) => ({
      default: m.SettingsView,
    })),
  { loading: () => <PanelSkeleton lines={4} /> },
);

export const CommandPalette = dynamic(
  () =>
    import("@/components/workspace/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false },
);

export const ShortcutsDialog = dynamic(
  () =>
    import("@/components/workspace/shortcuts-dialog").then((m) => ({
      default: m.ShortcutsDialog,
    })),
  { ssr: false },
);
