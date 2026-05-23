"use client";

import { GraphsListView } from "@/components/workspace/graphs-list-view";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function GraphsPage() {
  useNotificationSubscription();

  return (
    <WorkspaceFrame>
      <GraphsListView />
    </WorkspaceFrame>
  );
}
