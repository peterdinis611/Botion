"use client";

import { useRef } from "react";
import {
  Copy,
  Diamond,
  Download,
  Maximize2,
  Grid3x3,
  Magnet,
  Plus,
  Save,
  Square,
  StickyNote,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { GraphNodeKind, GraphTemplateId } from "@/lib/graph-flow";
import { GRAPH_TEMPLATES } from "@/lib/graph-flow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function GraphEditorToolbar({
  saveState,
  snapToGrid,
  onSnapToGridChange,
  showGrid,
  onShowGridChange,
  onAddNode,
  onApplyTemplate,
  onFitView,
  onZoomIn,
  onZoomOut,
  onSave,
  onExport,
  onImport,
  onDuplicateSelection,
  onDeleteSelection,
  hasSelection,
}: {
  saveState: "idle" | "saving" | "saved";
  snapToGrid: boolean;
  onSnapToGridChange: (v: boolean) => void;
  showGrid: boolean;
  onShowGridChange: (v: boolean) => void;
  onAddNode: (kind: GraphNodeKind) => void;
  onApplyTemplate: (id: GraphTemplateId) => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onDuplicateSelection: () => void;
  onDeleteSelection: () => void;
  hasSelection: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Node type</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAddNode("default")}>
            <Square className="mr-2 h-4 w-4" />
            Box
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNode("decision")}>
            <Diamond className="mr-2 h-4 w-4" />
            Decision
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNode("note")}>
            <StickyNote className="mr-2 h-4 w-4" />
            Sticky note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Replace canvas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {GRAPH_TEMPLATES.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => onApplyTemplate(t.id)}
            >
              <div>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        size="sm"
        variant={snapToGrid ? "secondary" : "ghost"}
        className="gap-1.5"
        onClick={() => onSnapToGridChange(!snapToGrid)}
        title="Snap to grid"
      >
        <Magnet className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={showGrid ? "secondary" : "ghost"}
        className="gap-1.5"
        onClick={() => onShowGridChange(!showGrid)}
        title="Toggle grid"
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" className="gap-1.5" onClick={onFitView}>
        <Maximize2 className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        size="sm"
        variant="ghost"
        className="gap-1.5"
        disabled={!hasSelection}
        onClick={onDuplicateSelection}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="gap-1.5 text-destructive hover:text-destructive"
        disabled={!hasSelection}
        onClick={onDeleteSelection}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button size="sm" variant="ghost" className="gap-1.5" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="gap-1.5"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = "";
        }}
      />

      <div className="ml-auto flex items-center gap-2">
        <span
          className={cn(
            "text-xs text-muted-foreground",
            saveState === "saved" && "text-primary",
          )}
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "idle" && "Auto-save"}
        </span>
        <Button size="sm" className="gap-1.5" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
