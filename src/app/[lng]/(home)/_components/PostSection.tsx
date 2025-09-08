// src/app/[lng]/(home)/_components/PostsSection.tsx  ← Server Component（不要 "use client"）
import Grid from "@mui/material/Grid";
import PostCards from "@/components/UI/PostCards";
import {client} from "@/sanity/lib/client"
import { PostDoc } from "@/schema/type/post";

export default async function PostsSection() {
  // // SSR 取得文章資料
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const posts = await fetch(`${baseUrl}/api/posts`).then((res) => {
  //   if (!res.ok) {
  //     throw new Error("Failed to fetch posts");
  //   }
  //   return res.json();
  // });
  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post"] | order(_createdAt desc) {
      _id,
      _createdAt,
      title,
      description,
      photo,
      "slug": slug.current,
      categories[]->{
        _id,
        title,
        "slug": slug.current
      },
      author->{
        _id,
        name,
        "slug": slug.current,
        email,
        avatar
      }
    }`
  );
  return (
    <Grid container spacing={2} columns={12}>
      <PostCards posts={posts} />
    </Grid>
  );
}
