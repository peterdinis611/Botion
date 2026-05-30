"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { BotionBrandLink } from "@/components/layout/status-page";

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
    <html lang="en">
      <body className="flex min-h-screen flex-col overflow-hidden bg-[#fbfbfa] font-sans text-[#37352f] dark:bg-[#1a1a1a] dark:text-[#f0f0ee]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#e0f2f1,transparent)] opacity-60"
        />

        <header className="relative z-10 px-6 py-6">
          <BotionBrandLink href="/" />
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="font-mono text-sm tracking-widest text-[#6b6b6b]">500</p>

          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e8e8e6] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#242424]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f4f2] dark:bg-[#2a2a2a]">
              <AlertTriangle className="h-6 w-6 text-[#6b6b6b]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Critical error</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6b6b6b]">
            Botion ran into a serious problem and couldn&apos;t recover. Try refreshing
            the page.
          </p>

          {error.digest && (
            <p className="mt-3 font-mono text-xs text-[#6b6b6b]">
              Reference: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex h-9 items-center justify-center rounded-md bg-[#0d9488] px-4 text-sm font-medium text-white hover:bg-[#0d9488]/90 dark:bg-[#e8e8e6] dark:text-[#1a1a1a] dark:hover:bg-[#e8e8e6]/90"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
