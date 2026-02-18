// src/app/[lng]/(home)/page.tsx
import { Suspense } from "react";
// ------------- MUI -------------
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ------------- Components -------------
import PostsSection from "./_components/PostSection";
import LocaingSkeleton from "./_components/Skeleton";

// ------------- i18n -------------
import { getServerTranslation } from "@/i18n/index";
import { Locale } from "@/i18n/types";

interface HomeProps {
  params: Promise<{ lng: Locale }>;
}

export const generateMetadata = async ({ params }: HomeProps) => {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  return {
    title: tCommon.t("site_name"),
    description: tCommon.t("site_description"),
  };
};

export default async function Home({ params }: HomeProps) {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        py: 8,
        background: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
        // borderBottom: "1px solid",
        // borderColor: "divider",
        mb: 6,
      }}
    >
      <Box>
        <Typography variant="h1" gutterBottom>
          {tCommon.t("site_name")}
        </Typography>
        <Typography variant="h2" gutterBottom>
          {tCommon.t("site_description")}
        </Typography>
      </Box>
      <PostsSection />
    </Box>
  );
}
