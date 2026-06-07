"use client";

import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  COLOR_LABELS,
  DEFAULT_CUSTOM_COLOR,
  isPresetColor,
  normalizeHex,
  PAGE_COLORS,
  resolveCustomColor,
} from "@/lib/color-utils";
import { cn } from "@/lib/utils";

export function NoteColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const customColor = isPresetColor(color) ? DEFAULT_CUSTOM_COLOR : resolveCustomColor(color);
  const isCustomSelected = !isPresetColor(color);

  useEffect(() => {
    if (!open) return;
    setHexInput(isCustomSelected ? resolveCustomColor(color) : "");
  }, [open, color, isCustomSelected]);

  function applyCustomColor(next: string) {
    const normalized = normalizeHex(next);
    if (!normalized) return;
    setHexInput(normalized);
    onChange(normalized);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Page color">
          <Palette className="h-4 w-4" />
          <span
            className="h-4 w-4 rounded border border-border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[188px] p-3" align="end">
        <div className="grid grid-cols-4 gap-2">
          {PAGE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={COLOR_LABELS[c]}
              title={COLOR_LABELS[c]}
              className={cn(
                "h-8 w-8 rounded-md border border-border/80 transition-transform hover:scale-105",
                color.toLowerCase() === c && "ring-2 ring-primary ring-offset-2",
              )}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Custom
          </p>
          <div className="flex items-center gap-2">
            <label
              className={cn(
                "relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border/80",
                isCustomSelected && "ring-2 ring-primary ring-offset-2",
              )}
              title="Pick a custom color"
            >
              <input
                type="color"
                value={isCustomSelected ? resolveCustomColor(color) : customColor}
                onChange={(e) => applyCustomColor(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 opacity-0"
                aria-label="Custom color picker"
              />
              <span
                className="block h-full w-full"
                style={{
                  backgroundColor: isCustomSelected ? resolveCustomColor(color) : customColor,
                }}
              />
            </label>
            <Input
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={() => {
                if (hexInput.trim()) applyCustomColor(hexInput);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCustomColor(hexInput);
                }
              }}
              placeholder="#6366f1"
              spellCheck={false}
              className="h-8 font-mono text-xs uppercase"
              aria-label="Custom hex color"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
