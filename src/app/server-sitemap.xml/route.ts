// app/server-sitemap.xml/route.ts
// https://www.npmjs.com/package/next-sitemap
import { PostDoc } from "@/schema/type/post";
import { getServerSideSitemap } from "next-sitemap";
import { publicClient } from "@/sanity/lib/client";
import { NextRequest } from "next/server";
import { languages } from "@/i18n/config";
import { absoluteUrl, getSiteUrl, localizedUrl } from "@/utils/seo";
import { getPostBannerImageSrc } from "@/utils/postBanner";

export async function GET(req: NextRequest) {
  const origin = getSiteUrl(req.nextUrl.origin);
  const posts = await publicClient.fetch<PostDoc[]>(
    `*[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
      "slug": slug.current,
      title,
      _createdAt,
      _updatedAt,
      bannerSource,
      presetBanner,
      photo{
        asset->{
          _id,
          url,
          metadata{
            lqip
          }
        },
        alt
      }
    }`,
  );

  const fields = posts.flatMap((post) => {
    const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });

    return languages.map((lng) => ({
      loc: localizedUrl(lng, `/post/${post.slug}`, origin),
      lastmod: new Date(post._updatedAt ?? post._createdAt).toISOString(),
      changefreq: "weekly" as const,
      priority: 0.7,
      images: imageSrc
        ? [
            {
              loc: new URL(absoluteUrl(imageSrc, origin)),
              title: post.title,
            },
          ]
        : undefined,
    }));
  });

  return getServerSideSitemap(fields);
}
