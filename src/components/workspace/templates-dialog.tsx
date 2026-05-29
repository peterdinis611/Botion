"use client";

import { useMutation } from "@apollo/client/react";
import { FileText, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CREATE_NOTE_MUTATION,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type { CreateNoteResult } from "@/graphql/types";
import { NOTE_TEMPLATES } from "@/lib/note-templates";
import { buildWorkspacePath, parseWorkspaceFilters } from "@/lib/workspace-url";
import { cn } from "@/lib/utils";

export function TemplatesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [createNote] = useMutation<CreateNoteResult>(CREATE_NOTE_MUTATION);

  async function applyTemplate(templateId: string) {
    const template = NOTE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setBusyId(templateId);
    try {
      const { data } = await createNote({
        variables: {
          input: {
            title: template.title,
            content: template.content,
            notebookId: filters.notebookId,
          },
        },
        refetchQueries: [{ query: WORKSPACE_QUERY }],
      });

      const noteId = data?.createNote?.id;
      if (noteId) {
        router.push(buildWorkspacePath("/workspace", filters, noteId));
        onOpenChange(false);
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Templates</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          {NOTE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              disabled={busyId !== null}
              onClick={() => void applyTemplate(template.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg border border-border/60 p-3 text-left transition-colors hover:bg-muted/50",
                busyId === template.id && "opacity-70",
              )}
            >
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span key={tag} className="text-[11px] text-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              {busyId === template.id && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
        <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
