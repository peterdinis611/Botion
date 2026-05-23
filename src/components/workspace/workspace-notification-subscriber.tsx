"use client";

import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

/** Single subscription for the whole workspace (avoid duplicate WS connections). */
export function WorkspaceNotificationSubscriber() {
  useNotificationSubscription();
  return null;
}
