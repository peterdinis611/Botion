"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fbfbfa] px-6 text-center font-sans text-[#37352f]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8e8e6]">
          <AlertTriangle className="h-7 w-7 text-[#6b6b6b]" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Critical error</h1>
          <p className="mt-2 max-w-md text-sm text-[#6b6b6b]">
            Botion ran into a serious problem. Try refreshing the page.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="h-9 rounded-md bg-[#0d9488] px-4 text-sm font-medium text-white hover:bg-[#0d9488]/90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
