import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "All-in-one workspace",
  description:
    "Botion brings notes, knowledge graphs, tags, and calendar into one calm workspace for writing and planning.",
  path: "/",
});

export default function HomePage() {
  return <LandingPage />;
}
