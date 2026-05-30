import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent",
        className,
      )}
    />
  );
}

function SidebarSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col border-r border-border/50 bg-sidebar p-3",
        collapsed ? "w-[52px]" : "w-[220px]",
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Shimmer className="h-7 w-7 rounded-md" />
        {!collapsed && <Shimmer className="h-4 w-16" />}
      </div>
      {!collapsed && (
        <>
          <Shimmer className="mb-3 h-8 w-full rounded-lg" />
          <Shimmer className="mb-2 h-3 w-20" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Shimmer key={`nav-${i}`} className="h-8 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EditorSkeleton({ label }: { label?: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col border-r border-border/50 bg-background">
      <Shimmer className="h-12 w-full shrink-0 rounded-none" />
      <div className="mx-auto w-full max-w-[720px] flex-1 space-y-5 px-10 py-10">
        {label && (
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        )}
        <Shimmer className="h-10 w-2/5 max-w-[12rem]" />
        <Shimmer className="h-4 w-1/3 max-w-[10rem]" />
        <div className="space-y-3 pt-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-[92%]" />
          <Shimmer className="h-4 w-[78%]" />
          <Shimmer className="h-4 w-[85%]" />
        </div>
      </div>
    </div>
  );
}

function SnapsSkeleton() {
  return (
    <div className="flex w-[280px] shrink-0 flex-col bg-panel p-4">
      <Shimmer className="mb-4 h-4 w-14" />
      <div className="grid grid-cols-2 gap-2">
        <Shimmer className="aspect-square rounded-xl" />
        <Shimmer className="aspect-square rounded-xl" />
        <Shimmer className="col-span-2 aspect-[16/10] rounded-xl" />
      </div>
    </div>
  );
}

export function WorkspaceLoading() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading workspace"
    >
      <SidebarSkeleton />
      <EditorSkeleton label="Loading workspace…" />
      <SnapsSkeleton />
    </div>
  );
}

export function NoteLoading() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <SidebarSkeleton />
      <EditorSkeleton label="Opening page…" />
      <SnapsSkeleton />
    </div>
  );
}

export function RootLoading() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading Botion"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--landing-blob-2),transparent)] opacity-60"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background shadow-sm">
          B
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Shimmer className="mx-auto h-4 w-32" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-4/5 mx-auto" />
        </div>

        <p className="text-sm text-muted-foreground">Loading Botion…</p>
      </div>
    </div>
  );
}
