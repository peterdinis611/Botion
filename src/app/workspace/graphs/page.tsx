"use client";

import { GraphsListView } from "@/components/workspace/graphs-list-view";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

export default function GraphsPage() {
  return (
    <WorkspaceFrame>
      <GraphsListView />
    </WorkspaceFrame>
  );
}
