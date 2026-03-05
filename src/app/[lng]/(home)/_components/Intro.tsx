"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import {
  GitHub,
  Mail,
  Code,
  Layers,
  Storage,
  IntegrationInstructions,
} from "@mui/icons-material";
import Link from "next/link";

// ------------- Components -------------
import PhilosophyCard from "./PhilosophyCard";

export default function Intro() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default", // hsl(220, 30%, 6%)
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
        // 使用 gray[800] 繪製網格，保持低調質感
        backgroundImage: (theme) =>
          `radial-gradient(${theme.palette.grey[800]} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
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
                在邏輯與美感之間，
                <br />
                建構高效能元件。
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
                我是 Jacky。擅長 React
                生態系開發，對程式碼品質有著近乎偏執的堅持。
                我享受將複雜問題抽象化，建立既優雅又具擴充性的技術架構。
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
                  查看筆記
                </Button>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <GitHub />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <Mail />
                  </IconButton>
                </Stack>
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

        {/* 技術堅持區塊 */}
        <Box sx={{ py: 10 }}>
          <Typography variant="h2" sx={{ mb: 8, textAlign: "center" }}>
            技術堅持與原則
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title="元件精簡化"
                icon={Layers}
                description="堅信元件不應超過 200 行，透過精準拆分職責確保程式碼的可讀性與可維護性。"
                code="if(lines > 200) refactor();"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title="狀態純粹度"
                icon={Storage}
                description="嚴格遵守單向資料流，禁止將 Hook 當作 Prop 傳遞，以維護架構的純粹性。"
                code="props.hook // ❌ Rejected"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PhilosophyCard
                title="自動化品質"
                icon={IntegrationInstructions}
                description="配置完善的 GitLab CI/CD 流程，確保每一行進入 Master 的程式碼都符合品質標準。"
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
              當我不寫程式時，我在琴鍵上尋找邏輯以外的旋律。
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
