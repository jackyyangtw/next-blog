// src/app/[lng]/(home)/_components/PostsSection.tsx  ← Server Component（不要 "use client"）
import Grid from "@mui/material/Grid";
import PostCards from "@/components/UI/PostCards";

export default async function PostsSection() {
  // SSR 取得文章資料
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const posts = await fetch(`${baseUrl}/api/posts`).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  });
  return (
    <Grid container spacing={2} columns={12}>
      <PostCards posts={posts.data} />
    </Grid>
  );
}
