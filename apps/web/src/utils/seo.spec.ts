import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { postCanonicalUrl } from "./seo";

const SITE_URL_ENVS = [
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
];

describe("postCanonicalUrl", () => {
  beforeEach(() => {
    // 清空網站網址環境變數，讓測試只依賴傳入的 origin
    for (const name of SITE_URL_ENVS) {
      vi.stubEnv(name, "");
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("文章標準網址一律指向 zh-TW 版本", () => {
    expect(postCanonicalUrl("hello-world", "https://example.com")).toBe(
      "https://example.com/zh-TW/post/hello-world",
    );
  });

  test("origin 結尾的斜線不會產生重複斜線", () => {
    expect(postCanonicalUrl("hello-world", "https://example.com/")).toBe(
      "https://example.com/zh-TW/post/hello-world",
    );
  });

  test("環境變數設定的正式網域會統一為 https 且移除 www", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://www.jacky-dev.com/");
    expect(postCanonicalUrl("hello-world")).toBe(
      "https://jacky-dev.com/zh-TW/post/hello-world",
    );
  });
});
