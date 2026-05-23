"use client";

import { SettingsView } from "@/components/workspace/settings-view";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

export default function SettingsPage() {
  return (
    <WorkspaceFrame>
      <SettingsView />
    </WorkspaceFrame>
  );
}
