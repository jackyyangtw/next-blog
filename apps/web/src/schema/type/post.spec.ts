import { expect, test } from "@playwright/test";
import { PostsResponseSchema, PostSchema } from "./post";
import { postSummaryFixture } from "./post.test-fixtures";

test("list accepts an actual Sanity image and missing body; detail requires body", () => {
  const result = PostsResponseSchema.parse({
    data: [postSummaryFixture],
    total: 1,
    page: 1,
    limit: 10,
  });
  expect(result.data[0].author.avatar).toEqual(
    postSummaryFixture.author.avatar,
  );
  expect(PostSchema.safeParse(postSummaryFixture).success).toBe(false);
  expect(
    PostSchema.safeParse({ ...postSummaryFixture, content: [] }).success,
  ).toBe(true);
});

test("rejects malformed list items and pagination instead of propagating any", () => {
  for (const changed of [
    { total: "1" },
    { page: 0 },
    { limit: 51 },
    { data: [{ ...postSummaryFixture, slug: { current: "title" } }] },
  ]) {
    expect(
      PostsResponseSchema.safeParse({
        data: [postSummaryFixture],
        total: 1,
        page: 1,
        limit: 10,
        ...changed,
      }).success,
    ).toBe(false);
  }
});
