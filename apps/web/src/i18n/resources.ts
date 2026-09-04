import type { Locale, Namespace } from "./types";

type ResourceLoader = () => Promise<unknown>;

const RESOURCE_LOADERS: Record<Locale, Record<Namespace, ResourceLoader>> = {
  en: {
    "auth-page": () => import("./locales/en/auth-page.json"),
    auth: () => import("./locales/en/auth.json"),
    common: () => import("./locales/en/common.json"),
    component: () => import("./locales/en/component.json"),
    "home-page": () => import("./locales/en/home-page.json"),
    "nav-links": () => import("./locales/en/nav-links.json"),
    "posts-page": () => import("./locales/en/posts-page.json"),
    "user-page": () => import("./locales/en/user-page.json"),
  },
  "zh-TW": {
    "auth-page": () => import("./locales/zh-TW/auth-page.json"),
    auth: () => import("./locales/zh-TW/auth.json"),
    common: () => import("./locales/zh-TW/common.json"),
    component: () => import("./locales/zh-TW/component.json"),
    "home-page": () => import("./locales/zh-TW/home-page.json"),
    "nav-links": () => import("./locales/zh-TW/nav-links.json"),
    "posts-page": () => import("./locales/zh-TW/posts-page.json"),
    "user-page": () => import("./locales/zh-TW/user-page.json"),
  },
};

export function loadTranslationResource(language: string, namespace: string) {
  const localeLoaders = RESOURCE_LOADERS[language as Locale];
  const loader = localeLoaders?.[namespace as Namespace];

  if (!loader) {
    return Promise.reject(
      new Error(`Unsupported translation resource: ${language}/${namespace}`),
    );
  }

  return loader();
}
