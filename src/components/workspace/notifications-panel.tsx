"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
  NOTIFICATIONS_QUERY,
} from "@/graphql/operations";
import type { NotificationsQueryResult } from "@/graphql/types";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";
import { cn } from "@/lib/utils";

export function NotificationsPanel() {
  useNotificationSubscription();
  const { data, refetch } = useQuery<NotificationsQueryResult>(NOTIFICATIONS_QUERY);

  const [markRead] = useMutation(MARK_NOTIFICATION_READ);
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={handleMarkAll}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-72">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            <ul className="p-1">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                      !n.isRead && "bg-accent/50",
                    )}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                  >
                    <p className="font-medium leading-snug">{n.type}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
