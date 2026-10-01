import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bodyCopySx, rem } from "../homeStyles";
import SectionHeading from "./SectionHeading";
import type { HomePageT } from "./types";

const CASE_STUDIES = ["state", "quality", "performance", "security"] as const;

export default function CaseStudiesSection({ t }: { t: HomePageT }) {
  return (
    <Box component="section" aria-labelledby="experience-heading">
      <SectionHeading id="experience-heading">
        {t("case_studies.section_title")}
      </SectionHeading>
      <Typography
        component="p"
        sx={{ ...bodyCopySx, mb: rem(primitiveTokens.space.lg) }}
      >
        {t("case_studies.description")}
      </Typography>
      <Box
        component="ul"
        sx={{
          m: 0,
          pl: rem(primitiveTokens.space.lg),
          display: "grid",
          gap: rem(primitiveTokens.space.md),
        }}
      >
        {CASE_STUDIES.map((key) => (
          <Box component="li" key={key} sx={bodyCopySx}>
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {t(`case_studies.items.${key}.title`)}
            </Box>
            {" — "}
            {t(`case_studies.items.${key}.description`)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
