"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CANCEL_WORKSPACE_INVITE_MUTATION,
  INVITE_WORKSPACE_MEMBER_MUTATION,
  NOTE_SHARES_QUERY,
  PAGE_SHARE_LINK_QUERY,
  SHARE_PAGE_MUTATION,
  UNSHARE_NOTE_MUTATION,
  WORKSPACE_COLLABORATORS_QUERY,
} from "@/graphql/operations";
import type {
  CancelWorkspaceInviteResult,
  InviteWorkspaceMemberResult,
  NoteSharesQueryResult,
  PageShareLinkQueryResult,
  SharePageResult,
  WorkspaceCollaborator,
} from "@/graphql/types";
import { useWorkspaceCollaborators } from "@/hooks/use-workspace-collaborators";
import { cn } from "@/lib/utils";
import { PeopleList } from "./people/people-list";
import { ShareLinkFooter } from "./people/share-link-footer";

type PanelMode = "page" | "workspace";

function InviteEmailForm({
  mode,
  email,
  message,
  busy,
  onEmailChange,
  onMessageChange,
  onSubmit,
}: {
  mode: PanelMode;
  email: string;
  message: string;
  busy: boolean;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const isPage = mode === "page";

  return (
    <div className="space-y-3">
      <Label htmlFor="people-email" className="text-muted-foreground">
        {isPage ? "Invite by email" : "Invite to workspace"}
      </Label>
      <p className="text-xs text-muted-foreground">
        {isPage
          ? "They will get edit access to this page only."
          : "They can join your workspace and collaborate on shared pages."}
      </p>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="people-email"
            type="email"
            className="pl-9"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !busy && onSubmit()}
          />
        </div>
        <Button type="button" disabled={!email.trim() || busy} onClick={onSubmit}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
        </Button>
      </div>
      {!isPage && (
        <Textarea
          rows={2}
          placeholder="Optional message…"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="text-sm"
        />
      )}
    </div>
  );
}

function ModeTabs({
  mode,
  pageCount,
  workspaceCount,
  onChange,
}: {
  mode: PanelMode;
  pageCount: number;
  workspaceCount: number;
  onChange: (mode: PanelMode) => void;
}) {
  const tabs: { id: PanelMode; label: string; count: number }[] = [
    { id: "page", label: "This page", count: pageCount },
    { id: "workspace", label: "Workspace", count: workspaceCount },
  ];

  return (
    <div className="flex rounded-lg bg-muted/50 p-1 text-xs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 font-medium transition-colors",
            mode === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function PeoplePanel({
  open,
  onOpenChange,
  pageTitle,
  noteId,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  noteId?: string;
  onChanged?: () => void;
}) {
  const [mode, setMode] = useState<PanelMode>(noteId ? "page" : "workspace");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [cancellingInviteId, setCancellingInviteId] = useState<string | null>(null);

  const { all: collaborators, refetch: refetchCollaborators } =
    useWorkspaceCollaborators(noteId);

  const { data: sharesData, refetch: refetchShares } = useQuery<NoteSharesQueryResult>(
    NOTE_SHARES_QUERY,
    {
      variables: { noteId: noteId ?? "" },
      skip: !open || !noteId,
      fetchPolicy: "network-only",
    },
  );

  const [loadShareLink, { loading: linkLoading }] = useLazyQuery<PageShareLinkQueryResult>(
    PAGE_SHARE_LINK_QUERY,
    { fetchPolicy: "network-only" },
  );

  const refetchAll = () => {
    void refetchCollaborators();
    if (noteId) void refetchShares();
    onChanged?.();
  };

  const [sharePage, { loading: sharing }] = useMutation<SharePageResult>(
    SHARE_PAGE_MUTATION,
    {
      refetchQueries: [
        "WorkspaceCollaborators",
        ...(noteId ? [{ query: NOTE_SHARES_QUERY, variables: { noteId } }] : []),
      ],
    },
  );

  const [inviteWorkspace, { loading: inviting }] =
    useMutation<InviteWorkspaceMemberResult>(INVITE_WORKSPACE_MEMBER_MUTATION, {
      refetchQueries: [
        "Notifications",
        "WorkspaceCollaborators",
        { query: WORKSPACE_COLLABORATORS_QUERY, variables: { noteId: noteId ?? null } },
      ],
    });

  const [unshare, { loading: unsharing }] = useMutation<{ unshareNote: boolean }>(
    UNSHARE_NOTE_MUTATION,
    {
      refetchQueries: [
        "WorkspaceCollaborators",
        ...(noteId ? [{ query: NOTE_SHARES_QUERY, variables: { noteId } }] : []),
      ],
    },
  );

  const [cancelInvite] = useMutation<CancelWorkspaceInviteResult>(
    CANCEL_WORKSPACE_INVITE_MUTATION,
    {
      refetchQueries: [
        "Notifications",
        "WorkspaceCollaborators",
        { query: WORKSPACE_COLLABORATORS_QUERY, variables: { noteId: noteId ?? null } },
      ],
    },
  );

  const shares = sharesData?.noteShares ?? [];

  const { self, pageEditors, pendingInvites, workspaceMembers } = useMemo(() => {
    const pageEditorIds = new Set(shares.map((s) => s.sharedWithUserId));
    const pageEditorsFromShares: WorkspaceCollaborator[] = shares.map((s) => {
      const u = s.sharedWithUser;
      return {
        id: s.sharedWithUserId,
        email: u?.email ?? "",
        name: u?.name,
        status: "NOTE_COLLABORATOR" as const,
        permission: s.permission,
        noteId: s.noteId,
      };
    });

    for (const c of collaborators.filter((x) => x.status === "NOTE_COLLABORATOR")) {
      if (!pageEditorIds.has(c.id)) {
        pageEditorsFromShares.push(c);
      }
    }

    return {
      self: collaborators.find((c) => c.status === "SELF") ?? null,
      pageEditors: pageEditorsFromShares,
      pendingInvites: collaborators.filter((c) => c.status === "PENDING_INVITE"),
      workspaceMembers: collaborators.filter((c) => c.status === "MEMBER"),
    };
  }, [collaborators, shares]);

  const workspacePeople = useMemo(() => {
    const list: WorkspaceCollaborator[] = [];
    if (self) list.push(self);
    list.push(...workspaceMembers);
    list.push(...pendingInvites);
    return list;
  }, [self, workspaceMembers, pendingInvites]);

  useEffect(() => {
    if (!open) return;
    setMode(noteId ? "page" : "workspace");
  }, [open, noteId]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setMessage("");
      setFeedback(null);
      setError(null);
      return;
    }

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
          // fallback below
        }
      }
      setShareUrl(window.location.href);
    }

    void resolveUrl();
  }, [open, noteId, loadShareLink]);

  async function handleSubmit() {
    if (!email.trim()) return;
    setError(null);
    setFeedback(null);

    try {
      if (mode === "page" && noteId) {
        const { data } = await sharePage({
          variables: { input: { email: email.trim(), noteId } },
        });
        const who =
          data?.sharePageWithCollaborator?.sharedWithUser?.name ||
          data?.sharePageWithCollaborator?.sharedWithUser?.email ||
          email.trim();
        setFeedback(`${who} can now edit “${pageTitle}”.`);
      } else {
        const { data } = await inviteWorkspace({
          variables: {
            input: {
              email: email.trim(),
              message: message.trim() || undefined,
            },
          },
        });
        setFeedback(
          data?.inviteWorkspaceMember?.message ?? "Workspace invitation sent.",
        );
      }
      setEmail("");
      setMessage("");
      refetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function handleUnshare(sharedWithUserId: string) {
    if (!noteId) return;
    setError(null);
    try {
      await unshare({
        variables: { input: { noteId, sharedWithUserId } },
      });
      refetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove access");
    }
  }

  async function handleCancelInvite(inviteId: string) {
    setError(null);
    setCancellingInviteId(inviteId);
    try {
      await cancelInvite({ variables: { input: { inviteId } } });
      refetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel invitation");
    } finally {
      setCancellingInviteId(null);
    }
  }

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

  const busy = sharing || inviting;
  const showPageTab = Boolean(noteId);
  const activeMode = showPageTab ? mode : "workspace";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setError(null);
          setFeedback(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[min(90vh,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 border-b border-border/40 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-muted-foreground" />
            People
          </DialogTitle>
          <DialogDescription className="text-left">
            {showPageTab
              ? `Share “${pageTitle}” or manage who has access to your workspace.`
              : "Invite collaborators to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {showPageTab && (
            <ModeTabs
              mode={mode}
              pageCount={pageEditors.length}
              workspaceCount={workspaceMembers.length + pendingInvites.length}
              onChange={setMode}
            />
          )}

          <InviteEmailForm
            mode={activeMode}
            email={email}
            message={message}
            busy={busy || (activeMode === "page" && !noteId)}
            onEmailChange={setEmail}
            onMessageChange={setMessage}
            onSubmit={() => void handleSubmit()}
          />

          {feedback && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
              {feedback}
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {activeMode === "page" ? (
              <motion.div
                key="page"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <PeopleList
                  title="Page editors"
                  count={pageEditors.length}
                  people={pageEditors}
                  emptyTitle="No editors yet"
                  emptyHint="Invite someone by email above — they can edit this page live."
                  getAction={(person) => ({
                    type: "remove",
                    label: "Remove from this page",
                    loading: unsharing,
                    onClick: () => void handleUnshare(person.id),
                  })}
                />
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <PeopleList
                  title="Workspace"
                  count={workspacePeople.length}
                  people={workspacePeople}
                  emptyTitle="Just you for now"
                  emptyHint="Send a workspace invite above to add collaborators."
                  getAction={(person) => {
                    if (person.status !== "PENDING_INVITE" || !person.inviteId) {
                      return undefined;
                    }
                    return {
                      type: "cancel",
                      label: "Cancel invitation",
                      loading: cancellingInviteId === person.inviteId,
                      onClick: () => void handleCancelInvite(person.inviteId!),
                    };
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showPageTab && activeMode === "page" && (
          <ShareLinkFooter
            shareUrl={shareUrl}
            loading={linkLoading}
            copied={copied}
            onCopy={() => void copyLink()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
