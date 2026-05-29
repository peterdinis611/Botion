"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ShareDialog({
  open,
  onOpenChange,
  pageTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share “{pageTitle}”</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Anyone with this link can open the page when sharing is enabled on your
          workspace.
        </p>
        <div className="flex gap-2">
          <Input readOnly value={shareUrl} className="text-xs" />
          <Button type="button" variant="secondary" onClick={() => void copyLink()}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
