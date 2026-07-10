import { Email, GitHub } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import TransitionFrame from "./TransitionFrame";
import { HomePageT } from "./types";

interface HomeFooterSectionProps {
  t: HomePageT;
}

export default function HomeFooterSection({ t }: HomeFooterSectionProps) {
  return (
    <Box
      sx={{
        mt: 10,
        py: 6,
        borderTop: "1px solid",
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <TransitionFrame kind="fade" timeout={520}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t("about.section_title")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 640,
            mx: "auto",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          {t("about.description")}
        </Typography>
      </TransitionFrame>
      <TransitionFrame kind="fade" delay={120} timeout={520}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Button
            component="a"
            href="mailto:jaky2204@gmail.com"
            variant="contained"
            startIcon={<Email />}
          >
            {t("about.email")}
          </Button>
          <Button
            component="a"
            href="https://github.com/jackyyangtw"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHub />}
          >
            {t("about.github")}
          </Button>
        </Stack>
      </TransitionFrame>
    </Box>
  );
}
