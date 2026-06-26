"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import EventIcon from "@mui/icons-material/Event";
import Link from "next/link";

import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import FavoriteButton from "@/app/[lng]/post/[slug]/_components/FavoriteButton";
import Banner from "@/app/[lng]/post/[slug]/_components/Banner";
import { PostDoc } from "@/schema/type/post";
import { formatDate } from "@/utils/date/formate";
import { hasPostBannerImage } from "@/sanity/postBanner";

interface PostDetailContentProps {
  post: PostDoc;
  lng: string;
  showBackLink?: boolean;

  showCategories?: boolean;
  closeModal?: () => void;
}

export default function PostDetailContent({
  post,
  lng,
  showBackLink = true,
  showCategories = true,
}: PostDetailContentProps) {
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

      <Box sx={{ position: "relative" }}>
        <RichText value={post.content} />
      </Box>

      <Divider sx={{ my: 6 }} />

      {showBackLink && (
        <Box textAlign="center">
          <Link href={`/${lng}/post`} style={{ textDecoration: "none" }}>
            <Typography color="primary">← 回到所有文章</Typography>
          </Link>
        </Box>
      )}
    </>
  );
}
