import { Locale } from "@/types/locale";

// 語系資源的命名空間型別
export type Namespace =
  // common
  | "common"
  // component
  | "component"
  // auth
  | "auth"
  // pages
  | "user-page"
  | "posts-page"
  // nav-links
  | "nav-links";

// 語系設定介面
export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  fallbackLocale: Locale;
  cookieName: string;
  defaultNamespace: Namespace;
}

export type Locale = "en" | "zh-TW";

export interface LocaleConfig {
  label: string;
  value: Locale;
}
