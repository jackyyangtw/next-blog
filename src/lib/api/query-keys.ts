import type { FetchPostsParams } from "./posts/types";

export const queryKeys = {
  user: ["user"],
  posts: (params: FetchPostsParams) => [
    "posts",
    params.page,
    params.limit,
    params.categories,
    params.keyword,
  ],
  categories: ["categories"],
  bookmarks: ["bookmarks"],
};
