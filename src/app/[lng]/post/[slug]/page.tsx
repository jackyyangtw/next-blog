// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image

import { Suspense } from "react";

// ------------- next -------------
import { notFound } from "next/navigation";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Components -------------
import PostDetailContent from "./_components/PostDetailContent";
import PostPageSkeleton from "./_components/PostPageSkeleton";
import RelatedPostsSection from "./_components/RelatedPostsSection";

// ------------- utils -------------
import { getPost } from "../_lib/getPost";

interface PostPageProps {
  params: Promise<{ slug: string; lng: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }

  // Construct absolute URLs for alternates
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${baseUrl}/${lng}/post/${slug}`,
      languages: {
        en: `${baseUrl}/en/post/${slug}`,
        "zh-TW": `${baseUrl}/zh-TW/post/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.photo
        ? [urlFor(post.photo).width(1200).height(628).url()]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.photo
        ? [urlFor(post.photo).width(1200).height(628).url()]
        : [],
    },
  };
}

async function PostPageContent({ slug, lng }: { slug: string; lng: string }) {
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title ?? "",
    description: post?.description ?? "",
    image: post?.photo ? urlFor(post.photo).width(1200).height(628).url() : "",
    author: {
      "@type": "Person",
      name: post?.author?.name ?? "",
    },
    datePublished: post?._createdAt ?? "",
    dateModified: post?._createdAt ?? "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/post/${slug}`,
    },
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
