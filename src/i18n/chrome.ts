import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enComponent from "./locales/en/component.json";
import enNavigation from "./locales/en/nav-links.json";
import zhTwAuth from "./locales/zh-TW/auth.json";
import zhTwCommon from "./locales/zh-TW/common.json";
import zhTwComponent from "./locales/zh-TW/component.json";
import zhTwNavigation from "./locales/zh-TW/nav-links.json";
import type { Locale } from "./types";

const CHROME_TRANSLATIONS = {
  en: {
    auth: enAuth,
    common: enCommon,
    component: enComponent,
    navigation: enNavigation,
  },
  "zh-TW": {
    auth: zhTwAuth,
    common: zhTwCommon,
    component: zhTwComponent,
    navigation: zhTwNavigation,
  },
} as const;

export function getChromeTranslations(locale: Locale) {
  return CHROME_TRANSLATIONS[locale];
}
