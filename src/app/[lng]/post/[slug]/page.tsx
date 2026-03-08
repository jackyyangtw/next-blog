// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image
// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Components -------------
import PostDetailContent from "./_components/PostDetailContent";

// ------------- next -------------
import { notFound } from "next/navigation";

// ------------- utils -------------
import { getPost } from "../_lib/getPost";

interface PostPageProps {
  params: Promise<{ slug: string; lng: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.description,
    image: post.photo ? urlFor(post.photo).width(1200).height(628).url() : "",
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, lng } = await params;
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
    </>
  );
}
