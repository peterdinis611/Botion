"use client";

import { Suspense } from "react";
import { TryDemoButton } from "@/components/auth/try-demo-button";

export function LandingCtaDemo() {
  return (
    <Suspense fallback={null}>
      <TryDemoButton
        size="lg"
        variant="outline"
        className="w-auto"
        buttonClassName="w-auto border-background/30 bg-transparent px-6 text-background hover:bg-background/10"
        label="Try free demo"
      />
    </Suspense>
  );
}
