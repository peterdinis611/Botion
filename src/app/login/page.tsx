import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Skeleton } from "@/components/ui/skeleton";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign in",
  description: "Sign in to your Botion workspace to access notes, graphs, and calendar.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
          B
        </span>
        Botion
      </Link>
      <Suspense
        fallback={
          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        }
      >
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
