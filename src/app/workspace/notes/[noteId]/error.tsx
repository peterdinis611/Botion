"use client";

import { useEffect } from "react";
import { FileWarning } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function NoteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={FileWarning}
      title="Couldn't open this page"
      description="The note failed to load. It may have been deleted, or there was a network error while fetching it."
      className="min-h-screen"
    >
      <Button onClick={reset}>Try again</Button>
      <StatusPageLink href="/workspace" variant="secondary">
        Back to workspace
      </StatusPageLink>
    </StatusPage>
  );
}
