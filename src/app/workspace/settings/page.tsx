"use client";

import { SettingsView } from "@/components/workspace/settings-view";
import { WorkspaceSectionShell } from "@/components/workspace/workspace-section-shell";

export default function SettingsPage() {
  return (
    <WorkspaceSectionShell
      title="Settings"
      icon={<span className="text-[15px] leading-none">⚙️</span>}
    >
      <SettingsView />
    </WorkspaceSectionShell>
  );
}
