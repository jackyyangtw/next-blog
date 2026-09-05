import { PostsResponseSchema, type PostsResponse } from "@/schema/type/post";
import { FetchPostsParams } from "./types";
import { HttpError } from "@/utils/fetch/http-error";

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

  return PostsResponseSchema.parse(await res.json());
}
