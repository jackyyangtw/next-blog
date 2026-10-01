import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { Locale } from "@/i18n/types";
import { localizedPath } from "@/utils/seo";
import PostsSection from "../PostSection";
import { bodyCopySx, rem } from "../homeStyles";
import SectionHeading from "./SectionHeading";
import type { HomePageT } from "./types";

export default function FeaturedPostsSection({
  lng,
  t,
}: {
  lng: Locale;
  t: HomePageT;
}) {
  return (
    <Box component="section" aria-labelledby="posts-heading">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: rem(primitiveTokens.space.md),
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: rem(primitiveTokens.space.lg),
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <SectionHeading id="posts-heading" number="01" compact>
            {t("featured_posts.section_title")}
          </SectionHeading>
          <Typography component="p" sx={bodyCopySx}>
            {t("featured_posts.description")}
          </Typography>
        </Box>
        <NextLink className="home-text-link" href={localizedPath(lng, "/post")}>
          {t("featured_posts.cta")} <span aria-hidden="true">→</span>
        </NextLink>
      </Box>
      <PostsSection lng={lng} emptyMessage={t("featured_posts.empty")} />
    </Box>
  );
}
