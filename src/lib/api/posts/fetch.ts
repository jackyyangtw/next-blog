import { FetchPostsParams } from "./types";

export async function fetchPosts(params: FetchPostsParams = {}) {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  const res = await fetch(`/api/posts?${searchParams}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }

  return res.json();
}