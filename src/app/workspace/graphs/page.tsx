"use client";

import { GraphsListView } from "@/components/workspace/graphs-list-view";
import { WorkspaceSectionShell } from "@/components/workspace/workspace-section-shell";

export default function GraphsPage() {
  return (
    <WorkspaceSectionShell
      title="Graphs"
      icon={<span className="text-[15px] leading-none">🕸️</span>}
    >
      <GraphsListView />
    </WorkspaceSectionShell>
  );
}
