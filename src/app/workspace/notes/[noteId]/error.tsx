"use client";

import { FileWarning } from "lucide-react";
import { RouteErrorPage } from "@/components/layout/route-error-page";

export default function NoteError({
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
      icon={FileWarning}
      title="Couldn't open this page"
      description="The note failed to load — it may have been deleted or there was a network error."
      hint="Your other notes are still safe in the workspace."
      secondaryHref="/workspace"
      secondaryLabel="Back to workspace"
    />
  );
}
