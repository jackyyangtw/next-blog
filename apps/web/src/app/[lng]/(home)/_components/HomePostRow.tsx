import { rem } from "./homeStyles";
import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import NextLink from "next/link";
import type { Locale } from "@/i18n/types";
import type { PostSummary } from "@/schema/type/post";
import { getPostBannerAlt, getPostBannerImageSrc } from "@/sanity/postBanner";
import { localizedPath } from "@/utils/seo";

export default function HomePostRow({
  post,
  lng,
}: {
  post: PostSummary;
  lng: Locale;
}) {
  const bannerSrc = getPostBannerImageSrc(post, { width: 480, height: 300 });
  const date = new Date(post._createdAt)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", ".");
  const categories = (post.categories ?? [])
    .map((category) => category?.title)
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");

  return (
    <Box
      component="li"
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Box component="article">
        <NextLink
          className="home-post-link"
          data-has-banner={Boolean(bannerSrc)}
          href={localizedPath(lng, `/post/${post.slug}/preview`)}
          scroll={false}
          aria-label={post.title}
        >
          <Box sx={{ minWidth: 0, maxWidth: 960 }}>
            <Box
              sx={{
                color: "text.secondary",
                fontSize: rem(primitiveTokens.typography.small),
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                columnGap: rem(primitiveTokens.space.sm),
                rowGap: rem(primitiveTokens.space.xs),
                mb: rem(primitiveTokens.space.sm),
              }}
            >
              <Box
                component="time"
                dateTime={post._createdAt}
                sx={{
                  fontFamily: primitiveTokens.fontFamily.monospace.join(", "),
                  fontSize: rem(primitiveTokens.typography.caption),
                }}
              >
                {date}
              </Box>
              {categories ? <span>· {categories}</span> : null}
            </Box>
            <Typography
              component="h3"
              sx={{
                fontSize: {
                  xs: rem(primitiveTokens.typography.body),
                  sm: rem(primitiveTokens.typography.heading5),
                },
                lineHeight: 1.6,
                fontWeight: 600,
                overflowWrap: "anywhere",
                mb: rem(primitiveTokens.space.sm),
              }}
            >
              {post.title}
            </Typography>
            <Typography
              component="p"
              sx={{
                color: "text.secondary",
                fontSize: rem(primitiveTokens.typography.small),
                lineHeight: 1.8,
                maxWidth: 880,
                overflowWrap: "anywhere",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {post.description}
            </Typography>
          </Box>
          {bannerSrc ? (
            <Box
              sx={{
                position: "relative",
                aspectRatio: "8 / 5",
                borderRadius: rem(primitiveTokens.radius.sm),
                overflow: "clip",
              }}
            >
              <Image
                src={bannerSrc}
                alt={getPostBannerAlt(post)}
                fill
                sizes="(max-width: 599px) 80px, (max-width: 899px) 144px, (max-width: 1199px) 176px, 208px"
                style={{ objectFit: "cover" }}
              />
            </Box>
          ) : null}
        </NextLink>
      </Box>
    </Box>
  );
}
