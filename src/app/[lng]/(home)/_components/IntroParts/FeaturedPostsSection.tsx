import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import PostsSection from "../PostSection";
import TransitionFrame from "./TransitionFrame";
import { HomePageT } from "./types";
import type { Locale } from "@/i18n/types";

interface FeaturedPostsSectionProps {
  lng: Locale;
  t: HomePageT;
}

export default function FeaturedPostsSection({
  lng,
  t,
}: FeaturedPostsSectionProps) {
  return (
    <Box sx={{ py: 10 }}>
      <TransitionFrame kind="fade" timeout={520}>
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
            sx={{
              borderRadius: 2,
              whiteSpace: "nowrap",
              transition:
                "border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease",
              "&:hover": {
                boxShadow: 2,
                transform: "translateY(-2px)",
              },
            }}
          >
            {t("featured_posts.cta")}
          </Button>
        </Stack>
      </TransitionFrame>
      <PostsSection lng={lng} />
    </Box>
  );
}
