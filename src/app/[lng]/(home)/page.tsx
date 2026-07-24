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

async function getHomeSeoData(lng: Locale) {
  const tCommon = await getServerTranslation(lng, "common");
  const title = tCommon.t("site_name");
  const description = tCommon.t("site_description");
  const url = localizedUrl(lng);
  const imageUrl = absoluteUrl("/images/home-og.jpg");

  return { title, description, url, imageUrl };
}

function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getHomeStructuredData({
  lng,
  title,
  description,
  url,
  imageUrl,
}: {
  lng: Locale;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}) {
  const siteUrl = absoluteUrl();
  const personId = `${siteUrl}#person`;
  const websiteId = `${siteUrl}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Jacky Yang",
        alternateName: "Jacky",
        url: siteUrl,
        image: absoluteUrl("/images/avatar.png"),
        jobTitle: "Frontend Engineer",
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: title,
        description,
        url: siteUrl,
        inLanguage: lng,
        publisher: {
          "@id": personId,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        name: title,
        description,
        url,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": personId,
        },
        mainEntity: {
          "@id": personId,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        inLanguage: lng,
      },
      {
        "@type": "Blog",
        "@id": `${siteUrl}/post#blog`,
        name: title,
        description,
        url: localizedUrl(lng, "/post"),
        author: {
          "@id": personId,
        },
        publisher: {
          "@id": personId,
        },
        inLanguage: lng,
      },
    ],
  };
}

export const generateMetadata = async ({ params }: HomeProps) => {
  const { lng } = await params;
  const { title, description, url, imageUrl } = await getHomeSeoData(lng);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: openGraphLocale(lng),
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
};

export default async function Home({ params }: HomeProps) {
  const { lng } = await params;
  const seoData = await getHomeSeoData(lng);
  const structuredData = getHomeStructuredData({ lng, ...seoData });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyStructuredData(structuredData),
        }}
      />
      <Intro lng={lng} />
    </>
  );
}
