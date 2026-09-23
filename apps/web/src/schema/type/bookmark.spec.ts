import { expect, test } from "vitest";
import {
  BookmarkInputSchema,
  BookmarkMutationResponseSchema,
  BookmarkSchema,
} from "./bookmark";
import { postSummaryFixture } from "./post.test-fixtures";

test("書籤讀取資料包含文章摘要，並容許已刪除的參照", () => {
  for (const post of [postSummaryFixture, null]) {
    expect(
      BookmarkSchema.safeParse({
        _id: "bookmark-1",
        _createdAt: postSummaryFixture._createdAt,
        post,
      }).success,
    ).toBe(true);
  }
});

test("書籤異動回傳明確結果，並拒絕無效的已發布文章 ID", () => {
  expect(
    BookmarkMutationResponseSchema.parse({
      postId: "post-1",
      bookmarked: false,
    }),
  ).toEqual({ postId: "post-1", bookmarked: false });
  for (const postId of [
    null,
    {},
    123,
    "",
    "drafts.post-1",
    "post/1",
    "a".repeat(129),
  ]) {
    expect(BookmarkInputSchema.safeParse({ postId }).success).toBe(false);
  }
  expect(BookmarkInputSchema.safeParse({ postId: "post-1" }).success).toBe(
    true,
  );
});
