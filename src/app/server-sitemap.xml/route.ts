// app/server-sitemap.xml/route.ts
// https://www.npmjs.com/package/next-sitemap
import { PostDoc } from "@/schema/type/post";
import { getServerSideSitemap } from "next-sitemap";
import { client } from "@/sanity/lib/client";
import { NextRequest } from "next/server";
import { languages } from "@/i18n/config";
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post"] | order(_createdAt desc) {
      "slug": slug.current,
      _createdAt
    }`,
  );

  const fields = posts.flatMap((p) =>
    languages.map((lng) => ({
      loc: `${origin}/${lng}/post/${p.slug}`,
      lastmod: new Date(p._createdAt ?? Date.now()).toISOString(),
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  );

  console.log(fields);

  return getServerSideSitemap(fields);
}
