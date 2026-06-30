// src/i18n/client.ts
"use client";

import { useEffect } from "react";
import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationOptions,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import {
  getI18nextOptions,
  cookieName,
  defaultNS,
  fallbackLng,
} from "./config";
import { Locale } from "@/i18n/types";
import { Namespace } from "@/i18n/types";
import { useParams } from "next/navigation";
import { loadTranslationResource } from "./resources";

i18next
  .use(initReactI18next)
  .use(resourcesToBackend(loadTranslationResource))
  .init({
    ...getI18nextOptions(fallbackLng),
    preload: [],
  });

function useClientTranslationBasic(
  lng: string,
  ns: string,
  options?: UseTranslationOptions<string>,
) {
  const ret = useTranslationOrg(ns, { ...options, lng });

  useEffect(() => {
    document.cookie = `${cookieName}=${encodeURIComponent(lng)}; Path=/; SameSite=Lax`;
  }, [lng]);

  return ret;
}

export function useClientTranslation(namespace: Namespace = defaultNS) {
  const { lng } = useParams();
  const { t, i18n } = useClientTranslationBasic(lng as Locale, namespace);

  return {
    lng: lng as Locale,
    t,
    i18n,
  };
}
