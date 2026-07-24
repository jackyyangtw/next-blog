import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import HeroMotionFrame from "./HeroMotionFrame";
import HeroProfileCard from "./HeroProfileCard";

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
          <HeroMotionFrame>
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
          </HeroMotionFrame>
          <HeroMotionFrame delay={120}>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 5,
                maxWidth: 550,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          </HeroMotionFrame>
          <HeroMotionFrame delay={240}>
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
                  transition:
                    "box-shadow 220ms ease, transform 220ms ease, background-color 220ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 5,
                  },
                }}
                href="/post"
              >
                {cta}
              </Button>
            </Stack>
          </HeroMotionFrame>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <HeroMotionFrame delay={220}>
            <HeroProfileCard />
          </HeroMotionFrame>
        </Grid>
      </Grid>
    </Box>
  );
}
