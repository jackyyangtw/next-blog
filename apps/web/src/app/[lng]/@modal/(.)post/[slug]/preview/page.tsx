import { notFound } from "next/navigation";
import PostModal from "./PostModal";
import { getPost } from "@/app/[lng]/post/_lib/getPost";
import PostDetailContent from "@/app/[lng]/post/[slug]/_components/PostDetailContent";
import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import type { Locale } from "@/i18n/types";

interface InterceptedPostPreviewPageProps {
  params: Promise<{ slug: string; lng: Locale }>;
}

export default async function InterceptedPostPreviewPage({
  params,
}: InterceptedPostPreviewPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PostModal>
      <PostDetailContent
        post={post}
        lng={lng}
        showBackLink={false}
        showCategories={false}
        showScrollSpy={false}
        richText={<RichText value={post.content} />}
      />
    </PostModal>
  );
}
