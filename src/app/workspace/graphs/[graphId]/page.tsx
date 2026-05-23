"use client";

import { use } from "react";
import { GraphEditor } from "@/components/workspace/graph-editor";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

export default function GraphEditorPage({
  params,
}: {
  params: Promise<{ graphId: string }>;
}) {
  const { graphId } = use(params);

  return (
    <WorkspaceFrame className="flex min-h-0 flex-col">
      <GraphEditor graphId={graphId} />
    </WorkspaceFrame>
  );
}
