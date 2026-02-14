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
import AppWrapper from "./_components/AppWrapper";
import Footer from "./_components/Footer";
import Box from "@mui/material/Box";

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

export default async function RootLayout(props: LayoutProps<"/[lng]">) {
  const { children, params } = props;
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
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
                    my: { xs: 8, md: 16 }, 
                    gap: 4, 
                    flexGrow: 1 // 讓主內容區塊自動填滿剩餘空間
                  }}
                >
                  <AppWrapper>{children}</AppWrapper>
                </Container>

                {/* Footer 移出 Container，但在 Providers 內 */}
                <Footer />
              </Box>
            </Providers>
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
