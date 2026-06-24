import Intro from "./_components/Intro";

// ------------- i18n -------------
import { getServerTranslation } from "@/i18n/index";
import { Locale } from "@/i18n/types";
import { languageAlternates, localizedUrl, openGraphLocale } from "@/utils/seo";

interface HomeProps {
  params: Promise<{ lng: Locale }>;
}

export const generateMetadata = async ({ params }: HomeProps) => {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  return {
    title: tCommon.t("site_name"),
    description: tCommon.t("site_description"),
    alternates: {
      canonical: localizedUrl(lng),
      languages: languageAlternates(),
    },
    openGraph: {
      title: tCommon.t("site_name"),
      description: tCommon.t("site_description"),
      url: localizedUrl(lng),
      type: "website",
      locale: openGraphLocale(lng),
    },
  };
};

export default async function Home({ params }: HomeProps) {
  const { lng } = await params;

  return <Intro lng={lng} />;
}
