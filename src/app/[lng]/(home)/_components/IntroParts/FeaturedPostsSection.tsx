import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import PostsSection from "../PostSection";
import { HomePageT } from "./types";

interface FeaturedPostsSectionProps {
  t: HomePageT;
}

export default function FeaturedPostsSection({ t }: FeaturedPostsSectionProps) {
  return (
    <Box sx={{ py: 10 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
        sx={{ mb: 5 }}
      >
        <Box sx={{ maxWidth: 640 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {t("featured_posts.section_title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.8 }}
          >
            {t("featured_posts.description")}
          </Typography>
        </Box>
        <Button
          href="/post"
          variant="outlined"
          endIcon={<ArrowForward />}
          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
        >
          {t("featured_posts.cta")}
        </Button>
      </Stack>
      <PostsSection />
    </Box>
  );
}
