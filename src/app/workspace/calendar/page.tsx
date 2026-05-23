"use client";

import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { CalendarView } from "@/components/workspace/calendar-view";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function CalendarPage() {
  useNotificationSubscription();

  return (
    <WorkspaceFrame>
      <CalendarView />
    </WorkspaceFrame>
  );
}
