"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ImagePlus, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { SnapActionsMenu } from "@/components/workspace/snap-actions-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSnapDialog } from "@/components/workspace/add-snap-dialog";
import { CustomiseSnapsDialog } from "@/components/workspace/customise-snaps-dialog";
import { EditSnapDialog } from "@/components/workspace/edit-snap-dialog";
import { SnapImage } from "@/components/workspace/snap-image";
import { useSnapsPanel } from "@/components/workspace/snaps-panel-context";
import {
  ME_QUERY,
  REMOVE_SNAP_MUTATION,
  SNAPS_QUERY,
} from "@/graphql/operations";
import type { MeQueryResult, Snap, SnapsQueryResult } from "@/graphql/types";
import { useCreateSnap } from "@/hooks/use-create-snap";
import { getSnapQueryVariables } from "@/lib/snap-scope";
import { cn } from "@/lib/utils";

const ZOOM_LEVELS = [0.85, 1, 1.15, 1.3];

export function SnapsPanel({
  className,
  notebookId,
  noteId,
}: {
  className?: string;
  notebookId?: string;
  noteId?: string;
}) {
  const {
    addDialogOpen,
    customiseDialogOpen,
    setAddDialogOpen,
    setCustomiseDialogOpen,
    openAddSnap,
    openAddSnapWithFile,
    openCustomise,
  } = useSnapsPanel();

  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [dropActive, setDropActive] = useState(false);

  const queryVariables = getSnapQueryVariables(notebookId, noteId);
  const { createSnapFromFile, creating } = useCreateSnap(notebookId, noteId);

  const { data: meData } = useQuery<MeQueryResult>(ME_QUERY);
  const panelPrefs = meData?.me?.preferences.snapsPanel ?? {
    showCaptions: true,
    compactCards: false,
    sortNewestFirst: true,
  };

  const { data, loading, error, refetch } = useQuery<SnapsQueryResult>(SNAPS_QUERY, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network",
  });

  const [removeSnap] = useMutation(REMOVE_SNAP_MUTATION, {
    refetchQueries: [{ query: SNAPS_QUERY, variables: queryVariables }],
  });

  const sortedSnaps = useMemo(() => {
    const list = [...(data?.snaps ?? [])];
    list.sort((a, b) => {
      const order = (panelPrefs?.sortNewestFirst ?? true)
        ? b.sortOrder - a.sortOrder
        : a.sortOrder - b.sortOrder;
      if (order !== 0) return order;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [data?.snaps, panelPrefs?.sortNewestFirst]);

  const activeSnap: Snap | undefined =
    sortedSnaps.find((s) => s.id === selectedId) ?? sortedSnaps[0];

  const compact = panelPrefs?.compactCards ?? false;
  const showCaptions = panelPrefs?.showCaptions ?? true;
  const hasSnaps = sortedSnaps.length > 0;
  const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;

  const quickUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      try {
        const snap = await createSnapFromFile(file);
        if (snap?.id) setSelectedId(snap.id);
      } catch {
        openAddSnapWithFile(file);
      }
    },
    [createSnapFromFile, openAddSnapWithFile],
  );

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (!pathname.startsWith("/workspace")) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            void quickUpload(file);
            break;
          }
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [quickUpload, pathname]);

  async function handleDelete(id: string) {
    await removeSnap({ variables: { id } });
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <>
      <aside
        ref={panelRef}
        tabIndex={0}
        className={cn(
          "relative flex h-full w-[280px] shrink-0 flex-col bg-panel outline-none",
          dropActive && "ring-2 ring-inset ring-primary/30",
          className,
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropActive(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void quickUpload(file);
        }}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <h2 className="text-[14px] font-semibold text-foreground">Snaps</h2>
          <ItemActionsMenu
            label="Snaps options"
            className="h-7 w-7 opacity-100"
            contentClassName="w-44"
          >
            {activeSnap ? (
              <>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => void handleDelete(activeSnap.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={openAddSnap}>Add snap</DropdownMenuItem>
            )}
          </ItemActionsMenu>
        </div>

        <ScrollArea className="flex-1 px-4">
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
              <p className="text-xs text-destructive">
                Could not load snaps. Restart the backend if you recently updated.
              </p>
              <button
                type="button"
                className="mt-2 text-xs text-primary underline"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </div>
          ) : loading && !data ? (
            <Skeleton
              className={cn("w-full rounded-xl", compact ? "aspect-[3/4]" : "aspect-[4/5]")}
            />
          ) : hasSnaps && activeSnap ? (
            <div className="space-y-3 pb-2">
              <div className="relative">
                {sortedSnaps.length > 1 && (
                  <>
                    <div
                      className={cn(
                        "absolute left-3 top-3 right-0 overflow-hidden rounded-xl border border-border/40 bg-card opacity-40",
                        compact ? "aspect-[3/4]" : "aspect-[4/5]",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute left-1.5 top-1.5 right-3 overflow-hidden rounded-xl border border-border/40 bg-card opacity-70",
                        compact ? "aspect-[3/4]" : "aspect-[4/5]",
                      )}
                    />
                  </>
                )}
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-xl border border-border/50 bg-card",
                    compact ? "aspect-[3/4]" : "aspect-[4/5]",
                  )}
                >
                  <div
                    className="absolute inset-0 origin-center transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <SnapImage
                      fileId={activeSnap.fileId}
                      alt={activeSnap.title}
                      fill
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1 rounded-full border border-border/60 bg-background/90 p-0.5 shadow-sm">
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                      aria-label="Zoom out"
                      disabled={zoomIndex === 0}
                      onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                      aria-label="Zoom in"
                      disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
                      onClick={() =>
                        setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {showCaptions && (activeSnap.caption || activeSnap.title) && (
                <div className="px-0.5">
                  <p className="text-[13px] font-medium text-foreground">
                    {activeSnap.title}
                  </p>
                  {activeSnap.caption && (
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {activeSnap.caption}
                    </p>
                  )}
                </div>
              )}

              {sortedSnaps.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sortedSnaps.map((snap) => (
                    <div
                      key={snap.id}
                      className={cn(
                        "group/snap relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border",
                        snap.id === activeSnap.id
                          ? "border-foreground/50"
                          : "border-border/50 opacity-70 hover:opacity-100",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(snap.id);
                          setZoomIndex(1);
                        }}
                        className="absolute inset-0"
                      >
                        <SnapImage fileId={snap.fileId} alt={snap.title} fill />
                      </button>
                      <div className="absolute right-0.5 top-0.5 z-10">
                        <SnapActionsMenu
                          className="h-6 w-6 bg-background/80 opacity-0 backdrop-blur-sm group-hover/snap:opacity-100"
                          onEdit={() => {
                            setSelectedId(snap.id);
                            setEditOpen(true);
                          }}
                          onDelete={() => void handleDelete(snap.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAddSnap}
              disabled={creating}
              className="w-full space-y-3 pb-2 text-left"
            >
              <div
                className={cn(
                  "relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/5",
                  compact ? "aspect-[3/4]" : "aspect-[4/5]",
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                </span>
                <p className="text-xs text-muted-foreground">
                  {creating
                    ? "Uploading…"
                    : "Upload screenshots and references as snaps"}
                </p>
              </div>
            </button>
          )}
        </ScrollArea>

        <div className="space-y-1 px-4 pb-4">
          <button
            type="button"
            onClick={openAddSnap}
            disabled={creating}
            className="flex w-full items-center gap-2 px-1 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60">
              <Plus className="h-3.5 w-3.5" />
            </span>
            Add snap
          </button>
          <button
            type="button"
            onClick={openCustomise}
            className="px-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Customise panel
          </button>
        </div>
      </aside>

      <AddSnapDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        notebookId={notebookId}
        noteId={noteId}
        onCreated={(id) => setSelectedId(id)}
      />

      <EditSnapDialog
        snap={activeSnap ?? null}
        open={editOpen}
        onOpenChange={setEditOpen}
        notebookId={notebookId}
        noteId={noteId}
      />

      <CustomiseSnapsDialog
        open={customiseDialogOpen}
        onOpenChange={setCustomiseDialogOpen}
      />
    </>
  );
}
