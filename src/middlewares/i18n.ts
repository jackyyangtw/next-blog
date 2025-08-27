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

  // 處理 referer 中的語系資訊
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer")!);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
    return { lng: lngInReferer || lng, response };
  }

  return { lng };
}
