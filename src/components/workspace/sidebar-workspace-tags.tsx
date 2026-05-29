"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Hash, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { Input } from "@/components/ui/input";
import {
  CREATE_TAG_MUTATION,
  REMOVE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
  WORKSPACE_QUERY,
  WORKSPACE_TAGS_QUERY,
} from "@/graphql/operations";
import type {
  CreateTagResult,
  Tag,
  WorkspaceQueryResult,
  WorkspaceTagsQueryResult,
} from "@/graphql/types";
import { formatTagLabel } from "@/lib/tag-utils";
import { cn } from "@/lib/utils";
import { buildWorkspaceHref } from "@/lib/workspace-url";

const TAG_COLORS = [
  "#b8a04a",
  "#6b8e7e",
  "#7c6b9e",
  "#c47d5a",
  "#5a8fc4",
  "#9e6b6b",
];

export function SidebarWorkspaceTags({
  notebookId,
  collapsed,
}: {
  notebookId?: string;
  collapsed: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTagId = searchParams.get("tag") ?? undefined;
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: scopedData, loading: scopedLoading } =
    useQuery<WorkspaceTagsQueryResult>(WORKSPACE_TAGS_QUERY, {
      variables: { notebookId: notebookId! },
      skip: !notebookId,
    });

  const { data: allData, loading: allLoading } = useQuery<WorkspaceQueryResult>(
    WORKSPACE_QUERY,
    { skip: Boolean(notebookId) },
  );

  const tags: Tag[] = notebookId
    ? (scopedData?.workspaceTags ?? [])
    : (allData?.tags ?? []);

  const loading = notebookId ? scopedLoading : allLoading;

  const refetchQueries = notebookId
    ? [{ query: WORKSPACE_TAGS_QUERY, variables: { notebookId } }, WORKSPACE_QUERY]
    : [WORKSPACE_QUERY];

  const [createTag] = useMutation<CreateTagResult>(CREATE_TAG_MUTATION, {
    refetchQueries,
  });
  const [updateTag] = useMutation(UPDATE_TAG_MUTATION, { refetchQueries });
  const [removeTag] = useMutation(REMOVE_TAG_MUTATION, { refetchQueries });

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    await createTag({
      variables: {
        input: {
          name,
          color: TAG_COLORS[tags.length % TAG_COLORS.length],
          notebookId: notebookId ?? undefined,
        },
      },
    });
    setNewName("");
    setAdding(false);
  }

  async function handleUpdate(id: string) {
    const name = editName.trim();
    if (!name) return;
    await updateTag({ variables: { input: { id, name } } });
    setEditingId(null);
  }

  async function handleRemove(id: string) {
    await removeTag({ variables: { id } });
    if (activeTagId === id) {
      router.push(buildWorkspaceHref(searchParams, { clearTag: true }));
    }
  }

  function selectTag(tagId: string) {
    const isActive = activeTagId === tagId;
    router.push(
      buildWorkspaceHref(searchParams, isActive ? { clearTag: true } : { tagId }),
    );
  }

  if (collapsed) return null;

  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Tags
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setAdding((v) => !v)}
          aria-label="Add tag"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {notebookId && (
        <p className="mb-1.5 px-2 text-[10px] text-muted-foreground/80">
          Workspace tags
        </p>
      )}

      {adding && (
        <div className="mb-2 flex gap-1 px-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tag name"
            className="h-7 text-[12px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
              if (e.key === "Escape") setAdding(false);
            }}
            autoFocus
          />
          <Button size="sm" className="h-7 px-2 text-[11px]" onClick={() => void handleCreate()}>
            Add
          </Button>
        </div>
      )}

      {loading && tags.length === 0 && (
        <p className="px-2 text-[11px] text-muted-foreground">Loading…</p>
      )}

      {!loading && tags.length === 0 && (
        <p className="px-2 text-[11px] text-muted-foreground">
          {notebookId ? "No tags in this workspace yet." : "No tags yet."}
        </p>
      )}

      <ul className="space-y-0.5">
        {tags.map((tag) => {
          const active = activeTagId === tag.id;
          if (editingId === tag.id) {
            return (
              <li key={tag.id} className="flex gap-1 px-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-7 flex-1 text-[12px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleUpdate(tag.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => void handleUpdate(tag.id)}
                >
                  Save
                </Button>
              </li>
            );
          }

          return (
            <li key={tag.id} className="group flex items-center gap-0.5 pr-1">
              <button
                type="button"
                onClick={() => selectTag(tag.id)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <Hash className="h-3 w-3 shrink-0 opacity-50" />
                <span className="truncate">{tag.name}</span>
                {tag.noteCount > 0 && (
                  <span className="ml-auto shrink-0 text-[10px] tabular-nums text-muted-foreground">
                    {tag.noteCount}
                  </span>
                )}
              </button>
              <ItemActionsMenu label="Akcie tagu" contentClassName="w-44">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingId(tag.id);
                    setEditName(tag.name);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Premenovať
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => void handleRemove(tag.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Zmazať
                </DropdownMenuItem>
              </ItemActionsMenu>
            </li>
          );
        })}
      </ul>

      {activeTagId && (
        <Link
          href={buildWorkspaceHref(searchParams, { clearTag: true })}
          className="mt-1 flex items-center gap-1 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear tag filter
        </Link>
      )}
    </div>
  );
}

/** Quick hashtag row on home — uses workspace tags when a notebook is selected. */
export function WorkspaceTagChips({
  tags,
  notebookId,
}: {
  tags: Tag[];
  notebookId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const visible = notebookId
    ? tags.filter((t) => !t.notebookId || t.notebookId === notebookId).slice(0, 8)
    : tags.slice(0, 8);

  if (visible.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-x-3 gap-y-1">
      {visible.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className="text-[14px] text-tag transition-opacity hover:opacity-80"
          style={{ color: tag.color }}
          onClick={() =>
            router.push(
              buildWorkspaceHref(searchParams, {
                tagId: tag.id,
                notebookId: notebookId ?? searchParams.get("notebook") ?? undefined,
              }),
            )
          }
        >
          {formatTagLabel(tag.name)}
        </button>
      ))}
    </div>
  );
}
