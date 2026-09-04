import { cookieName } from "./config";
import type { Locale } from "./types";

export function persistLocaleCookie(locale: Locale) {
  document.cookie = `${cookieName}=${encodeURIComponent(locale)}; Path=/; SameSite=Lax`;
}
