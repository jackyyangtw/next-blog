"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
  ArrowBackRounded as ArrowBackRoundedIcon,
  Event as EventIcon,
  LinkRounded as LinkRoundedIcon,
} from "@mui/icons-material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import Link from "next/link";
import { semanticTokens } from "@jacky-dev/design-tokens";

import FavoriteButton from "@/app/[lng]/post/[slug]/_components/FavoriteButton";
import Banner from "@/app/[lng]/post/[slug]/_components/Banner";
import ArticleFeedbackForm from "./ArticleFeedbackForm";
import PostScrollSpy from "./PostScrollSpy";
import type { PostDoc } from "@/schema/type/post";
import { formatDate } from "@/utils/date/formate";
import { hasPostBannerImage } from "@/sanity/postBanner";
import { readableAccentSx } from "@/theme/readableAccent";
import { getPostTableOfContents } from "./postTableOfContents";

interface PostDetailContentProps {
  post: PostDoc;
  lng: string;
  showBackLink?: boolean;

  showCategories?: boolean;
  showScrollSpy?: boolean;
  richText: ReactNode;
}

const backToPostsButtonSx: SxProps<Theme> = (theme) => ({
  ...readableAccentSx,
  minHeight: 44,
  px: 2.5,
  borderRadius: 1.5,
  borderColor: alpha(semanticTokens.light.primary, 0.24),
  backgroundColor: alpha(semanticTokens.light.primary, 0.035),
  fontWeight: 700,
  "&:hover": {
    borderColor: alpha(semanticTokens.light.primary, 0.45),
    backgroundColor: alpha(semanticTokens.light.primary, 0.09),
  },
  "&:focus-visible": {
    outline: `3px solid ${alpha(semanticTokens.light.primary, 0.4)}`,
  },
  ...theme.applyStyles("dark", {
    borderColor: alpha(theme.palette.primary.light, 0.26),
    backgroundColor: alpha(theme.palette.primary.light, 0.06),
    "&:hover": {
      borderColor: alpha(theme.palette.primary.light, 0.48),
      backgroundColor: alpha(theme.palette.primary.light, 0.12),
    },
    "&:focus-visible": {
      outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    },
  }),
});

export default function PostDetailContent({
  post,
  lng,
  showBackLink = true,
  showCategories = true,
  showScrollSpy = true,
  richText,
}: PostDetailContentProps) {
  const tableOfContents = useMemo(
    () => (showScrollSpy ? getPostTableOfContents(post.content) : []),
    [post.content, showScrollSpy],
  );

  return (
    <>
      <Box mb={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography variant="h3" component="h1" fontWeight="700">
            {post.title}
          </Typography>
          <FavoriteButton postId={post._id} />
        </Stack>

        <Stack direction="row" spacing={2} color="text.secondary" mb={3}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <EventIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              {formatDate(post._createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3, fontStyle: "italic" }}
        >
          {post.description}
        </Typography>

        {showCategories && (
          <Stack direction="row" gap={1} flexWrap="wrap">
            {post.categories.map((category) => (
              <Chip
                key={category.slug}
                icon={<LinkRoundedIcon />}
                label={category.title}
                size="small"
                variant="outlined"
                component={Link}
                href={`/${lng}/post?categories=${category.slug}`}
                clickable
              />
            ))}
          </Stack>
        )}
      </Box>

      {hasPostBannerImage(post) && (
        <Box mb={6} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Banner post={post} />
        </Box>
      )}

      <Box
        sx={{
          display: { xs: "block", lg: "flex" },
          alignItems: "flex-start",
          gap: { lg: 4, xl: 5 },
          position: "relative",
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>{richText}</Box>
        {showScrollSpy && <PostScrollSpy sections={tableOfContents} />}
      </Box>

      <Divider sx={{ my: 6 }} />

      <ArticleFeedbackForm locale={lng} postId={post._id} />

      <Divider sx={{ my: 6 }} />

      {showBackLink && (
        <Box textAlign="center">
          <Button
            component={Link}
            href={`/${lng}/post`}
            startIcon={<ArrowBackRoundedIcon />}
            sx={backToPostsButtonSx}
            variant="outlined"
          >
            回到所有文章
          </Button>
        </Box>
      )}
    </>
  );
}
