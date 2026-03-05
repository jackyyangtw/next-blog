// src/app/[lng]/(home)/page.tsx
import Intro from "./_components/Intro";

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



export default async function Home() {
  return (
    <>
      <Intro />
    </>
  );
}
