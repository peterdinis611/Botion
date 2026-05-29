"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  Check,
  Copy,
  Loader2,
  Mail,
  UserMinus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  INVITE_WORKSPACE_MEMBER_MUTATION,
  NOTE_SHARES_QUERY,
  PAGE_SHARE_LINK_QUERY,
  SHARE_PAGE_MUTATION,
  UNSHARE_NOTE_MUTATION,
  WORKSPACE_COLLABORATORS_QUERY,
} from "@/graphql/operations";
import type {
  InviteWorkspaceMemberResult,
  NoteSharesQueryResult,
  PageShareLinkQueryResult,
  SharePageResult,
  WorkspaceCollaborator,
} from "@/graphql/types";
import { useWorkspaceCollaborators } from "@/hooks/use-workspace-collaborators";
import {
  collaboratorColor,
  collaboratorInitials,
  collaboratorLabel,
  collaboratorRoleLabel,
} from "@/lib/collaborator-display";
import { cn } from "@/lib/utils";

type InviteMode = "page" | "workspace";

function PersonRow({
  person,
  subtitle,
  onRemove,
  removing,
}: {
  person: WorkspaceCollaborator;
  subtitle?: string;
  onRemove?: () => void;
  removing?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/40">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium text-white",
            collaboratorColor(person.id),
            person.status === "PENDING_INVITE" && "opacity-90",
          )}
        >
          {collaboratorInitials(person)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{collaboratorLabel(person)}</p>
        <p className="truncate text-xs text-muted-foreground">
          {subtitle ?? person.email}
        </p>
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          disabled={removing}
          title="Remove from this page"
          onClick={onRemove}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
}

function PeopleSection({
  title,
  empty,
  children,
}: {
  title: string;
  empty?: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  if (!hasChildren && empty) {
    return (
      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          {empty}
        </p>
      </section>
    );
  }

  if (!hasChildren) return null;

  return (
    <section className="space-y-1">
      <h3 className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul>{children}</ul>
    </section>
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
  const [mode, setMode] = useState<InviteMode>(noteId ? "page" : "workspace");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

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

  const shares = sharesData?.noteShares ?? [];

  const { pageEditors, pendingInvites, workspaceMembers } = useMemo(() => {
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

    const fromQuery = collaborators.filter((c) => c.status === "NOTE_COLLABORATOR");
    for (const c of fromQuery) {
      if (!pageEditorIds.has(c.id)) {
        pageEditorsFromShares.push(c);
      }
    }

    return {
      pageEditors: pageEditorsFromShares,
      pendingInvites: collaborators.filter((c) => c.status === "PENDING_INVITE"),
      workspaceMembers: collaborators.filter((c) => c.status === "MEMBER"),
    };
  }, [collaborators, shares]);

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
          // fallback
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
        setFeedback(`${who} can edit “${pageTitle}”.`);
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
          <p className="text-left text-sm font-normal text-muted-foreground">
            Manage workspace members and share “{pageTitle}” for live editing.
          </p>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {noteId && (
            <div className="flex rounded-lg bg-muted/50 p-1 text-xs">
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-md px-3 py-2 font-medium transition-colors",
                  mode === "page"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setMode("page")}
              >
                Share this document
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-md px-3 py-2 font-medium transition-colors",
                  mode === "workspace"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setMode("workspace")}
              >
                Invite to workspace
              </button>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="people-email" className="text-muted-foreground">
              {mode === "page" && noteId
                ? "Email — can edit this page"
                : "Email — workspace invite"}
            </Label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="people-email"
                  type="email"
                  className="pl-9"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !busy && void handleSubmit()}
                />
              </div>
              <Button
                type="button"
                disabled={!email.trim() || busy || (mode === "page" && !noteId)}
                onClick={() => void handleSubmit()}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>
            {mode === "workspace" && (
              <Textarea
                rows={2}
                placeholder="Optional message for the invite…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-sm"
              />
            )}
            {!noteId && (
              <p className="text-xs text-muted-foreground">
                Open a document to share edit access. Workspace invites appear in
                the list below.
              </p>
            )}
          </div>

          {feedback && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{feedback}</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {noteId && (
            <PeopleSection
              title="Can edit this document"
              empty="Nobody else has edit access yet. Add an email above."
            >
              {pageEditors.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  subtitle={collaboratorRoleLabel(person.status, person.permission)}
                  onRemove={() => void handleUnshare(person.id)}
                  removing={unsharing}
                />
              ))}
            </PeopleSection>
          )}

          <PeopleSection
            title="Pending workspace invites"
            empty="No pending invites."
          >
            {pendingInvites.map((person) => (
              <PersonRow
                key={`${person.id}-${person.email}`}
                person={person}
                subtitle={collaboratorRoleLabel(person.status)}
              />
            ))}
          </PeopleSection>

          <PeopleSection
            title="Workspace"
            empty="Share a document or send a workspace invite to add people."
          >
            {workspaceMembers.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                subtitle={collaboratorRoleLabel(person.status, person.permission)}
              />
            ))}
          </PeopleSection>

          <div className="space-y-2 border-t border-border/40 pt-2">
            <Label className="text-xs text-muted-foreground">Link to this page</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={linkLoading ? "Generating…" : shareUrl}
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="shrink-0"
                disabled={!shareUrl || linkLoading}
                onClick={() => void copyLink()}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
