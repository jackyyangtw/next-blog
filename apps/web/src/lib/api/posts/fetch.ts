import type { PostsResponse } from "@/schema/type/post";
import type { FetchPostsParams } from "./types";
import { HttpError } from "@/utils/fetch/http-error";

/**
 * Response validation lives in the /api/posts route handler
 * (PostsResponseSchema.parse). Re-parsing here would ship the whole Zod
 * runtime and the post/author/category/blockContent schemas to the client.
 */
export async function fetchPosts(
  params: FetchPostsParams = {},
): Promise<PostsResponse> {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  );

  const res = await fetch(`/api/posts?${searchParams}`);

  if (!res.ok) {
    throw new HttpError("Failed to fetch posts", res.status);
  }

  return res.json();
}
