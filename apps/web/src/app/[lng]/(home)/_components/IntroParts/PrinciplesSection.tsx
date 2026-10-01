import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bodyCopySx, rem } from "../homeStyles";
import SectionHeading from "./SectionHeading";
import type { HomePageT } from "./types";

const PRINCIPLES = ["component", "state", "automation"] as const;

export default function PrinciplesSection({ t }: { t: HomePageT }) {
  return (
    <Box component="section" aria-labelledby="principles-heading">
      <SectionHeading id="principles-heading" number="02">
        {t("principles.section_title")}
      </SectionHeading>
      <Box sx={{ display: "grid", gap: rem(primitiveTokens.space.xl) }}>
        {PRINCIPLES.map((key, index) => (
          <Box
            key={key}
            sx={{
              display: "grid",
              gridTemplateColumns: "20px minmax(0, 1fr)",
              alignItems: "baseline",
              columnGap: rem(primitiveTokens.space.md),
            }}
          >
            <span className="home-principle-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: rem(primitiveTokens.typography.heading6),
                  fontWeight: 600,
                  lineHeight: 1.6,
                  mb: rem(primitiveTokens.space.sm),
                }}
              >
                {t(`principles.items.${key}.title`)}
              </Typography>
              <Typography
                component="p"
                sx={{
                  ...bodyCopySx,
                  fontSize: rem(primitiveTokens.typography.small),
                }}
              >
                {t(`principles.items.${key}.description`)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
