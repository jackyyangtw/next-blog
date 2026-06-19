import { fallbackLng, languages } from "@/i18n/config";
import { Locale } from "@/i18n/types";

const DEFAULT_LOCAL_URL = "http://localhost:3200";

export function getSiteUrl(fallback = DEFAULT_LOCAL_URL) {
  const rawUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined) ||
    fallback;

  return rawUrl.replace(/\/+$/, "");
}

export function absoluteUrl(path = "", fallback?: string) {
  const siteUrl = getSiteUrl(fallback);
  if (!path) {
    return siteUrl;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return new URL(path, `${siteUrl}/`).toString();
}

export function localizedPath(lng: Locale | string, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lng}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function localizedUrl(
  lng: Locale | string,
  path = "",
  fallback?: string,
) {
  return absoluteUrl(localizedPath(lng, path), fallback);
}

export function languageAlternates(path = "", fallback?: string) {
  return {
    ...Object.fromEntries(
      languages.map((lng) => [lng, localizedUrl(lng, path, fallback)]),
    ),
    "x-default": localizedUrl(fallbackLng, path, fallback),
  };
}

export function openGraphLocale(lng: Locale | string) {
  return lng.replace("-", "_");
}
