"use client";

import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { SettingsView } from "@/components/workspace/settings-view";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function SettingsPage() {
  useNotificationSubscription();

  return (
    <WorkspaceFrame>
      <SettingsView />
    </WorkspaceFrame>
  );
}
