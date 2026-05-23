"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
      icon={AlertTriangle}
      title="Something went wrong"
      description="An unexpected error occurred. You can try again or return to the home page."
    >
      <Button onClick={reset}>Try again</Button>
      <StatusPageLink href="/" variant="secondary">
        Go home
      </StatusPageLink>
    </StatusPage>
  );
}
