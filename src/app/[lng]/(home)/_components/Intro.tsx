import { Box, Container } from "@mui/material";
import { getServerTranslation } from "@/i18n/index";
import { Locale } from "@/i18n/types";
import TrackingLight from "./TrackingLight";
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
  const { t } = await getServerTranslation(lng, "home-page");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
        backgroundImage:
          "radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <TrackingLight />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <HeroSection
          titleLine1={t("hero.title_line_1")}
          titleLine2={t("hero.title_line_2")}
          description={t("hero.description")}
          cta={t("hero.cta")}
        />
        <PrinciplesSection t={t} />
        <CaseStudiesSection t={t} />
        <FeaturedPostsSection lng={lng} t={t} />
        <TechStackSection t={t} />
        <HomeFooterSection t={t} />
      </Container>
    </Box>
  );
}
