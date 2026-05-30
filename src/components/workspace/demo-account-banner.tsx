"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { isDemoAccountEmail } from "@/lib/demo-account";

const DISMISS_KEY = "botion_demo_banner_dismissed";

export function DemoAccountBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  if (!user || !isDemoAccountEmail(user.email) || dismissed) {
    return null;
  }

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="flex items-center gap-3 border-b border-primary/20 bg-accent/80 px-4 py-2 text-sm text-accent-foreground">
      <p className="min-w-0 flex-1">
        You&apos;re exploring a <span className="font-medium">free demo</span> with sample
        pages.{" "}
        <Link href="/register" className="font-medium underline underline-offset-2">
          Create an account
        </Link>{" "}
        to keep your work.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
