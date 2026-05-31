"use client";

import { Handle, Position } from "@xyflow/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export const graphHandleClass =
  "!h-3 !w-3 !border-2 !border-background !z-20 hover:!scale-110 transition-transform";

type GraphNodeHandlesProps = {
  isConnectable?: boolean;
  accent?: "primary" | "amber";
};

function handleOffset(position: Position, type: "source" | "target"): CSSProperties {
  const shift = type === "source" ? 6 : -6;
  switch (position) {
    case Position.Top:
    case Position.Bottom:
      return { left: `calc(50% + ${shift}px)` };
    case Position.Left:
    case Position.Right:
      return { top: `calc(50% + ${shift}px)` };
    default:
      return {};
  }
}

/** Four-way connection points — target + source on each side. */
export function GraphNodeHandles({
  isConnectable = true,
  accent = "primary",
}: GraphNodeHandlesProps) {
  const bg = accent === "amber" ? "!bg-amber-600" : "!bg-primary";

  const sides = [
    { position: Position.Top, prefix: "top" },
    { position: Position.Right, prefix: "right" },
    { position: Position.Bottom, prefix: "bottom" },
    { position: Position.Left, prefix: "left" },
  ] as const;

  return (
    <>
      {sides.map(({ position, prefix }) => (
        <span key={prefix} className="contents">
          <Handle
            type="target"
            position={position}
            id={`${prefix}-target`}
            isConnectable={isConnectable}
            style={handleOffset(position, "target")}
            className={cn(graphHandleClass, bg)}
          />
          <Handle
            type="source"
            position={position}
            id={`${prefix}-source`}
            isConnectable={isConnectable}
            style={handleOffset(position, "source")}
            className={cn(graphHandleClass, bg)}
          />
        </span>
      ))}
    </>
  );
}
