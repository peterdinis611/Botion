"use client";

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

export function InviteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleInvite() {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => {
      setSent(false);
      onOpenChange(false);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
        </div>
        {sent && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Invitation sent successfully.
          </p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!email.trim() || sent}>
            Send invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
