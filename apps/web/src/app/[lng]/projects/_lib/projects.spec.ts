import { describe, expect, test } from "vitest";
import en from "../../../../i18n/locales/en/projects-page.json";
import zhTw from "../../../../i18n/locales/zh-TW/projects-page.json";
import { PROJECTS } from "./projects";

const LOCALES = { en, "zh-TW": zhTw } as const;

describe("PROJECTS 翻譯完整性", () => {
  for (const [locale, messages] of Object.entries(LOCALES)) {
    test(`${locale} 每個專案都有名稱、標語、提示與所有亮點`, () => {
      for (const project of PROJECTS) {
        const item = messages.items[project.key];
        expect(item.name).toBeTruthy();
        expect(item.tagline).toBeTruthy();
        expect(item.note).toBeTruthy();
        for (let i = 0; i < project.highlightCount; i++) {
          expect(
            item.highlights[String(i) as keyof typeof item.highlights],
          ).toBeTruthy();
        }
      }
    });
  }
});

describe("PROJECTS 連結", () => {
  test("每個專案至少有 Demo 或 GitHub 其中一個連結", () => {
    for (const project of PROJECTS) {
      expect(project.demoUrl ?? project.repoUrl).toBeTruthy();
    }
  });

  test("Demo 與 GitHub 連結皆為 https", () => {
    for (const project of PROJECTS) {
      for (const url of [project.demoUrl, project.repoUrl]) {
        if (url) expect(url).toMatch(/^https:\/\//);
      }
    }
  });
});
