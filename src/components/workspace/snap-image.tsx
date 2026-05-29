"use client";

import { useEffect, useState } from "react";
import { getFileUrl } from "@/lib/api-base";
import { getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SnapImage({
  fileId,
  alt,
  className,
  fill,
}: {
  fileId: string;
  alt: string;
  className?: string;
  fill?: boolean;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function load() {
      const token = getToken();
      if (!token) {
        setFailed(true);
        return;
      }

      try {
        const res = await fetch(getFileUrl(fileId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load image");
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-xs text-muted-foreground",
          fill && "absolute inset-0",
          className,
        )}
      >
        {failed ? "Preview unavailable" : "Loading…"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(fill ? "absolute inset-0 h-full w-full object-cover" : "", className)}
    />
  );
}
