import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./fetch";
import { queryKeys } from "../query-keys";
import type { FetchPostsParams } from "./types";

export const usePosts = (params: FetchPostsParams) => {
  const refetchInterval = 1000 * 60 * 5;
  return useQuery({
    queryKey: queryKeys.posts(params),
    queryFn: () => fetchPosts(params),
    staleTime: refetchInterval, // 5分鐘後重新獲取資料
    refetchInterval, // 每5分鐘重新獲取資料(資料再度變成新鮮)
  });
};
