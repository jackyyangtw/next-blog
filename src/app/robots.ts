import type { MetadataRoute } from "next";

import { absoluteUrl, getSiteUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio/", "/*/auth", "/*/user"],
    },
    sitemap: absoluteUrl("/sitemap.xml", origin),
    host: origin,
  };
}
