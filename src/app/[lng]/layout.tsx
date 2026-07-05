// src/app/[lng]/layout.tsx
import { dir } from "i18next";
import { languages } from "@/i18n/config";
import { getServerTranslation } from "@/i18n";
import { Locale } from "@/i18n/types";

// ----------------------- MUI -----------------------
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import AppTheme from "@/theme/AppTheme";
import Container from "@mui/material/Container";

// ----------------------- Providers -----------------------
import Providers from "@/Providers";

// ----------------------- Components -----------------------
import AppWrapper from "./_components/AppWrapper";
import Footer from "./_components/Footer";
import Box from "@mui/material/Box";
import { Suspense } from "react";
import { getSiteUrl } from "@/utils/seo";
import type { AppBarLabels } from "./_components/AppAppBar/types";
import { getChromeTranslations } from "@/i18n/chrome";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import ConsentBanner from "./_components/AnalyticsConsent/ConsentBanner";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analytics/consent";

const GOOGLE_CONSENT_DEFAULT_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  var analyticsConsent = 'denied';
  try {
    if (window.localStorage.getItem('${ANALYTICS_CONSENT_STORAGE_KEY}') === 'granted') {
      analyticsConsent = 'granted';
    }
  } catch {}

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analyticsConsent,
    wait_for_update: 500
  });
`;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) => {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  return {
    title: tCommon.t("site_name"),
    metadataBase: new URL(getSiteUrl()),
  };
};

// 「靜態生成（Static Generation）」多語系（i18n）頁面時，告訴 Next.js 需要預先產生哪些語言版本的路由。
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout(props: LayoutProps<"/[lng]">) {
  const { children, params } = props;
  const { lng: routeLocale } = await params;
  const lng = routeLocale as Locale;
  const chrome = getChromeTranslations(lng);
  const googleAnalyticsId =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
      : undefined;
  const appBarLabels: AppBarLabels = {
    colorMode: {
      dark: chrome.component.ColorModeIconDropdown.dark,
      light: chrome.component.ColorModeIconDropdown.light,
      system: chrome.component.ColorModeIconDropdown.system,
    },
    language: chrome.component.LangSwitcher.label,
    login: chrome.auth.login,
    navigation: {
      posts: chrome.navigation["/post"],
      studio: chrome.navigation["/studio"],
    },
  };

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      {googleAnalyticsId ? (
        <Script id="google-consent-default" strategy="beforeInteractive">
          {GOOGLE_CONSENT_DEFAULT_SCRIPT}
        </Script>
      ) : null}
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="dark" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppTheme>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {/* Providers 包裹在最外層，確保 Footer 也能吃到 context */}
            <Providers>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1, // 撐開空間，讓 Footer 靠到底部
                }}
              >
                {/* 內容區塊：維持原本的 Container 限制 */}
                <Container
                  component="main"
                  maxWidth="lg"
                  sx={{
                    my: 16,
                    gap: 4,
                    flexGrow: 1, // 讓主內容區塊自動填滿剩餘空間
                  }}
                >
                  <Suspense fallback={null}>
                    <AppWrapper appBarLabels={appBarLabels} lng={lng}>
                      {children}
                    </AppWrapper>
                  </Suspense>
                </Container>

                {/* Footer 移出 Container，但在 Providers 內 */}
                <Suspense fallback={null}>
                  <Footer
                    consentSettingsLabel={
                      chrome.common.analytics_consent.settings
                    }
                    showConsentSettings={Boolean(googleAnalyticsId)}
                    siteName={chrome.common.site_name}
                  />
                </Suspense>
              </Box>
            </Providers>
          </AppTheme>
        </AppRouterCacheProvider>
        {googleAnalyticsId ? (
          <ConsentBanner
            acceptLabel={chrome.common.analytics_consent.accept}
            description={chrome.common.analytics_consent.description}
            rejectLabel={chrome.common.analytics_consent.reject}
            title={chrome.common.analytics_consent.title}
          />
        ) : null}
      </body>
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
