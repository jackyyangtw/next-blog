import { BookmarkDoc } from "@/schema/type/bookmark";
import { clientFetch } from "@/utils/fetch/client";

export const fetchBookmarks = async (): Promise<BookmarkDoc[]> => {
  return clientFetch("/api/bookmarks");
};

export const addBookmark = async (postId: string): Promise<BookmarkDoc> => {
  return clientFetch("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
};

export const removeBookmark = async (postId: string): Promise<BookmarkDoc> => {
  return clientFetch(`/api/bookmarks?postId=${postId}`, {
    method: "DELETE",
  });
};
