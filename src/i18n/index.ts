// src/i18n/index.ts
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getI18nextOptions } from "./config";
import { Locale } from "@/i18n/types";
import { Namespace } from "@/i18n/types";

const initI18next = async (lng: Locale, ns: Namespace) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: Locale, ns: Namespace) => import(`./locales/${lng}/${ns}.json`)
      )
    )
    .init(getI18nextOptions(lng, ns));
  return i18nInstance;
};

export async function getServerTranslation(lng: Locale, ns: Namespace) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  };
}