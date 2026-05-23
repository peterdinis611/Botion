"use client";

import { useSubscription, useApolloClient } from "@apollo/client/react";
import { useEffect } from "react";
import {
  NOTIFICATION_ADDED_SUBSCRIPTION,
  NOTIFICATIONS_QUERY,
} from "@/graphql/operations";
import type {
  Notification,
  NotificationsQueryResult,
} from "@/graphql/types";
import { getToken } from "@/lib/auth";

export function useNotificationSubscription(enabled = true) {
  const client = useApolloClient();

  const { data, error } = useSubscription<{
    notificationAdded: Notification;
  }>(NOTIFICATION_ADDED_SUBSCRIPTION, {
    skip: !enabled || typeof window === "undefined" || !getToken(),
  });

  useEffect(() => {
    const notification = data?.notificationAdded;
    if (!notification) return;

    client.cache.updateQuery<NotificationsQueryResult>(
      { query: NOTIFICATIONS_QUERY },
      (existing) => {
        const list = existing?.notifications ?? [];
        if (list.some((n) => n.id === notification.id)) {
          return existing;
        }
        return {
          notifications: [notification, ...list],
        };
      },
    );
  }, [data?.notificationAdded, client.cache]);

  useEffect(() => {
    if (error) {
      console.warn("[notifications subscription]", error.message);
    }
  }, [error]);
}
