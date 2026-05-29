"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InviteDialog } from "@/components/workspace/invite-dialog";
import { ShareDialog } from "@/components/workspace/share-dialog";
import { cn } from "@/lib/utils";

const PLACEHOLDER_MEMBERS = [
  { initials: "AK", color: "bg-[#c45c5c]" },
  { initials: "JL", color: "bg-[#5c8fc4]" },
  { initials: "MR", color: "bg-[#c4a55c]" },
  { initials: "TS", color: "bg-[#8c5cc4]" },
];

export function DocumentHeader({
  title,
  icon,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-4 border-b border-border/40 px-6 py-3",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {icon}
            </span>
          )}
          <span className="truncate text-[13px] font-medium text-foreground">
            {title}
          </span>
          <button
            type="button"
            className="shrink-0 text-muted-foreground/80 transition-colors hover:text-foreground"
            aria-label="Page options"
          >
            <Code2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <nav className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <button
              type="button"
              className="transition-colors hover:text-foreground"
              onClick={() => setShareOpen(true)}
            >
              Share
            </button>
            <Link
              href="/workspace/calendar"
              className="transition-colors hover:text-foreground"
            >
              Updates
            </Link>
            <button
              type="button"
              className="transition-colors hover:text-foreground"
              onClick={() => setInviteOpen(true)}
            >
              Invite members
            </button>
          </nav>

          <div className="flex -space-x-1.5">
            {PLACEHOLDER_MEMBERS.map((member) => (
              <Avatar
                key={member.initials}
                className="h-7 w-7 border-2 border-background"
              >
                <AvatarFallback
                  className={cn("text-[10px] font-medium text-white", member.color)}
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </header>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        pageTitle={title}
      />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
