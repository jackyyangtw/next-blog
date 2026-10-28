// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image

import { Suspense } from "react";
import Container from "@mui/material/Container";

// ------------- next -------------
import { notFound } from "next/navigation";

// ------------- Components -------------
import PostDetailContent from "./_components/PostDetailContent";
import PostDetailPageSkeleton from "./_components/PostDetailPageSkeleton";
import RelatedPostsSection from "./_components/RelatedPostsSection";
import RichText from "./_components/RichText/RichText";

// ------------- utils -------------
import { getPost } from "../_lib/getPost";
import { getPostBannerImageSrc } from "@/sanity/postBanner";
import {
  absoluteUrl,
  localizedUrl,
  openGraphLocale,
  postCanonicalUrl,
  stringifyStructuredData,
} from "@/utils/seo";
import { fallbackLng } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

interface PostPageProps {
  params: Promise<{ slug: string; lng: Locale }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }

  // 文章內容只有中文：所有語系都以中文版為標準網址，也不輸出 hreflang
  const canonicalUrl = postCanonicalUrl(slug);
  const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });
  const imageUrl = imageSrc ? absoluteUrl(imageSrc) : "";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      locale: openGraphLocale(fallbackLng),
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

async function PostPageContent({ params }: PostPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const canonicalUrl = postCanonicalUrl(slug);
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
        inLanguage: fallbackLng,
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
        dangerouslySetInnerHTML={{
          __html: stringifyStructuredData(structuredData),
        }}
      />
      <Container
        disableGutters
        maxWidth={false}
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        <PostDetailContent
          post={post}
          lng={lng}
          richText={<RichText value={post.content} />}
        />
        <Suspense fallback={null}>
          <RelatedPostsSection
            slug={slug}
            lng={lng}
            categoryIds={post.categories.map((category) => category._id)}
          />
        </Suspense>
      </Container>
    </>
  );
}

// support PPR (Partial Prerendering)
export default function PostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<PostDetailPageSkeleton />}>
      <PostPageContent params={params} />
    </Suspense>
  );
}
