"use client";

import { Suspense } from "react";
import { TryDemoButton } from "@/components/auth/try-demo-button";

export function LandingPricingDemo() {
  return (
    <Suspense fallback={null}>
      <TryDemoButton variant="outline" label="Try demo workspace" />
    </Suspense>
  );
}
