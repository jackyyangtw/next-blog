import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/sanity/lib/client";
import type { PostDoc } from "@/schema/type/post";
import { defineQuery } from "next-sanity";

const POST_QUERY =
  defineQuery(/* groq */ `*[_type == "post" && slug.current == $slug][0]{
  title,
  description,
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
  },
  "slug": slug.current,
  content,
  _id,
  _createdAt,
  _updatedAt,
  categories[]->{
    _id,
    "slug": slug.current,
    title
  },
  author->{
    _id,
    name,
    "slug": slug.current,
    avatar
  }
}`);

export async function getPost(slug: string): Promise<PostDoc | null> {
  "use cache";

  // 詳情頁不掛列表用的 "posts"，改其他文章時不會連帶失效；
  // 作者或分類變動時由 webhook 清除 "post-detail"
  cacheTag("post-detail", `post:${slug}`);

  const post = await publicClient
    .withConfig({ useCdn: false })
    .fetch<PostDoc | null>(POST_QUERY, { slug });

  cacheLife(
    post
      ? {
          stale: 300,
          revalidate: 86400,
          expire: 604800,
        }
      : {
          stale: 300,
          revalidate: 60,
          expire: 3600,
        },
  );
  return post;
}
