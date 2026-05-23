"use client";

import { Suspense, use } from "react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = use(params);

  return (
    <Suspense fallback={null}>
      <WorkspaceShell noteId={noteId} />
    </Suspense>
  );
}
