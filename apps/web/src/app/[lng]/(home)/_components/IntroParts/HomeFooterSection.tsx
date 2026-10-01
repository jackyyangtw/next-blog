import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bodyCopySx, rem } from "../homeStyles";
import SectionHeading from "./SectionHeading";
import type { HomePageT } from "./types";

export default function HomeFooterSection({ t }: { t: HomePageT }) {
  return (
    <Box component="section" aria-labelledby="contact-heading">
      <SectionHeading id="contact-heading">
        {t("about.section_title")}
      </SectionHeading>
      <Typography component="p" sx={bodyCopySx}>
        {t("about.description")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: rem(primitiveTokens.space.lg),
          mt: rem(primitiveTokens.space.sm),
        }}
      >
        <Box
          component="a"
          className="home-text-link"
          href="mailto:jaky2204@gmail.com"
        >
          {t("about.email")}
        </Box>
        <Box
          component="a"
          href="https://github.com/jackyyangtw"
          target="_blank"
          rel="noopener noreferrer"
          className="home-text-link"
        >
          {t("about.github")} <span aria-hidden="true">↗</span>
        </Box>
      </Box>
    </Box>
  );
}
