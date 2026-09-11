import type {
  BookmarkDoc,
  BookmarkMutationResponse,
} from "@/schema/type/bookmark";
import { clientFetch } from "@/utils/fetch/client";

/**
 * Response validation lives in the /api/bookmarks route handler. Importing the
 * runtime schemas here would pull Zod and the post summary schema graph into
 * every route that can bookmark.
 */
export const fetchBookmarks = async (): Promise<BookmarkDoc[]> =>
  clientFetch("/api/bookmarks");

export const addBookmark = async (
  postId: string,
): Promise<BookmarkMutationResponse> =>
  clientFetch("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify({ postId }),
  });

export const removeBookmark = async (
  postId: string,
): Promise<BookmarkMutationResponse> =>
  clientFetch(`/api/bookmarks?postId=${encodeURIComponent(postId)}`, {
    method: "DELETE",
  });
