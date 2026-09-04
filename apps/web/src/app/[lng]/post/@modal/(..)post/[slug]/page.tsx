import { notFound } from "next/navigation";
import PostModal from "./PostModal";
import { getPost } from "../../../_lib/getPost";
import PostDetailContent from "../../../[slug]/_components/PostDetailContent";

interface InterceptedPostPageProps {
  params: Promise<{ slug: string; lng: string }>;
}

export default async function InterceptedPostPage({
  params,
}: InterceptedPostPageProps) {
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
      />
    </PostModal>
  );
}
