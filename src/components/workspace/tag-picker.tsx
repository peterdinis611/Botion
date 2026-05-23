"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CREATE_TAG_MUTATION,
  NOTE_QUERY,
  UPDATE_NOTE_MUTATION,
  WORKSPACE_QUERY,
} from "@/graphql/operations";
import type {
  CreateTagResult,
  Tag as TagType,
  UpdateNoteResult,
} from "@/graphql/types";
import { upsertNoteInCache } from "@/lib/cache-updates";

const TAG_COLORS = ["#0d9488", "#059669", "#d97706", "#dc2626", "#2563eb", "#64748b"];

export function TagPicker({
  noteId,
  selectedTags,
  allTags,
}: {
  noteId: string;
  selectedTags: TagType[];
  allTags: TagType[];
}) {
  const client = useApolloClient();
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const [updateNote] = useMutation<UpdateNoteResult>(UPDATE_NOTE_MUTATION);
  const [createTag] = useMutation<CreateTagResult>(CREATE_TAG_MUTATION, {
    refetchQueries: [{ query: WORKSPACE_QUERY }],
  });

  async function saveTagIds(tagIds: string[]) {
    const { data } = await updateNote({
      variables: { input: { id: noteId, tagIds } },
      refetchQueries: [{ query: NOTE_QUERY, variables: { id: noteId } }],
    });
    if (data?.updateNote) {
      upsertNoteInCache(client.cache, data.updateNote);
    }
  }

  async function toggleTag(tag: TagType) {
    const selected = selectedTags.some((t) => t.id === tag.id);
    const tagIds = selected
      ? selectedTags.filter((t) => t.id !== tag.id).map((t) => t.id)
      : [...selectedTags.map((t) => t.id), tag.id];
    await saveTagIds(tagIds);
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    const { data } = await createTag({
      variables: { input: { name: newTagName.trim(), color } },
    });
    const created = data?.createTag;
    if (created) {
      await saveTagIds([...selectedTags.map((t) => t.id), created.id]);
      setNewTagName("");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {selectedTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className="cursor-pointer gap-1"
          style={{ borderColor: tag.color, color: tag.color }}
          onClick={() => toggleTag(tag)}
        >
          {tag.name}
          <span className="text-muted-foreground">×</span>
        </Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
            <Tag className="h-3.5 w-3.5" />
            Add tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Tags</p>
          <div className="mb-3 flex flex-wrap gap-1">
            {allTags.length === 0 && (
              <p className="text-xs text-muted-foreground">No tags yet</p>
            )}
            {allTags.map((tag) => {
              const active = selectedTags.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-md border px-2 py-0.5 text-xs transition-opacity hover:opacity-80"
                  style={{
                    borderColor: tag.color,
                    backgroundColor: active ? `${tag.color}22` : "transparent",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-1">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag"
              className="h-8 text-xs"
              onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
            />
            <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleCreateTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
