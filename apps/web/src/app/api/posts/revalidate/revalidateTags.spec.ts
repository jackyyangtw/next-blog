import { describe, expect, test } from "vitest";
import { getRevalidateTags } from "./revalidateTags";

describe("getRevalidateTags", () => {
  test("文章變動時只清除列表與該篇文章", () => {
    expect(getRevalidateTags({ _type: "post", slug: "hello" })).toEqual([
      "posts",
      "post:hello",
    ]);
  });

  test("文章 slug 變更時同時清除新舊 slug", () => {
    expect(
      getRevalidateTags({ _type: "post", slug: "new", oldSlug: "old" }),
    ).toEqual(["posts", "post:new", "post:old"]);
  });

  test("新舊 slug 相同時不重複", () => {
    expect(
      getRevalidateTags({ _type: "post", slug: "same", oldSlug: "same" }),
    ).toEqual(["posts", "post:same"]);
  });

  test("文章缺少 slug 時只清除列表", () => {
    expect(getRevalidateTags({ _type: "post", slug: null })).toEqual(["posts"]);
  });

  test("作者或分類變動時清除所有列表與詳情頁", () => {
    expect(getRevalidateTags({ _type: "author" })).toEqual([
      "posts",
      "post-detail",
    ]);
    expect(getRevalidateTags({ _type: "category" })).toEqual([
      "posts",
      "post-detail",
    ]);
  });
});
