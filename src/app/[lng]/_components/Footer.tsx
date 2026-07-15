// src/app/[lng]/_components/Footer.tsx
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ConsentSettingsButton from "./AnalyticsConsent/ConsentSettingsButton";

// ------------- Icons -------------
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

const CURRENT_YEAR = new Date().getFullYear();

interface FooterProps {
  consentSettingsLabel: string;
  showConsentSettings: boolean;
  siteName: string;
}

export default function Footer({
  consentSettingsLabel,
  showConsentSettings,
  siteName,
}: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        px: 2,
        mt: "auto",
        // 改用主題定義的背景色，避免突兀
        backgroundColor: "background.default",
        borderTop: "1px solid",
        // 使用主題內建的透明度 divider
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color="text.primary"
              gutterBottom
            >
              {siteName}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            {/* 這裡的 IconButton 會自動繼承主題的 text.secondary 顏色 */}
            <IconButton
              href="https://github.com/jackyyangtw"
              target="_blank"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="mailto:jaky2204@gmail.com"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <EmailIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4, opacity: 0.5 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary">
              © {CURRENT_YEAR} Jacky. All rights reserved.
            </Typography>
            {showConsentSettings ? (
              <ConsentSettingsButton label={consentSettingsLabel} />
            ) : null}
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: 0.5 }}
          >
            Built with{" "}
            <Box component="span" color="primary.main">
              Next.js
            </Box>
            , TypeScript & Sanity.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
