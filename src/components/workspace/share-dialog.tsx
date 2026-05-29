"use client";

import { useLazyQuery } from "@apollo/client/react";
import { Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PAGE_SHARE_LINK_QUERY } from "@/graphql/operations";
import type { PageShareLinkQueryResult } from "@/graphql/types";

export function ShareDialog({
  open,
  onOpenChange,
  pageTitle,
  noteId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  noteId?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [loadShareLink, { loading }] = useLazyQuery<PageShareLinkQueryResult>(
    PAGE_SHARE_LINK_QUERY,
    { fetchPolicy: "network-only" },
  );

  useEffect(() => {
    if (!open) return;

    async function resolveUrl() {
      if (typeof window === "undefined") return;

      if (noteId) {
        try {
          const { data } = await loadShareLink({ variables: { noteId } });
          const path = data?.pageShareLink?.path;
          if (path) {
            setShareUrl(`${window.location.origin}${path}`);
            return;
          }
        } catch {
          // Fall back to current URL below.
        }
      }

      setShareUrl(window.location.href);
    }

    void resolveUrl();
  }, [open, noteId, loadShareLink]);

  async function copyLink() {
    if (!shareUrl) return;
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
          <Input
            readOnly
            value={loading ? "Generating link…" : shareUrl}
            className="text-xs"
          />
          <Button
            type="button"
            variant="secondary"
            disabled={!shareUrl || loading}
            onClick={() => void copyLink()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : copied ? (
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
