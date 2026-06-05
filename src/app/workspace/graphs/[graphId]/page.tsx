"use client";

import { use } from "react";
import { GraphEditor } from "@/components/workspace/graph-editor";
import { WorkspaceSectionShell } from "@/components/workspace/workspace-section-shell";

export default function GraphEditorPage({
  params,
}: {
  params: Promise<{ graphId: string }>;
}) {
  const { graphId } = use(params);

  return (
    <WorkspaceSectionShell
      title="Graph editor"
      icon={<span className="text-[15px] leading-none">🕸️</span>}
      className="flex min-h-0 flex-col"
    >
      <GraphEditor graphId={graphId} />
    </WorkspaceSectionShell>
  );
}
