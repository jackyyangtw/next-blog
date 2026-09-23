import { Suspense } from "react";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import PostModal from "./PostModal";
import PostModalOpenButton from "./PostModalOpenButton";
import { getPost } from "@/app/[lng]/post/_lib/getPost";
import PostDetailContent from "@/app/[lng]/post/[slug]/_components/PostDetailContent";
import PostDetailPageSkeleton from "@/app/[lng]/post/[slug]/_components/PostDetailPageSkeleton";
import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import type { Locale } from "@/i18n/types";

interface InterceptedPostPreviewPageProps {
  params: Promise<{ slug: string; lng: Locale }>;
}

function PostModalLoading() {
  return (
    <>
      <Box sx={{ minHeight: 40, mb: 4 }}>
        <Skeleton
          aria-hidden="true"
          variant="rounded"
          width={150}
          height={38}
          sx={{ borderRadius: 1.5 }}
        />
      </Box>
      <PostDetailPageSkeleton showCategories={false} showScrollSpy={false} />
    </>
  );
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
    <>
      <Box sx={{ minHeight: 40, mb: 4 }}>
        <PostModalOpenButton postPath={`/${lng}/post/${slug}`} />
      </Box>
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
    </>
  );
}

export default function InterceptedPostPreviewPage({
  params,
}: InterceptedPostPreviewPageProps) {
  return (
    <PostModal>
      <Suspense fallback={<PostModalLoading />}>
        <InterceptedPostPreviewContent params={params} />
      </Suspense>
    </PostModal>
  );
}
