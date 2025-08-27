// hooks/url/useCustomSearchParams.ts
"use client";
import { useSearchParams, useRouter } from "next/navigation";

export function useSearchParamsActions({ pageUrl }: { pageUrl: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParams.get(key) || "";

  const setParam = (
    key: string,
    value: string,
    options: { resetOffset?: boolean; resetPage?: boolean } = {} // 除了 offset (pagination頁數) 本身，其它變動都歸 1
  ) => {
    const params = cloneParams();
    if (value) params.set(key, value);
    else params.delete(key);
    if (options.resetOffset && key !== "offset") params.set("offset", "0");
    if (options.resetPage && key !== "page") params.set("page", "1");
    router.replace(`${pageUrl}?${params.toString()}`);
  };

  const removeParam = (key: string) => setParam(key, "");

  const cloneParams = () =>
    new URLSearchParams(Array.from(searchParams.entries()));

  return {
    getParam,
    setParam,
    removeParam,
    paramsString: searchParams.toString(),
    cloneParams,
  };
}
