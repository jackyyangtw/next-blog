import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { Locale } from "@/i18n/types";
import { localizedPath } from "@/utils/seo";
import { bodyCopySx, rem } from "../homeStyles";
import AuthorProfile from "./AuthorProfile";

interface HeroSectionProps {
  lng: Locale;
  titleLine1: string;
  titleLine2: string;
  philosophy: string;
  exploring: string;
  description: string;
  cta: string;
}

export default function HeroSection({
  lng,
  titleLine1,
  titleLine2,
  philosophy,
  exploring,
  description,
  cta,
}: HeroSectionProps) {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        pt: {
          xs: rem(primitiveTokens.space.md),
          md: rem(primitiveTokens.space.lg),
        },
        pb: {
          xs: rem(primitiveTokens.space["2xl"]),
          md: rem(primitiveTokens.space["3xl"]),
        },
      }}
    >
      <Box
        className="home-hero-content"
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "minmax(0, 1fr) 240px",
            lg: "minmax(0, 1fr) 280px",
          },
          alignItems: "center",
          gap: {
            xs: rem(primitiveTokens.space.lg),
            sm: rem(primitiveTokens.space["2xl"]),
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: "inherit",
              fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
              fontWeight: 600,
              lineHeight: 1.45,
              letterSpacing: "-0.02em",
              overflowWrap: "anywhere",
              mb: rem(primitiveTokens.space.lg),
            }}
          >
            {titleLine1}
            <br />
            {titleLine2}
          </Typography>
          <Typography
            component="p"
            sx={{
              ...bodyCopySx,
              fontSize: rem(primitiveTokens.typography.small),
              maxWidth: 600,
              mb: rem(primitiveTokens.space.sm),
            }}
          >
            {philosophy}
          </Typography>
          <Typography component="p" sx={{ ...bodyCopySx, maxWidth: 600 }}>
            {description}
          </Typography>
          <NextLink
            className="home-text-link"
            href={localizedPath(lng, "/post")}
            style={{ marginTop: rem(primitiveTokens.space.md) }}
          >
            {cta} <span aria-hidden="true">→</span>
          </NextLink>
        </Box>
        <AuthorProfile exploring={exploring} />
      </Box>
    </Box>
  );
}
