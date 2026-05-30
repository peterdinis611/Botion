"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";
import { cn } from "@/lib/utils";

export function RouteErrorPage({
  error,
  reset,
  code = "500",
  icon,
  title,
  description,
  hint,
  secondaryHref = "/",
  secondaryLabel = "Go home",
  className,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  code?: string | number;
  icon: LucideIcon;
  title: string;
  description: string;
  hint?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code={code}
      icon={icon}
      title={title}
      description={description}
      hint={hint}
      className={className}
      footer={
        (isDev || error.digest) ? (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setShowDetails((open) => !open)}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
              <div
                className={cn(
                  "mt-2 overflow-hidden rounded-lg border border-border/60 bg-muted/40 p-3",
                  "font-mono text-xs text-muted-foreground",
                )}
              >
                {isDev && error.message && (
                  <p className="whitespace-pre-wrap break-words">{error.message}</p>
                )}
                {error.digest && (
                  <p
                    className={cn(
                      isDev && error.message && "mt-2 border-t border-border/40 pt-2",
                    )}
                  >
                    Reference: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : undefined
      }
    >
      <Button onClick={reset}>Try again</Button>
      <StatusPageLink href={secondaryHref} variant="secondary">
        {secondaryLabel}
      </StatusPageLink>
    </StatusPage>
  );
}
