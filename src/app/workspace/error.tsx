"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function WorkspaceError({
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
      icon={AlertCircle}
      title="Couldn't load workspace"
      description="We had trouble loading your notes. This is often a connection issue — make sure the backend is running and try again."
      className="min-h-screen"
    >
      <Button onClick={reset}>Try again</Button>
      <StatusPageLink href="/workspace" variant="secondary">
        Reload workspace
      </StatusPageLink>
    </StatusPage>
  );
}
