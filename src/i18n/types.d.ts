import { Locale } from "@/types/locale";

// 語系資源的命名空間型別
export type Namespace =
  // pages
  | "dashboard"
  | "setting-org"
  | "reset-password"
  | "login"
  | "product-info"
  | "news-page"
  | "industry-reports-page"
  | "deep-dive-column"
  // UI components
  | "dialog"
  // common
  | "form"
  | "common"
  | "error"
  | "home"
  | "footer"
  | "components";

// 語系設定介面
export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  fallbackLocale: Locale;
  cookieName: string;
  defaultNamespace: Namespace;
}

export type Locale = 'en' | 'zh-TW';

export interface LocaleConfig {
  label: string;
  value: Locale;
}
