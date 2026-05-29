import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex w-[220px] shrink-0 flex-col border-r border-border/50 bg-sidebar p-3">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="mb-2 h-3 w-20" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`nav-${i}`} className="h-8 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col border-r border-border/50">
        <Skeleton className="h-12 w-full shrink-0" />
        <div className="mx-auto w-full max-w-[720px] flex-1 space-y-4 px-10 py-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      <div className="flex w-[280px] shrink-0 flex-col bg-panel p-4">
        <Skeleton className="mb-4 h-4 w-14" />
        <Skeleton className="aspect-[4/5] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Loading Botion…</p>
    </div>
  );
}
