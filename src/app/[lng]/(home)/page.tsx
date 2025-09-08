// src/app/[lng]/(home)/page.tsx

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ------------- Components -------------
import PostsSection from "./_components/PostSection";

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
