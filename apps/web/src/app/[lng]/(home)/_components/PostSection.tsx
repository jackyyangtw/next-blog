import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { cacheLife, cacheTag } from "next/cache";
import HomePostRow from "./HomePostRow";
import { bodyCopySx, rem } from "./homeStyles";
import { publicClient } from "@/sanity/lib/client";
import type { PostSummary } from "@/schema/type/post";
import type { Locale } from "@/i18n/types";

export default async function PostsSection({
  lng,
  emptyMessage,
}: {
  lng: Locale;
  emptyMessage: string;
}) {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 3600,
    expire: 86400,
  });
  cacheTag("posts");

  const posts = await publicClient.fetch<PostSummary[]>(
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
  );
  if (posts.length === 0) {
    return (
      <Typography
        component="p"
        sx={{ ...bodyCopySx, py: rem(primitiveTokens.space.xl) }}
      >
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
      {posts.map((post) => (
        <HomePostRow key={post._id} post={post} lng={lng} />
      ))}
    </Box>
  );
}
