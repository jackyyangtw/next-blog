import ClientPage from "./_components/ClientPage";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { getServerTranslation } from "@/i18n";
import { Locale } from "@/i18n/types";
import { languageAlternates, localizedUrl, openGraphLocale } from "@/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");

  return {
    title: `Posts | ${tCommon.t("site_name")}`,
    description: tCommon.t("site_description"),
    alternates: {
      canonical: localizedUrl(lng, "/post"),
      languages: languageAlternates("/post"),
    },
    openGraph: {
      title: `Posts | ${tCommon.t("site_name")}`,
      description: tCommon.t("site_description"),
      url: localizedUrl(lng, "/post"),
      type: "website",
      locale: openGraphLocale(lng),
    },
  };
}

export default function PostPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ClientPage />
    </Suspense>
  );
}
