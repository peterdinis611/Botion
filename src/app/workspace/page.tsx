"use client";

import { Suspense } from "react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default function WorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceShell />
    </Suspense>
  );
}
