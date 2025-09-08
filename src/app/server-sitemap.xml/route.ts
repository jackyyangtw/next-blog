// app/server-sitemap.xml/route.ts
// https://www.npmjs.com/package/next-sitemap
import { PostDoc } from "@/schema/type/post";
import { getServerSideSitemap } from "next-sitemap";
import { client } from "@/sanity/lib/client";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post"] | order(_createdAt desc) {
      "slug": slug.current,
      _createdAt
    }`
  );

  const fields = posts.map((p) => ({
    loc: `${origin}/post/${p.slug}`,
    lastmod: new Date(p._createdAt ?? Date.now()).toISOString(),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));

  return getServerSideSitemap(fields);
}
