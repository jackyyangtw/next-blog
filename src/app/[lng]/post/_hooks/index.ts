"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useMemo, useCallback } from "react";

const DEFAULTS = { page: 1, limit: 10 };

export function usePostsQueryParams() {
  const sp = useSearchParams();

  // 注意：sp 是 Next.js 自帶的，先轉成 object
  const parsed = useMemo(
    () =>
      queryString.parse(sp.toString(), {
        arrayFormat: "comma",
        parseNumbers: true,
        parseBooleans: true,
      }),
    [sp] // 只在字串改變時重算
  );

  return {
    page: (parsed.page as number) ?? DEFAULTS.page,
    limit: (parsed.limit as number) ?? DEFAULTS.limit,
    categories: (parsed.categories as string[]) ?? [],
    keyword: (parsed.keyword as string) ?? "",
  };
}

export function useSetPostsQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 讓 setParams 具有穩定引用
  const setParams = useCallback(
    (
      patch: Partial<{
        page: number;
        limit: number;
        categories: string[];
        keyword: string;
      }>
    ) => {
      const curr = queryString.parse(searchParams.toString(), { arrayFormat: "comma" });

      const next: Record<string, unknown> = { ...curr, ...patch };

      // 清預設值，避免髒 URL
      if (next.page === DEFAULTS.page) delete next.page;
      if (next.limit === DEFAULTS.limit) delete next.limit;
      if (!next.keyword) delete next.keyword;
      if (!Array.isArray(next.categories) || !(next.categories as string[]).length)
        delete next.categories;

      const currQs = searchParams.toString();
      const nextQs = queryString.stringify(next, { arrayFormat: "comma" });

      // ⭐ 關鍵：一樣就不做任何事，避免 replace 造成循環
      if (nextQs === currQs) return;

      router.replace(nextQs ? `${pathname}?${nextQs}` : pathname);
    },
    [router, pathname, searchParams] // 合理且必要的依賴
  );

  return setParams;
}