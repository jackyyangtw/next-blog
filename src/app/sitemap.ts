import type { MetadataRoute } from "next";

import { languages } from "@/i18n/config";
import { publicClient } from "@/sanity/lib/client";
import {
  absoluteUrl,
  getSiteUrl,
  languageAlternates,
  localizedUrl,
} from "@/utils/seo";
import { getPostBannerImageSrc } from "@/utils/postBanner";

type SitemapPost = {
  slug: string;
  title: string;
  _createdAt: string;
  _updatedAt?: string;
  bannerSource?: string | null;
  presetBanner?: string | null;
  photo?: {
    asset?: {
      _id?: string;
      url?: string;
      metadata?: {
        lqip?: string;
      };
    };
    alt?: string;
  } | null;
};

const STATIC_PATHS = ["", "/post"] as const;

function staticEntries(origin: string): MetadataRoute.Sitemap {
  return STATIC_PATHS.flatMap((path) =>
    languages.map((lng) => ({
      url: localizedUrl(lng, path, origin),
      changeFrequency: path === "" ? "weekly" : "daily",
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: languageAlternates(path, origin),
      },
    })),
  );
}

async function postEntries(origin: string): Promise<MetadataRoute.Sitemap> {
  const posts = await publicClient.fetch<SitemapPost[]>(
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

  return posts.flatMap((post) => {
    const postPath = `/post/${post.slug}`;
    const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });
    const images = imageSrc ? [absoluteUrl(imageSrc, origin)] : undefined;

    return languages.map((lng) => ({
      url: localizedUrl(lng, postPath, origin),
      lastModified: new Date(post._updatedAt ?? post._createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
      images,
      alternates: {
        languages: languageAlternates(postPath, origin),
      },
    }));
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  return [...staticEntries(origin), ...(await postEntries(origin))];
}
