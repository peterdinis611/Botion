"use client";

import { AlertCircle } from "lucide-react";
import { RouteErrorPage } from "@/components/layout/route-error-page";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      error={error}
      reset={reset}
      code={500}
      icon={AlertCircle}
      title="Couldn't load workspace"
      description="We had trouble loading your notes and workspace data."
      hint="Make sure the backend is running on port 3000, then try again."
      secondaryHref="/workspace"
      secondaryLabel="Reload workspace"
    />
  );
}
