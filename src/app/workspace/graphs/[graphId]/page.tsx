"use client";

import { use } from "react";
import { GraphEditor } from "@/components/workspace/graph-editor";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { useNotificationSubscription } from "@/hooks/use-notification-subscription";

export default function GraphEditorPage({
  params,
}: {
  params: Promise<{ graphId: string }>;
}) {
  const { graphId } = use(params);
  useNotificationSubscription();

  return (
    <WorkspaceFrame className="flex min-h-0 flex-col">
      <GraphEditor graphId={graphId} />
    </WorkspaceFrame>
  );
}
