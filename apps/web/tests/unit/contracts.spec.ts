import { expect, test } from "@playwright/test";
import { PostsResponseSchema, PostSchema } from "../../src/schema/type/post";
import {
  BookmarkInputSchema,
  BookmarkSchema,
  BookmarkMutationResponseSchema,
} from "../../src/schema/type/bookmark";

const summary = {
  _id: "post-1",
  _createdAt: "2026-09-05T00:00:00Z",
  title: "Title",
  slug: "title",
  description: "Description",
  categories: [],
  bannerSource: null,
  presetBanner: null,
  photo: null,
  author: {
    _id: "author-1",
    name: "Author",
    avatar: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc-100x100-png" },
      hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
    },
  },
};

test("list accepts an actual Sanity image and missing body; detail requires body", () => {
  const result = PostsResponseSchema.parse({
    data: [summary],
    total: 1,
    page: 1,
    limit: 10,
  });
  expect(result.data[0].author.avatar).toEqual(summary.author.avatar);
  expect(PostSchema.safeParse(summary).success).toBe(false);
  expect(PostSchema.safeParse({ ...summary, content: [] }).success).toBe(true);
});

test("rejects malformed list items and pagination instead of propagating any", () => {
  for (const changed of [
    { total: "1" },
    { page: 0 },
    { limit: 51 },
    { data: [{ ...summary, slug: { current: "title" } }] },
  ]) {
    expect(
      PostsResponseSchema.safeParse({
        data: [summary],
        total: 1,
        page: 1,
        limit: 10,
        ...changed,
      }).success,
    ).toBe(false);
  }
});

test("bookmark read contract contains a summary and tolerates deleted references", () => {
  for (const post of [summary, null]) {
    expect(
      BookmarkSchema.safeParse({
        _id: "bookmark-1",
        _createdAt: summary._createdAt,
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
