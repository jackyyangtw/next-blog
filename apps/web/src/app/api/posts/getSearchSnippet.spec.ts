import { expect, test } from "vitest";
import { getSearchSnippet } from "./getSearchSnippet";

test("內文命中時擷取關鍵字附近的片段", () => {
  const content = `${"前段文字 ".repeat(20)}Client Component JavaScript reference ${"後續內容 ".repeat(20)}`;
  const snippet = getSearchSnippet(content, "javascript");

  expect(snippet).toContain("JavaScript");
  expect(snippet).toMatch(/^…/);
  expect(snippet).toMatch(/…$/);
  expect(snippet?.length).toBeLessThan(content.length);
});

test("英文片段從完整單字開始並在完整單字後結束", () => {
  const content = `${"prefix ".repeat(10)}Client Component JavaScript reference ${"after ".repeat(30)}`;
  const snippet = getSearchSnippet(content, "JavaScript");

  expect(snippet).toMatch(/^…prefix /);
  expect(snippet).toMatch(/after…$/);
});

test("擷取片段時會保留 CI/CD 搜尋別名", () => {
  expect(getSearchSnippet("GitLab CI/CD 部署流程", "cicd")).toBe(
    "GitLab CI/CD 部署流程",
  );
});

test("內文沒有命中或搜尋字為空時不產生片段", () => {
  expect(getSearchSnippet("React 效能優化", "javascript")).toBeNull();
  expect(getSearchSnippet("Detail failed", "AI")).toBeNull();
  expect(getSearchSnippet("React 效能優化", "  ")).toBeNull();
});
