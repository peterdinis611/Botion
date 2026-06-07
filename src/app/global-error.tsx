"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { BotionBrandLink } from "@/components/layout/status-page";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

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
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-screen flex-col overflow-hidden bg-background font-sans text-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)] opacity-80"
        />

        <header className="relative z-10 px-6 py-6">
          <BotionBrandLink href="/" />
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="font-mono text-sm tracking-widest text-muted-foreground">500</p>

          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Critical error</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Botion ran into a serious problem and couldn&apos;t recover. Try refreshing
            the page.
          </p>

          {error.digest && (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              Reference: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
