"use client";

import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PAGE_COLORS = [
  "#ffffff",
  "#f7f7f5",
  "#fef3c7",
  "#dcfce7",
  "#ccfbf1",
  "#e0f2fe",
  "#fce7f3",
  "#f3f4f6",
];

export function NoteColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Palette className="h-4 w-4" />
          <span
            className="h-4 w-4 rounded border border-border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="grid grid-cols-4 gap-1.5">
          {PAGE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={cn(
                "h-8 w-8 rounded-md border border-border transition-transform hover:scale-105",
                color === c && "ring-2 ring-primary ring-offset-2",
              )}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
