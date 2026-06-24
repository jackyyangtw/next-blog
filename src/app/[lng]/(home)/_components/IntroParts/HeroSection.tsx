import type { CSSProperties } from "react";
import Image from "next/image";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import TransitionFrame from "./TransitionFrame";

const avatarImageStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

interface HeroSectionProps {
  titleLine1: string;
  titleLine2: string;
  description: string;
  cta: string;
}

export default function HeroSection({
  titleLine1,
  titleLine2,
  description,
  cta,
}: HeroSectionProps) {
  return (
    <Box sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 10, md: 15 } }}>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <TransitionFrame kind="fade" timeout={650}>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontWeight: 800,
                color: "primary.dark",
                ".dark &": {
                  background: "linear-gradient(135deg, #fff 0%, #60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                },
              }}
            >
              {titleLine1}
              <br />
              {titleLine2}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                mb: 5,
                maxWidth: 550,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: 2,
                }}
                href="/post"
              >
                {cta}
              </Button>
            </Stack>
          </TransitionFrame>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <TransitionFrame kind="grow" delay={140} timeout={620}>
            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                    }}
                  />
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                    }}
                  />
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: 2,
                    }}
                  >
                    <Image
                      src="/images/avatar.png"
                      alt="Jacky"
                      width={96}
                      height={96}
                      loading="eager"
                      fetchPriority="high"
                      style={avatarImageStyle}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", letterSpacing: 0 }}
                    >
                      Frontend Engineer
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Jacky
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    color: "primary.dark",
                    lineHeight: 1.8,
                    ".dark &": {
                      color: "primary.light",
                    },
                  }}
                >
                  {`const focus = {
  stack: ["React", "Next.js", "TypeScript"],
  craft: "Architecture, testing, maintainability"
};`}
                </Typography>
              </Stack>
            </Box>
          </TransitionFrame>
        </Grid>
      </Grid>
    </Box>
  );
}
