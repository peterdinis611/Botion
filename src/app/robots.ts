import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: ["/workspace", "/workspace/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
