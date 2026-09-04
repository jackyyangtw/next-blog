// src/lib/middleware/i18n.ts
import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "@/i18n/config";
import { Locale } from "@/i18n/types";

acceptLanguage.languages(languages);

export interface I18nMiddlewareResult {
  lng: string;
  response?: NextResponse;
}

export function handleI18nMiddleware(req: NextRequest): I18nMiddlewareResult {
  const { pathname } = req.nextUrl;

  if (pathname.includes(".")) {
    return { lng: fallbackLng };
  }
  // 取得語系
  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)!.value);
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  const pathnameFirstSegment = req.nextUrl.pathname.split("/")[1];
  const hasValidLanguage = languages.includes(pathnameFirstSegment as Locale);

  if (!hasValidLanguage && !req.nextUrl.pathname.startsWith("/_next")) {
    const url = req.nextUrl.clone();
    url.pathname = `/${lng}${req.nextUrl.pathname}`;
    const response = NextResponse.redirect(url);
    return { lng, response };
  }

  if (hasValidLanguage) {
    const routeLocale = pathnameFirstSegment as Locale;
    const currentCookie = req.cookies.get(cookieName)?.value;

    if (currentCookie === routeLocale) {
      return { lng: routeLocale };
    }

    const response = NextResponse.next();
    response.cookies.set(cookieName, routeLocale, {
      path: "/",
      sameSite: "lax",
    });
    return { lng: routeLocale, response };
  }

  return { lng };
}
