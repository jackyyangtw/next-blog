import { expect, test } from "@playwright/test";
import {
  BookmarkInputSchema,
  BookmarkMutationResponseSchema,
  BookmarkSchema,
} from "./bookmark";
import { postSummaryFixture } from "./post.test-fixtures";

test("bookmark read contract contains a summary and tolerates deleted references", () => {
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

test("mutations have explicit responses and reject invalid published IDs", () => {
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
