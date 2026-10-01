import { homeRootSx, rem } from "./homeStyles";
import { primitiveTokens } from "@jacky-dev/design-tokens";
import { Box } from "@mui/material";
import { getServerTranslation } from "@/i18n/index";
import type { Locale } from "@/i18n/types";
import CaseStudiesSection from "./IntroParts/CaseStudiesSection";
import FeaturedPostsSection from "./IntroParts/FeaturedPostsSection";
import HeroSection from "./IntroParts/HeroSection";
import HomeFooterSection from "./IntroParts/HomeFooterSection";
import PrinciplesSection from "./IntroParts/PrinciplesSection";
import TechStackSection from "./IntroParts/TechStackSection";

interface IntroProps {
  lng: Locale;
}

export default async function Intro({ lng }: IntroProps) {
  "use cache";

  const { t } = await getServerTranslation(lng, "home-page");

  return (
    <Box
      className="jacky-home"
      sx={{
        ...homeRootSx,
        // Match the toolbar's 16px gutters before its desktop breakpoint.
        width: {
          xs: "100%",
          sm: `calc(100% + ${rem(primitiveTokens.space.md)})`,
          md: "100%",
        },
        mx: { xs: 0, sm: rem(-primitiveTokens.space.sm), md: 0 },
      }}
    >
      <HeroSection
        lng={lng}
        titleLine1={t("hero.title_line_1")}
        titleLine2={t("hero.title_line_2")}
        philosophy={t("hero.philosophy")}
        exploring={t("hero.exploring")}
        description={t("hero.description")}
        cta={t("hero.cta")}
      />
      <FeaturedPostsSection lng={lng} t={t} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: {
            xs: rem(primitiveTokens.space["2xl"]),
            md: rem(primitiveTokens.space["3xl"]),
            lg: rem(primitiveTokens.space["4xl"]),
          },
          py: {
            xs: rem(primitiveTokens.space["2xl"]),
            md: rem(primitiveTokens.space["3xl"]),
          },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <PrinciplesSection t={t} />
        <CaseStudiesSection t={t} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: {
            xs: rem(primitiveTokens.space["2xl"]),
            md: rem(primitiveTokens.space["3xl"]),
            lg: rem(primitiveTokens.space["4xl"]),
          },
          pt: rem(primitiveTokens.space["2xl"]),
        }}
      >
        <TechStackSection t={t} />
        <HomeFooterSection t={t} />
      </Box>
    </Box>
  );
}
