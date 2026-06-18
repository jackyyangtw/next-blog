import type { FetchPostsParams } from "./posts/types";

export const queryKeys = {
  user: ["user"] as const,
  posts: (params: FetchPostsParams = {}) =>
    [
      "posts",
      {
        page: params.page,
        limit: params.limit,
        categories: params.categories,
        keyword: params.keyword,
      },
    ] as const,
  categories: ["categories"] as const,
  bookmarks: ["bookmarks"] as const,
};
