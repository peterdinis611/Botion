import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="flex w-[260px] shrink-0 flex-col border-r border-border bg-sidebar p-3">
        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="mb-4 h-9 w-full rounded-md" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`nav-${i}`} className="h-9 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="my-4 h-px w-full" />
        <Skeleton className="mb-2 h-3 w-16" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`tree-${i}`} className="h-8 w-full rounded-md" />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
      </div>

      {/* Note list */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-border p-3">
        <Skeleton className="mb-2 h-5 w-28" />
        <Skeleton className="mb-3 h-9 w-full rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`note-${i}`} className="space-y-2 rounded-lg p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-end gap-2 border-b border-border px-4 py-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-8 py-10">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-[50vh] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
      <p className="text-sm text-muted-foreground">Loading Botion…</p>
    </div>
  );
}
