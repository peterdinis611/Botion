"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Bell,
  CheckCheck,
  FileText,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ACCEPT_WORKSPACE_INVITE_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
  NOTIFICATIONS_QUERY,
  REMOVE_NOTIFICATION_MUTATION,
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
import { asRoute } from "@/lib/routes";
import { listItemExit, slideInRight, staggerContainer } from "@/lib/motion";
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
  onDelete,
  acceptingId,
  deletingId,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onAcceptInvite: (inviteId: string, notificationId: string) => void;
  onOpenNote: (path: string, notificationId: string) => void;
  onDelete: (id: string) => void;
  acceptingId: string | null;
  deletingId: string | null;
}) {
  const metadata = parseNotificationMetadata(notification.metadata);
  const showAccept = canAcceptWorkspaceInvite(notification, metadata);
  const showOpenNote = canOpenSharedNote(notification, metadata);
  const notePath = notificationNotePath(metadata);
  const isInvite = notification.type === "WORKSPACE_INVITE";
  const isShare = notification.type === "NOTE_SHARED";
  const isDeleting = deletingId === notification.id;

  return (
    <motion.li
      layout
      variants={listItemExit}
      initial="visible"
      animate="visible"
      exit="exit"
      className={cn(
        "group relative overflow-hidden rounded-lg border border-transparent transition-colors",
        !notification.isRead && "border-primary/15 bg-primary/5",
        isDeleting && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-start gap-2 px-3 py-2.5">
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

        <div className="min-w-0 flex-1 pr-6">
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
                disabled={acceptingId === notification.id || isDeleting}
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
                disabled={isDeleting}
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
                disabled={isDeleting}
                onClick={() => onMarkRead(notification.id)}
              >
                Mark read
              </Button>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete notification"
          disabled={isDeleting}
          className="absolute right-1.5 top-1.5 h-7 w-7 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          onClick={() => onDelete(notification.id)}
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
        </Button>

        {!notification.isRead && (
          <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
        )}
      </div>
    </motion.li>
  );
}

function removeNotificationFromCache(
  cache: import("@apollo/client").ApolloCache,
  id: string,
) {
  cache.updateQuery<NotificationsQueryResult>(
    { query: NOTIFICATIONS_QUERY },
    (existing) => {
      if (!existing) return existing;
      return {
        notifications: existing.notifications.filter((n) => n.id !== id),
      };
    },
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const prevUnread = useRef(0);

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: NOTIFICATIONS_QUERY }],
  });
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: [{ query: NOTIFICATIONS_QUERY }],
  });
  const [removeNotification] = useMutation(REMOVE_NOTIFICATION_MUTATION);
  const [acceptInvite] = useMutation<AcceptWorkspaceInviteResult>(
    ACCEPT_WORKSPACE_INVITE_MUTATION,
    { refetchQueries: ["Notifications", "WorkspaceCollaborators"] },
  );

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;
  const [bellPulse, setBellPulse] = useState(false);

  useEffect(() => {
    if (unread > prevUnread.current) {
      setBellPulse(true);
      const t = window.setTimeout(() => setBellPulse(false), 700);
      prevUnread.current = unread;
      return () => window.clearTimeout(t);
    }
    prevUnread.current = unread;
  }, [unread]);

  async function handleMarkRead(id: string) {
    await markRead({ variables: { id } });
  }

  async function handleMarkAll() {
    await markAllRead();
    void refetch();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await removeNotification({
        variables: { id },
        update(cache) {
          removeNotificationFromCache(cache, id);
        },
      });
    } finally {
      setDeletingId(null);
    }
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
    setOpen(false);
    router.push(asRoute(path));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <motion.span
            animate={
              bellPulse
                ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1] }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Bell className="h-4 w-4" />
          </motion.span>
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key={unread}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
              >
                {unread > 9 ? "9+" : unread}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 overflow-hidden p-0" align="end">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-sm font-medium">Notifications</span>
            <div className="flex items-center gap-1">
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
          </div>

          <ScrollArea className="max-h-80">
            {notifications.length === 0 ? (
              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center px-6 py-10 text-center"
              >
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </span>
                <p className="text-sm font-medium text-foreground">All caught up</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  New invites and shares will appear here.
                </p>
              </motion.div>
            ) : (
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-1 p-1.5"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkRead={(id) => void handleMarkRead(id)}
                      onAcceptInvite={(inviteId, notificationId) =>
                        void handleAcceptInvite(inviteId, notificationId)
                      }
                      onOpenNote={(path, notificationId) =>
                        void handleOpenNote(path, notificationId)
                      }
                      onDelete={(id) => void handleDelete(id)}
                      acceptingId={acceptingId}
                      deletingId={deletingId}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </ScrollArea>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
