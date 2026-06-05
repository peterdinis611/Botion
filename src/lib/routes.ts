import type { Route } from "next";

/** Cast dynamic paths for Next.js typed routes. */
export function asRoute(path: string): Route {
  return path as Route;
}
