"use client";

import { Suspense } from "react";
import { TryDemoButton } from "@/components/auth/try-demo-button";

export function LandingDemoCta({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) return null;

  return (
    <Suspense fallback={null}>
      <TryDemoButton
        variant="outline"
        className="mt-4 max-w-md"
        label="Try free demo — no signup"
      />
    </Suspense>
  );
}
