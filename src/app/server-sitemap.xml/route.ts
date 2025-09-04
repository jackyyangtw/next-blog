// app/server-sitemap.xml/route.ts
import { getServerSideSitemap } from "next-sitemap";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // 一次抓多一點，或你的 API 做無限分頁內部合併
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });
  const { data: posts } = (await res.json()) as {
    data: Array<{ slug: string; _createdAt?: string }>;
  };

  const fields = posts.map((p) => ({
    loc: `${baseUrl}/posts/${p.slug}`,
    lastmod: new Date(p._createdAt ?? Date.now()).toISOString(),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));

  return getServerSideSitemap(fields);
}
