// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image

import { Suspense } from "react";

// ------------- next -------------
import { notFound } from "next/navigation";

// ------------- Components -------------
import PostDetailContent from "./_components/PostDetailContent";
import PostPageSkeleton from "./_components/PostPageSkeleton";
import RelatedPostsSection from "./_components/RelatedPostsSection";

// ------------- utils -------------
import { getPost } from "../_lib/getPost";
import { getPostBannerImageSrc } from "@/utils/postBanner";
import {
  absoluteUrl,
  languageAlternates,
  localizedUrl,
  openGraphLocale,
} from "@/utils/seo";
import { Locale } from "@/i18n/types";

interface PostPageProps {
  params: Promise<{ slug: string; lng: Locale }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }

  const postPath = `/post/${slug}`;
  const canonicalUrl = localizedUrl(lng, postPath);
  const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });
  const imageUrl = imageSrc ? absoluteUrl(imageSrc) : "";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(postPath),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      locale: openGraphLocale(lng),
      publishedTime: post._createdAt,
      modifiedTime: post._updatedAt ?? post._createdAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.categories.map((category) => category.title),
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

async function PostPageContent({ slug, lng }: { slug: string; lng: Locale }) {
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const postPath = `/post/${slug}`;
  const canonicalUrl = localizedUrl(lng, postPath);
  const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });
  const imageUrl = imageSrc ? absoluteUrl(imageSrc) : "";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        headline: post.title,
        description: post.description,
        image: imageUrl ? [imageUrl] : undefined,
        author: {
          "@type": "Person",
          name: post.author?.name ?? "",
        },
        datePublished: post._createdAt,
        dateModified: post._updatedAt ?? post._createdAt,
        inLanguage: lng,
        keywords: post.categories.map((category) => category.title),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: localizedUrl(lng),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Posts",
            item: localizedUrl(lng, "/post"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PostDetailContent post={post} lng={lng} />
      <RelatedPostsSection
        slug={slug}
        lng={lng}
        categoryIds={post.categories.map((category) => category._id)}
      />
    </>
  );
}

// support PPR (Partial Prerendering)
export default async function PostPage({ params }: PostPageProps) {
  const { slug, lng } = await params;
  return (
    <Suspense fallback={<PostPageSkeleton />}>
      <PostPageContent slug={slug} lng={lng} />
    </Suspense>
  );
}
