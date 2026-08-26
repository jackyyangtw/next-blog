import ClientPage from "./_components/ClientPage";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { getServerTranslation } from "@/i18n";
import { Locale } from "@/i18n/types";
import { languageAlternates, localizedUrl, openGraphLocale } from "@/utils/seo";

async function getPostListSeoData(lng: Locale) {
  "use cache";

  const tCommon = await getServerTranslation(lng, "common");
  return {
    siteName: tCommon.t("site_name"),
    description: tCommon.t("site_description"),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;
  const { siteName, description } = await getPostListSeoData(lng);

  return {
    title: `Posts | ${siteName}`,
    description,
    alternates: {
      canonical: localizedUrl(lng, "/post"),
      languages: languageAlternates("/post"),
    },
    openGraph: {
      title: `Posts | ${siteName}`,
      description,
      url: localizedUrl(lng, "/post"),
      type: "website",
      locale: openGraphLocale(lng),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;

  return (
    <Suspense fallback={<CircularProgress />}>
      <ClientPage lng={lng} />
    </Suspense>
  );
}
