import { fallbackLng, languages } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

const DEFAULT_LOCAL_URL = "http://localhost:3200";
const PRODUCTION_HOST = "jacky-dev.com";
const WWW_PRODUCTION_HOST = `www.${PRODUCTION_HOST}`;

function normalizeSiteUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === WWW_PRODUCTION_HOST) {
      url.hostname = PRODUCTION_HOST;
    }
    if (url.hostname === PRODUCTION_HOST) {
      url.protocol = "https:";
      url.port = "";
    }
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return rawUrl.replace(/\/+$/, "");
  }
}
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

  return normalizeSiteUrl(rawUrl);
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

/**
 * 序列化 JSON-LD 結構化資料。
 * 內容來自 Sanity（標題、作者名、description），必須把 `<` 跳脫成 Unicode escape，
 * 否則字串中的 `</script>` 會提前關閉標籤造成 XSS。
 */
export function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
