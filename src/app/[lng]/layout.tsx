// NOT FOUND: https://github.com/vercel/next.js/discussions/50518

// src/app/[lng]/layout.tsx
import { ReactElement } from "react";
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
import AppAppBar from "@/components/UI/AppAppBar/AppAppBar";
import AppWrapper from "./_components/AppWrapper";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lng: Locale }>;
}) => {
  const { lng } = await params;
  const tCommon = await getServerTranslation(lng, "common");
  return {
    title: tCommon.t("site_name"),
  };
};

// 「靜態生成（Static Generation）」多語系（i18n）頁面時，告訴 Next.js 需要預先產生哪些語言版本的路由。
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

type RootLayoutProps = {
  children: ReactElement;
  params: Promise<{ lng: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppTheme>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            <Container
              maxWidth="lg"
              component="main"
              sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
            >
              <Providers>
                <AppWrapper>{children}</AppWrapper>
              </Providers>
            </Container>
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
