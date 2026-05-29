"use client";

import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { INVITE_WORKSPACE_MEMBER_MUTATION } from "@/graphql/operations";
import type { InviteWorkspaceMemberResult } from "@/graphql/types";

export function InviteDialog({
  open,
  onOpenChange,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [invite, { loading }] = useMutation<InviteWorkspaceMemberResult>(
    INVITE_WORKSPACE_MEMBER_MUTATION,
    { refetchQueries: ["Notifications", "WorkspaceCollaborators"] },
  );

  async function handleInvite() {
    if (!email.trim()) return;
    setError(null);
    setFeedback(null);
    try {
      const { data } = await invite({
        variables: {
          input: {
            email: email.trim(),
            message: message.trim() || undefined,
          },
        },
      });
      setFeedback(data?.inviteWorkspaceMember?.message ?? "Invitation sent.");
      onInvited?.();
      setEmail("");
      setMessage("");
      setTimeout(() => {
        setFeedback(null);
        onOpenChange(false);
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send invitation");
    }
  }

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Invite teammates to collaborate on this workspace. They will receive an
          email invitation.
        </p>
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email address</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && void handleInvite()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-message">Message (optional)</Label>
          <Textarea
            id="invite-message"
            rows={2}
            placeholder="Join our workspace to collaborate on notes…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        {feedback && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{feedback}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void handleInvite()} disabled={!email.trim() || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
