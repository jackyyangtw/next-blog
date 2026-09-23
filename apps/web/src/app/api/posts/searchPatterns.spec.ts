import { expect, test } from "vitest";
import { getPostSearchPatterns } from "./searchPatterns";

test("輸入 nextjs 時也會搜尋 Next.js 寫法", () => {
  expect(getPostSearchPatterns("nextjs")).toEqual({
    keyword: "*nextjs*",
    alternateKeyword: "*next.js*",
  });
});

test("輸入 Next.js 時也會搜尋 NextJS 寫法", () => {
  expect(getPostSearchPatterns("Next.js")).toEqual({
    keyword: "*Next.js*",
    alternateKeyword: "*nextjs*",
  });
});

test("輸入 cicd 時也會搜尋 CI/CD 寫法", () => {
  expect(getPostSearchPatterns("cicd")).toEqual({
    keyword: "*cicd*",
    alternateKeyword: "*ci/cd*",
  });
});

test("輸入 CI/CD 時也會搜尋 cicd 寫法", () => {
  expect(getPostSearchPatterns("CI/CD")).toEqual({
    keyword: "*CI/CD*",
    alternateKeyword: "*cicd*",
  });
});

test("搜尋 AI 時只比對完整詞而不包含 Detail 或 failed", () => {
  expect(getPostSearchPatterns("AI")).toEqual({
    keyword: "AI",
    alternateKeyword: null,
  });
  expect(getPostSearchPatterns("ai")).toEqual({
    keyword: "ai",
    alternateKeyword: null,
  });
});

test("包含其他關鍵字時仍保留 Next.js 的替代寫法", () => {
  expect(getPostSearchPatterns("nextjs cache")).toEqual({
    keyword: "*nextjs cache*",
    alternateKeyword: "*next.js cache*",
  });
});

test("一般關鍵字與空白搜尋不增加替代條件", () => {
  expect(getPostSearchPatterns("react")).toEqual({
    keyword: "*react*",
    alternateKeyword: null,
  });
  expect(getPostSearchPatterns("  ")).toEqual({
    keyword: null,
    alternateKeyword: null,
  });
});
