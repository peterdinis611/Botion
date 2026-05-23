"use client";

import { useApolloClient, useSubscription } from "@apollo/client/react";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  NOTIFICATION_ADDED_SUBSCRIPTION,
  NOTIFICATIONS_QUERY,
} from "@/graphql/operations";
import type { Notification, NotificationsQueryResult } from "@/graphql/types";

export function useNotificationSubscription(enabled = true) {
  const client = useApolloClient();
  const { isReady, isAuthenticated } = useAuth();

  const shouldSubscribe = enabled && isReady && isAuthenticated;

  const { data, error } = useSubscription<{
    notificationAdded: Notification;
  }>(NOTIFICATION_ADDED_SUBSCRIPTION, {
    skip: !shouldSubscribe,
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
    if (!error || !shouldSubscribe) return;

    const message = error.message.toLowerCase();
    const isAuthError =
      message.includes("authorization") || message.includes("unauthorized");

    if (!isAuthError) {
      console.warn("[notifications subscription]", error.message);
    }
  }, [error, shouldSubscribe]);
}
