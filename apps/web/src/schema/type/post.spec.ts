import { expect, test } from "vitest";
import { PostsResponseSchema, PostSchema } from "./post";
import { postSummaryFixture } from "./post.test-fixtures";

test("列表接受實際的 Sanity 圖片與缺少內文的文章，詳情則要求內文", () => {
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

test("拒絕格式錯誤的列表項目與分頁資料", () => {
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
