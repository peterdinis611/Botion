"use client";

import { AlertTriangle } from "lucide-react";
import { RouteErrorPage } from "@/components/layout/route-error-page";

export default function GlobalError({
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
      icon={AlertTriangle}
      title="Something went wrong"
      description="An unexpected error occurred while loading this page."
      hint="If the problem persists, try signing out and back in."
      secondaryHref="/"
      secondaryLabel="Go home"
    />
  );
}
