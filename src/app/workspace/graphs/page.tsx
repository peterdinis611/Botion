"use client";

import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { GraphsListView } from "@/components/workspace/graphs-list-view";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function GraphsPage() {
  useNotificationSubscription();

  return (
    <WorkspaceFrame>
      <GraphsListView />
    </WorkspaceFrame>
  );
}
