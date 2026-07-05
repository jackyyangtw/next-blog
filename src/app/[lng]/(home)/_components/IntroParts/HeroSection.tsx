import type { CSSProperties } from "react";
import Image from "next/image";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { PRINCIPLE_CODE } from "./HeroSection.constants";
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
                background:
                  "linear-gradient(135deg, #0f5f6d 0%, #0b9aad 48%, #1d4f72 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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

        <Grid size={{ xs: 12, md: 5 }}>
          <TransitionFrame kind="grow" delay={140} timeout={620}>
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
              }}
            >
              <Stack spacing={{ xs: 2, sm: 3 }}>
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
                      width: { xs: 72, sm: 96 },
                      height: { xs: 72, sm: 96 },
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
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        letterSpacing: 0,
                      }}
                    >
                      Frontend Engineer
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 700,
                      }}
                    >
                      Jacky
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "primary.dark",
                    lineHeight: 1.8,
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                    ".dark &": {
                      color: "primary.light",
                    },
                  }}
                >
                  {PRINCIPLE_CODE}
                </Typography>
              </Stack>
            </Box>
          </TransitionFrame>
        </Grid>
      </Grid>
    </Box>
  );
}
