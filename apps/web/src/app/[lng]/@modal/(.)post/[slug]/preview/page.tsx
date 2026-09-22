import { Suspense } from "react";
import { notFound } from "next/navigation";
import PostModal from "./PostModal";
import PostModalSkeleton from "./PostModalSkeleton";
import { getPost } from "@/app/[lng]/post/_lib/getPost";
import PostDetailContent from "@/app/[lng]/post/[slug]/_components/PostDetailContent";
import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import type { Locale } from "@/i18n/types";

interface InterceptedPostPreviewPageProps {
  params: Promise<{ slug: string; lng: Locale }>;
}

async function InterceptedPostPreviewContent({
  params,
}: InterceptedPostPreviewPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PostModal>
      <div data-testid="post-preview-content">
        <PostDetailContent
          post={post}
          lng={lng}
          showBackLink={false}
          showCategories={false}
          showScrollSpy={false}
          richText={<RichText value={post.content} />}
        />
      </div>
    </PostModal>
  );
}

export default function InterceptedPostPreviewPage({
  params,
}: InterceptedPostPreviewPageProps) {
  return (
    <Suspense fallback={<PostModalSkeleton />}>
      <InterceptedPostPreviewContent params={params} />
    </Suspense>
  );
}
