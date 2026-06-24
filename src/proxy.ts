// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { handleI18nMiddleware } from "@/middlewares";

export const config = {
  matcher: [
    // 修改這裡，增加 .xml 的排除邏輯
    "/((?!studio|api|_next/static|_next/image|assets|favicon.ico|sw.js|images|.*\\.xml$).*)",
  ],
};
export async function proxy(req: NextRequest) {
  // =====================
  // 1. i18n 語系導向邏輯
  // =====================
  const i18nResult = handleI18nMiddleware(req);

  // 如果有重導向回應，直接返回
  if (i18nResult.response) {
    return i18nResult.response;
  }

  return NextResponse.next();
}
