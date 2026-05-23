"use client";

import { SettingsView } from "@/components/workspace/settings-view";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function SettingsPage() {
  useNotificationSubscription();

  return (
    <WorkspaceFrame>
      <SettingsView />
    </WorkspaceFrame>
  );
}
