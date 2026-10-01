import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bodyCopySx, rem } from "../homeStyles";
import SectionHeading from "./SectionHeading";
import type { HomePageT } from "./types";

const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "TanStack Query",
  "Zustand",
  "Vitest",
  "Playwright",
] as const;

export default function TechStackSection({ t }: { t: HomePageT }) {
  return (
    <Box component="section" aria-labelledby="tools-heading">
      <SectionHeading id="tools-heading" number="03">
        {t("tech_stack.section_title")}
      </SectionHeading>
      <Typography
        component="p"
        sx={{ ...bodyCopySx, mb: rem(primitiveTokens.space.md) }}
      >
        {t("tech_stack.description")}
      </Typography>
      <Box
        component="ul"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: rem(primitiveTokens.space.lg),
          rowGap: rem(primitiveTokens.space.sm),
          listStyle: "none",
          p: 0,
          m: 0,
        }}
      >
        {TECH_STACK.map((tech) => (
          <Box
            component="li"
            key={tech}
            sx={{
              fontSize: rem(primitiveTokens.typography.small),
              lineHeight: 1.7,
            }}
          >
            {tech}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
