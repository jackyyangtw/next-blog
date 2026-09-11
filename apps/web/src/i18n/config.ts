// src/i18n/config.ts
import type { Locale, LocaleConfig } from "@/i18n/types";
import { zhTW, enUS } from "@mui/material/locale"; // 🚨 這只是 MUI 的語系設定
import type { Namespace } from "@/i18n/types";

// ---------------------------- i18next 語系設定 ----------------------------
export const fallbackLng: Locale = "zh-TW";
export const languages: Locale[] = [fallbackLng, "en"];
export const cookieName = "i18next";
export const defaultNS: Namespace = "common";
export function getI18nextOptions(lng: Locale = fallbackLng, ns = defaultNS) {
  return {
    debug: false,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

// ---------------------------- MUI 語系設定 ----------------------------
// 顯示的語系文字、值
export const LOCALES: LocaleConfig[] = [
  { label: "English", value: "en" },
  { label: "中文（繁體）", value: "zh-TW" },
];

// 一般的MUI語系設定
export const MUILocaleMap: Record<Locale, typeof enUS> = {
  en: enUS,
  "zh-TW": zhTW,
};
export function getMUILocale(lng: Locale) {
  return MUILocaleMap[lng];
}

//❗ Data Grid 自己的語系設定
// 語系設定: https://mui.com/x/react-data-grid/localization/
// export const MUIXDataGridLocaleMap: Record<Locale, typeof dataGridZhTW> = {
//   en: dataGridEnUS,
//   "zh-TW": dataGridZhTW,
// };
// export const getMUIXDataGridLocale = (lng: Locale) => {
//   return MUIXDataGridLocaleMap[lng].components.MuiDataGrid.defaultProps.localeText;
// };
