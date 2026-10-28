// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image

import { Suspense } from "react";
import Container from "@mui/material/Container";

// ------------- next -------------
import { notFound } from "next/navigation";

// ------------- Components -------------
import PostDetailContent from "./_components/PostDetailContent";
import RelatedPostsSection from "./_components/RelatedPostsSection";
import RichText from "./_components/RichText/RichText";

// ------------- utils -------------
import { getPost } from "../_lib/getPost";
import { publicClient } from "@/sanity/lib/client";
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

// 預先產生所有文章，讓標題、banner 與內文直接進入靜態 shell，
// 避免 skeleton 與實際內容高度不同造成的 CLS；未列出的新文章仍會在首次請求時產生
export async function generateStaticParams() {
  const slugs = await publicClient.fetch<string[]>(
    `*[_type == "post" && defined(slug.current)].slug.current`,
  );
  return slugs.map((slug) => ({ slug }));
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

// params 不包 Suspense：已預先產生的文章完整進入靜態 HTML，不會先畫 skeleton 再替換；
// 未列出的新文章首次請求會等待完整渲染（blocking），之後由 ISR 快取
export const instant = false;

export default PostPageContent;
