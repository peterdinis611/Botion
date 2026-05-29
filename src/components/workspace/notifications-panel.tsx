"use client";

import { motion } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client/react";
import { Bell, CheckCheck, FileText, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ACCEPT_WORKSPACE_INVITE_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
  NOTIFICATIONS_QUERY,
} from "@/graphql/operations";
import type {
  AcceptWorkspaceInviteResult,
  Notification,
  NotificationsQueryResult,
} from "@/graphql/types";
import {
  canAcceptWorkspaceInvite,
  canOpenSharedNote,
  notificationNotePath,
  notificationTitle,
  parseNotificationMetadata,
} from "@/lib/notification-display";
import { cn } from "@/lib/utils";

function formatNotificationTime(createdAt: string) {
  const date = new Date(createdAt);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function NotificationItem({
  notification,
  onMarkRead,
  onAcceptInvite,
  onOpenNote,
  acceptingId,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onAcceptInvite: (inviteId: string, notificationId: string) => void;
  onOpenNote: (path: string, notificationId: string) => void;
  acceptingId: string | null;
}) {
  const metadata = parseNotificationMetadata(notification.metadata);
  const showAccept = canAcceptWorkspaceInvite(notification, metadata);
  const showOpenNote = canOpenSharedNote(notification, metadata);
  const notePath = notificationNotePath(metadata);
  const isInvite = notification.type === "WORKSPACE_INVITE";
  const isShare = notification.type === "NOTE_SHARED";

  return (
    <li
      className={cn(
        "rounded-md border border-transparent px-3 py-2.5 transition-colors",
        !notification.isRead && "border-border/50 bg-accent/40",
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            isInvite && "bg-violet-500/15 text-violet-600 dark:text-violet-400",
            isShare && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
            !isInvite && !isShare && "bg-muted text-muted-foreground",
          )}
        >
          {isShare ? (
            <FileText className="h-3.5 w-3.5" />
          ) : (
            <UserPlus className="h-3.5 w-3.5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">
            {notificationTitle(notification)}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {notification.message}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/80">
            {formatNotificationTime(notification.createdAt)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {showAccept && metadata?.inviteId && (
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs"
                disabled={acceptingId === notification.id}
                onClick={() =>
                  onAcceptInvite(metadata.inviteId!, notification.id)
                }
              >
                {acceptingId === notification.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Accept invite"
                )}
              </Button>
            )}
            {showOpenNote && notePath && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 text-xs"
                onClick={() => onOpenNote(notePath, notification.id)}
              >
                Open document
              </Button>
            )}
            {!notification.isRead && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export function NotificationsPanel({
  onInviteAccepted,
}: {
  onInviteAccepted?: () => void;
}) {
  const router = useRouter();
  const { data, refetch } = useQuery<NotificationsQueryResult>(NOTIFICATIONS_QUERY);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const [markRead] = useMutation(MARK_NOTIFICATION_READ);
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
  const [acceptInvite] = useMutation<AcceptWorkspaceInviteResult>(
    ACCEPT_WORKSPACE_INVITE_MUTATION,
    { refetchQueries: ["Notifications", "WorkspaceCollaborators"] },
  );

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  async function handleMarkRead(id: string) {
    await markRead({ variables: { id } });
    void refetch();
  }

  async function handleMarkAll() {
    await markAllRead();
    void refetch();
  }

  async function handleAcceptInvite(inviteId: string, notificationId: string) {
    setAcceptingId(notificationId);
    try {
      await acceptInvite({ variables: { input: { inviteId } } });
      await markRead({ variables: { id: notificationId } });
      onInviteAccepted?.();
      void refetch();
    } finally {
      setAcceptingId(null);
    }
  }

  async function handleOpenNote(path: string, notificationId: string) {
    await markRead({ variables: { id: notificationId } });
    void refetch();
    router.push(path);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <motion.span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => void handleMarkAll()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            <ul className="space-y-1 p-1">
              {notifications.map((n, index) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                >
                  <NotificationItem
                    notification={n}
                    onMarkRead={(id) => void handleMarkRead(id)}
                    onAcceptInvite={(inviteId, notificationId) =>
                      void handleAcceptInvite(inviteId, notificationId)
                    }
                    onOpenNote={(path, notificationId) =>
                      void handleOpenNote(path, notificationId)
                    }
                    acceptingId={acceptingId}
                  />
                </motion.div>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
