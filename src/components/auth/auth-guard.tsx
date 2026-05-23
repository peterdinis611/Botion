"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getToken } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!getToken()) {
      router.replace("/login");
    }
  }, [isReady, router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (!isAuthenticated && !getToken()) {
    return null;
  }

  return <>{children}</>;
}
