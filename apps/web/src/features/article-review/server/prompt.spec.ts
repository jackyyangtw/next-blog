import { describe, expect, test } from "vitest";
import { buildPrompt, buildSystemPrompt } from "./prompt";
import type { ReviewArticleRequest } from "../types";

const baseRequest: ReviewArticleRequest = {
  title: "React Query 的 enabled 選項",
  description: "說明 enabled 的使用時機",
  content: "文章內容",
  locale: "zh-TW",
  categories: ["React"],
};

describe("buildSystemPrompt", () => {
  test("zh-TW 語系要求以台灣用語的繁體中文撰寫報告", () => {
    const prompt = buildSystemPrompt("zh-TW");

    expect(prompt).toContain("Traditional Chinese");
    expect(prompt).not.toContain("Write the report in English.");
  });

  test("en 語系要求以英文撰寫報告", () => {
    const prompt = buildSystemPrompt("en");

    expect(prompt).toContain("Write the report in English.");
    expect(prompt).not.toContain("Traditional Chinese");
  });

  test("包含資訊增益、親身經驗、搜尋意圖與結論先行的檢查", () => {
    const prompt = buildSystemPrompt("zh-TW");

    expect(prompt).toContain("Information gain:");
    expect(prompt).toContain("First-hand experience:");
    expect(prompt).toContain("Search intent:");
    expect(prompt).toContain("Answer-first structure:");
  });

  test("明確告知無法搜尋網路，且不建議堆疊關鍵字", () => {
    const prompt = buildSystemPrompt("zh-TW");

    expect(prompt).toContain("You cannot search the web");
    expect(prompt).toContain("Do not recommend increasing keyword density");
  });
});

describe("buildPrompt", () => {
  test("列出套件版本，未提供版本時標示 version unspecified", () => {
    const prompt = buildPrompt({
      ...baseRequest,
      technicalContext: {
        libraries: [{ name: "next", version: "16.4.1" }, { name: "react" }],
      },
    });

    expect(prompt).toContain("next: 16.4.1");
    expect(prompt).toContain("react: version unspecified");
  });

  test("缺少標題、描述、分類與套件時使用預設文字", () => {
    const prompt = buildPrompt({
      ...baseRequest,
      title: "",
      description: "",
      categories: [],
    });

    expect(prompt).toContain("Title: (empty)");
    expect(prompt).toContain("Description: (empty)");
    expect(prompt).toContain("Categories: (none)");
    expect(prompt).toContain("(none provided)");
  });
});
