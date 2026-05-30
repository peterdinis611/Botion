"use client";

import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ShareLinkFooter({
  shareUrl,
  loading,
  copied,
  onCopy,
}: {
  shareUrl: string;
  loading: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-2 border-t border-border/40 bg-muted/20 px-5 py-4">
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link2 className="h-3.5 w-3.5" />
        Link to this page
      </Label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={loading ? "Generating link…" : shareUrl}
          title={shareUrl}
          className="h-9 min-w-0 flex-1 font-mono text-xs"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={!shareUrl || loading}
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
