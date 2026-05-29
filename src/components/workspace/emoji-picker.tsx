"use client";

import { Search, Smile, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  EMOJI_PICKER_GROUPS,
  searchPickerEmojis,
} from "@/lib/emoji-picker-data";
import { cn } from "@/lib/utils";

function EmojiGrid({
  emojis,
  value,
  onSelect,
}: {
  emojis: string[];
  value: string;
  onSelect: (emoji: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-0.5">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 hover:bg-accent active:scale-95",
            value === emoji && "bg-accent ring-1 ring-primary/30",
          )}
          aria-label={`Select ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export function EmojiPicker({
  value,
  onChange,
  size = "md",
  className,
  "aria-label": ariaLabel = "Choose icon",
}: {
  value: string;
  onChange: (emoji: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sizeClass =
    size === "lg"
      ? "h-[4.5rem] w-[4.5rem] text-[2.35rem] rounded-2xl"
      : size === "sm"
        ? "h-8 w-8 text-lg rounded-lg"
        : "h-10 w-10 text-xl rounded-xl";

  const searchResults = useMemo(() => searchPickerEmojis(search), [search]);
  const isSearching = search.trim().length > 0;

  function select(emoji: string) {
    onChange(emoji);
    setOpen(false);
    setSearch("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch("");
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "group flex shrink-0 items-center justify-center border border-border/50 bg-muted/30 shadow-sm transition-all hover:border-border hover:bg-muted/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
            sizeClass,
            className,
          )}
        >
          {value ? (
            <span className="leading-none transition-transform group-hover:scale-105" role="img" aria-hidden>
              {value}
            </span>
          ) : (
            <Smile className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-xl border-border/70 p-0 shadow-xl"
      >
        <div className="border-b border-border/50 bg-muted/20 px-3 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emoji (home, work, star…)"
              className="h-9 border-border/50 bg-background/80 pl-8 text-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2.5">
          {isSearching ? (
            searchResults.length > 0 ? (
              <div>
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Results ({searchResults.length})
                </p>
                <EmojiGrid emojis={searchResults} value={value} onSelect={select} />
              </div>
            ) : (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                No emoji found. Try &quot;home&quot;, &quot;work&quot;, or &quot;star&quot;.
              </p>
            )
          ) : (
            EMOJI_PICKER_GROUPS.map((group) => (
              <div key={group.label} className="mb-3 last:mb-0">
                <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <EmojiGrid emojis={group.emojis} value={value} onSelect={select} />
              </div>
            ))
          )}
        </div>

        <div className="flex gap-1 border-t border-border/50 bg-muted/15 px-2 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 flex-1 gap-1.5 text-xs text-muted-foreground"
            onClick={() => select("✨")}
          >
            <Sparkles className="h-3 w-3" />
            Default ✨
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
