import Grid from "@mui/material/Grid";
import PostCards from "@/components/features/post/PostCards";
import { publicClient } from "@/sanity/lib/client";
import { PostDoc } from "@/schema/type/post";
import type { Locale } from "@/i18n/types";

export default async function PostsSection({ lng }: { lng: Locale }) {
  const posts = await publicClient.fetch<PostDoc[]>(
    `*[_type == "post"] | order(_createdAt desc)[0...4] {
      _id,
      _createdAt,
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
      categories[]->{
        _id,
        title,
        "slug": slug.current
      },
      author->{
        _id,
        name,
        "slug": slug.current,
        avatar
      }
    }`,
    {},
    { next: { tags: ["posts"] } },
  );
  return (
    <Grid container spacing={2} columns={12}>
      <PostCards lng={lng} posts={posts} />
    </Grid>
  );
}
