import { z } from "zod";
import {
  BookmarkSchema,
  BookmarkMutationResponseSchema,
  type BookmarkDoc,
  type BookmarkMutationResponse,
} from "@/schema/type/bookmark";
import { clientFetch } from "@/utils/fetch/client";

export const fetchBookmarks = async (): Promise<BookmarkDoc[]> =>
  z.array(BookmarkSchema).parse(await clientFetch("/api/bookmarks"));

export const addBookmark = async (
  postId: string,
): Promise<BookmarkMutationResponse> =>
  BookmarkMutationResponseSchema.parse(
    await clientFetch("/api/bookmarks", {
      method: "POST",
      body: JSON.stringify({ postId }),
    }),
  );

export const removeBookmark = async (
  postId: string,
): Promise<BookmarkMutationResponse> =>
  BookmarkMutationResponseSchema.parse(
    await clientFetch(`/api/bookmarks?postId=${encodeURIComponent(postId)}`, {
      method: "DELETE",
    }),
  );
