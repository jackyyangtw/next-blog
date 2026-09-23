import { expect, test } from "vitest";
import { getHighlightParts } from "./getHighlightParts";

test("搜尋 nextjs 時會標記 Next.js 與 Nextjs", () => {
  expect(getHighlightParts("Next.js 和 Nextjs", "nextjs")).toEqual([
    { text: "Next.js", isHighlighted: true },
    { text: " 和 ", isHighlighted: false },
    { text: "Nextjs", isHighlighted: true },
  ]);
});

test("搜尋 Next.js 時也會標記沒有句點的寫法", () => {
  expect(getHighlightParts("Nextjs 入門", "Next.js")).toEqual([
    { text: "Nextjs", isHighlighted: true },
    { text: " 入門", isHighlighted: false },
  ]);
});

test("搜尋 cicd 時會標記 CI/CD 與 cicd", () => {
  expect(getHighlightParts("GitLab CI/CD 與 cicd", "cicd")).toEqual([
    { text: "GitLab ", isHighlighted: false },
    { text: "CI/CD", isHighlighted: true },
    { text: " 與 ", isHighlighted: false },
    { text: "cicd", isHighlighted: true },
  ]);
});

test("搜尋 CI/CD 時也會標記沒有斜線的寫法", () => {
  expect(getHighlightParts("cicd 實戰", "CI/CD")).toEqual([
    { text: "cicd", isHighlighted: true },
    { text: " 實戰", isHighlighted: false },
  ]);
});

test("搜尋 AI 時只標記獨立詞，不標記 Detail 或 failed", () => {
  expect(getHighlightParts("Detail failed AI 與 ai-powered", "AI")).toEqual([
    { text: "Detail failed ", isHighlighted: false },
    { text: "AI", isHighlighted: true },
    { text: " 與 ", isHighlighted: false },
    { text: "ai", isHighlighted: true },
    { text: "-powered", isHighlighted: false },
  ]);
});

test("搜尋多個詞時會分別標記卡片中的符合文字", () => {
  expect(getHighlightParts("Next.js Cache 入門", "nextjs cache")).toEqual([
    { text: "Next.js", isHighlighted: true },
    { text: " ", isHighlighted: false },
    { text: "Cache", isHighlighted: true },
    { text: " 入門", isHighlighted: false },
  ]);
});

test("搜尋含正則特殊字元的內容不會造成錯誤", () => {
  expect(getHighlightParts("使用 C++ 開發", "C++")).toEqual([
    { text: "使用 ", isHighlighted: false },
    { text: "C++", isHighlighted: true },
    { text: " 開發", isHighlighted: false },
  ]);
});

test("沒有符合文字時保留原文", () => {
  expect(getHighlightParts("React 效能", "nextjs")).toEqual([
    { text: "React 效能", isHighlighted: false },
  ]);
});
