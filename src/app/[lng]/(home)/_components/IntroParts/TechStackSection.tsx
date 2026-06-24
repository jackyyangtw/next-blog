import { Box, Typography } from "@mui/material";
import TechMarquee from "../TechMarquee";
import { HomePageT } from "./types";

interface TechStackSectionProps {
  t: HomePageT;
}

export default function TechStackSection({ t }: TechStackSectionProps) {
  return (
    <Box sx={{ py: 10 }}>
      <Box sx={{ maxWidth: 680, mx: "auto", mb: 4, textAlign: "center" }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t("tech_stack.section_title")}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.8 }}
        >
          {t("tech_stack.description")}
        </Typography>
      </Box>
      <TechMarquee />
    </Box>
  );
}
