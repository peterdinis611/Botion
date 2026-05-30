"use client";

import { Suspense } from "react";
import { TryDemoButton } from "@/components/auth/try-demo-button";

export function LandingHeaderDemoLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) return null;

  return (
    <Suspense fallback={null}>
      <TryDemoButton
        variant="ghost"
        size="sm"
        showIcon={false}
        className="hidden w-auto sm:block"
        buttonClassName="w-auto px-2 text-[14px] font-medium text-muted-foreground hover:text-foreground"
        label="Try demo"
      />
    </Suspense>
  );
}
