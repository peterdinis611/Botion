import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const siteConfig = {
  name: "Botion",
  title: "Botion — All-in-one workspace",
  description:
    "Write, plan, and organize ideas with notes, tags, graphs, and calendar in one workspace.",
  tagline: "Notes, graphs, and calendar in one calm workspace.",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
} as const;

export function createMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const pageTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description ?? siteConfig.description;
  const canonical = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical },
    applicationName: siteConfig.name,
    keywords: [
      "notes",
      "workspace",
      "knowledge base",
      "graph view",
      "calendar",
      "productivity",
      "writing",
    ],
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [siteConfig.ogImage],
    },
  };
}
