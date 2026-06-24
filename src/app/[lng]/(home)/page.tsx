import Intro from "./_components/Intro";

// ------------- i18n -------------
import { getServerTranslation } from "@/i18n/index";
import { Locale } from "@/i18n/types";
import {
  absoluteUrl,
  languageAlternates,
  localizedUrl,
  openGraphLocale,
} from "@/utils/seo";

interface HomeProps {
  params: Promise<{ lng: Locale }>;
}

export const generateMetadata = async ({ params }: HomeProps) => {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  const title = tCommon.t("site_name");
  const description = tCommon.t("site_description");
  const ogImageUrl = absoluteUrl("/images/home-og.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(lng),
      languages: languageAlternates(),
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(lng),
      type: "website",
      locale: openGraphLocale(lng),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
};

export default async function Home({ params }: HomeProps) {
  const { lng } = await params;

  return <Intro lng={lng} />;
}
