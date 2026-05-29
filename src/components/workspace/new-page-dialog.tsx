"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { FileText, Inbox, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CREATE_NOTE_MUTATION, WORKSPACE_QUERY } from "@/graphql/operations";
import type { CreateNoteResult, WorkspaceQueryResult } from "@/graphql/types";
import {
  buildNewNotePath,
  resolvePageDestination,
  type PageDestination,
} from "@/lib/create-page";
import { notebookDisplayName, notebookEmoji } from "@/lib/workspace-icons";
import { PAGE_STARTERS } from "@/lib/page-starters";
import type { WorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

const INBOX_VALUE = "inbox";

export function NewPageDialog({
  open,
  onOpenChange,
  filters,
  defaultNotebookId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: WorkspaceFilters;
  defaultNotebookId?: string;
  onCreated?: (noteId: string, destination: PageDestination) => void;
}) {
  const { data } = useQuery<WorkspaceQueryResult>(WORKSPACE_QUERY, { skip: !open });
  const notebooks = useMemo(
    () => [...(data?.notebooks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [data?.notebooks],
  );

  const initialDestination = useMemo(
    () =>
      resolvePageDestination(notebooks, {
        preferredNotebookId: defaultNotebookId,
        urlNotebookId: filters.notebookId,
      }),
    [notebooks, defaultNotebookId, filters.notebookId],
  );

  const [destinationKey, setDestinationKey] = useState(
    initialDestination.notebookId ?? INBOX_VALUE,
  );
  const [starterId, setStarterId] = useState("blank");
  const [error, setError] = useState<string | null>(null);

  const [createNote, { loading }] = useMutation<CreateNoteResult>(CREATE_NOTE_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });

  useEffect(() => {
    if (!open) return;
    const dest = resolvePageDestination(notebooks, {
      preferredNotebookId: defaultNotebookId,
      urlNotebookId: filters.notebookId,
    });
    setDestinationKey(dest.notebookId ?? INBOX_VALUE);
    setStarterId("blank");
    setError(null);
  }, [open, defaultNotebookId, filters.notebookId, notebooks]);

  const starter = PAGE_STARTERS.find((s) => s.id === starterId) ?? PAGE_STARTERS[0];

  const destination: PageDestination = {
    notebookId: destinationKey === INBOX_VALUE ? null : destinationKey,
  };

  async function handleCreate() {
    setError(null);
    try {
      const { data: result } = await createNote({
        variables: {
          input: {
            title: starter.title,
            content: starter.content,
            notebookId: destination.notebookId ?? undefined,
          },
        },
      });

      const noteId = result?.createNote?.id;
      if (!noteId) {
        setError("Page was not created. Try again.");
        return;
      }

      onCreated?.(noteId, destination);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create page");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/40 px-5 py-4">
          <DialogTitle>New page</DialogTitle>
          <p className="text-left text-sm font-normal text-muted-foreground">
            Choose where the page lives in your workspace and how it starts.
          </p>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Add to</Label>
            <div className="space-y-1 rounded-lg border border-border/50 p-1">
              <DestinationOption
                selected={destinationKey === INBOX_VALUE}
                onSelect={() => setDestinationKey(INBOX_VALUE)}
                icon={<Inbox className="h-4 w-4" />}
                label="Inbox"
                hint="Not inside a workspace notebook"
              />
              {notebooks.map((nb) => (
                <DestinationOption
                  key={nb.id}
                  selected={destinationKey === nb.id}
                  onSelect={() => setDestinationKey(nb.id)}
                  icon={
                    <span className="text-base leading-none">
                      {notebookEmoji(nb.id, nb.name)}
                    </span>
                  }
                  label={notebookDisplayName(nb.name)}
                  hint="Workspace notebook"
                />
              ))}
            </div>
            {notebooks.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Create a notebook from the sidebar (+ next to Workspace) to group pages.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Start from</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAGE_STARTERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setStarterId(s.id)}
                  className={cn(
                    "flex flex-col rounded-lg border p-3 text-left transition-colors",
                    starterId === s.id
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/60 hover:bg-muted/40",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {s.name}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-border/40 px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={() => void handleCreate()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DestinationOption({
  selected,
  onSelect,
  icon,
  label,
  hint,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
        selected ? "bg-accent" : "hover:bg-muted/50",
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
