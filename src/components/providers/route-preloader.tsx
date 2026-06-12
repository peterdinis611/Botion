"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { asRoute } from "@/lib/routes";

const WORKSPACE_ROUTES = [
  "/workspace",
  "/workspace/calendar",
  "/workspace/graphs",
  "/workspace/settings",
] as const satisfies readonly Route[];

export function RoutePreloader({
  routes = WORKSPACE_ROUTES,
}: {
  routes?: readonly Route[];
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const route of routes) {
        router.prefetch(asRoute(route));
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router, routes]);

  return null;
}
