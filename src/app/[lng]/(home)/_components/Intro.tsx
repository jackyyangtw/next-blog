"use client";
import { Container, Typography, Box, Grid, Button, Stack } from "@mui/material";
import {
  Code,
  Layers,
  Storage,
  IntegrationInstructions,
} from "@mui/icons-material";
import Link from "next/link";
import { useClientTranslation } from "@/i18n/client";

// ------------- Components -------------
import PhilosophyCard from "./PhilosophyCard";
import TechMarquee from "./TechMarquee";
import TrackingLight from "./TrackingLight";

export default function Intro() {
  const { t } = useClientTranslation("home-page");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
        // 使用 gray[800] 繪製網格，保持低調質感
        backgroundImage: (theme) =>
          `radial-gradient(${theme.palette.grey[800]} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      <TrackingLight />

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 10, md: 15 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  fontWeight: 800,
                  color: "text.primary",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? `linear-gradient(135deg, #fff 0%, ${theme.palette.primary.light} 100%)`
                      : "none",
                  WebkitBackgroundClip: (theme) =>
                    theme.palette.mode === "dark" ? "text" : "unset",
                  WebkitTextFillColor: (theme) =>
                    theme.palette.mode === "dark" ? "transparent" : "unset",
                }}
              >
                {t("hero.title_line_1")}
                <br />
                {t("hero.title_line_2")}
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
                {t("hero.description")}
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
                    boxShadow: (theme) => theme.shadows[2],
                  }}
                  component={Link}
                  href="/post"
                >
                  {t("hero.cta")}
                </Button>
              </Stack>
            </Grid>

            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {/* 模擬程式碼視窗 - 使用 Theme 中的灰色層次 */}
              <Box
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: (theme) => theme.palette.baseShadow,
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
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
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    fontFamily: "monospace",
                    color:
                      theme.palette.mode === "dark"
                        ? "primary.light"
                        : "primary.dark",
                    lineHeight: 1.8,
                  })}
                >
                  {`const developer = {
  name: "Jacky",
  skills: ["Next.js", "Zustand"],
  quality: "Component < 200 lines",
  motto: "Logic meets Aesthetics"
};`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TechMarquee />

        {/* 技術堅持區塊 */}
        <Box sx={{ py: 10 }}>
          <Typography variant="h2" sx={{ mb: 8, textAlign: "center" }}>
            {t("principles.section_title")}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title={t("principles.items.component.title")}
                icon={Layers}
                description={t("principles.items.component.description")}
                code="if(lines > 200) refactor();"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title={t("principles.items.state.title")}
                icon={Storage}
                description={t("principles.items.state.description")}
                code="props.hook // ❌ Rejected"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title={t("principles.items.automation.title")}
                icon={IntegrationInstructions}
                description={t("principles.items.automation.description")}
                code="stage: code_quality_check"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 10,
            py: 6,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.5}
            sx={{ color: "text.secondary" }}
          >
            <Box
              component="span"
              sx={{ display: "flex", color: "primary.main" }}
            >
              <Code fontSize="small" />
            </Box>
            <Typography variant="body2">
              {t("footer.quote")}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
