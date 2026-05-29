"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Check, Copy, Loader2, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NOTE_SHARES_QUERY,
  PAGE_SHARE_LINK_QUERY,
  SHARE_PAGE_MUTATION,
  UNSHARE_NOTE_MUTATION,
} from "@/graphql/operations";
import type {
  NoteSharesQueryResult,
  PageShareLinkQueryResult,
  SharePageResult,
} from "@/graphql/types";
import { collaboratorLabel } from "@/lib/collaborator-display";

export function ShareDialog({
  open,
  onOpenChange,
  pageTitle,
  noteId,
  onShared,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  noteId?: string;
  onShared?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loadShareLink, { loading: linkLoading }] = useLazyQuery<PageShareLinkQueryResult>(
    PAGE_SHARE_LINK_QUERY,
    { fetchPolicy: "network-only" },
  );

  const { data: sharesData, refetch: refetchShares } = useQuery<NoteSharesQueryResult>(
    NOTE_SHARES_QUERY,
    {
      variables: { noteId: noteId ?? "" },
      skip: !open || !noteId,
      fetchPolicy: "network-only",
    },
  );

  const [sharePage, { loading: sharing }] = useMutation<SharePageResult>(
    SHARE_PAGE_MUTATION,
    {
      refetchQueries: noteId
        ? [{ query: NOTE_SHARES_QUERY, variables: { noteId } }, "WorkspaceCollaborators"]
        : ["WorkspaceCollaborators"],
    },
  );

  const [unshare, { loading: unsharing }] = useMutation<{ unshareNote: boolean }>(
    UNSHARE_NOTE_MUTATION,
    {
      refetchQueries: noteId
        ? [{ query: NOTE_SHARES_QUERY, variables: { noteId } }, "WorkspaceCollaborators"]
        : ["WorkspaceCollaborators"],
    },
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

  useEffect(() => {
    if (!open) {
      setEmail("");
      setFeedback(null);
      setError(null);
    }
  }, [open]);

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

  async function handleShareByEmail() {
    if (!noteId || !email.trim()) return;
    setError(null);
    setFeedback(null);
    try {
      const { data } = await sharePage({
        variables: {
          input: { email: email.trim(), noteId },
        },
      });
      const who =
        data?.sharePageWithCollaborator?.sharedWithUser?.name ||
        data?.sharePageWithCollaborator?.sharedWithUser?.email ||
        email.trim();
      setFeedback(`${who} can now edit this page.`);
      setEmail("");
      onShared?.();
      void refetchShares();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not share this page");
    }
  }

  async function handleUnshare(sharedWithUserId: string) {
    if (!noteId) return;
    setError(null);
    try {
      await unshare({
        variables: {
          input: { noteId, sharedWithUserId },
        },
      });
      onShared?.();
      void refetchShares();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove access");
    }
  }

  const shares = sharesData?.noteShares ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share “{pageTitle}”</DialogTitle>
        </DialogHeader>

        {noteId ? (
          <>
            <p className="text-sm text-muted-foreground">
              Invite someone by email to edit this page together. Changes sync live
              while you are both on the document.
            </p>
            <div className="space-y-2">
              <Label htmlFor="share-email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="share-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !sharing && void handleShareByEmail()
                  }
                />
                <Button
                  type="button"
                  disabled={!email.trim() || sharing}
                  onClick={() => void handleShareByEmail()}
                >
                  {sharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {shares.length > 0 && (
              <ul className="space-y-2 rounded-lg border border-border/50 p-2">
                {shares.map((share) => {
                  const user = share.sharedWithUser;
                  const label = user
                    ? collaboratorLabel({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        status: "NOTE_COLLABORATOR",
                      })
                    : "Collaborator";
                  return (
                    <li
                      key={share.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">
                          Can edit · {share.permission}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={unsharing}
                        title="Remove access"
                        onClick={() => void handleUnshare(share.sharedWithUserId)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Open a note to invite editors. You can still copy a link to this view.
          </p>
        )}

        {feedback && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{feedback}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-2 border-t border-border/40 pt-4">
          <Label className="text-muted-foreground">Page link</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={linkLoading ? "Generating link…" : shareUrl}
              className="text-xs"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={!shareUrl || linkLoading}
              onClick={() => void copyLink()}
            >
              {linkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
