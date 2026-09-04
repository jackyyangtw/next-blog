import type { AppLocale } from "../i18n";

export const topics = ["全部", "React", "Next.js", "AI"] as const;

export type Topic = (typeof topics)[number];

export interface ArticlePreview {
  category: Exclude<Topic, "全部">;
  description: string;
  id: string;
  readTime: string;
  title: string;
}

const homeContent: Record<
  AppLocale,
  { featuredArticle: ArticlePreview; latestArticles: readonly ArticlePreview[] }
> = {
  en: {
    featuredArticle: {
      category: "Next.js",
      description:
        "Build a faster, easier-to-maintain content site through cache strategy, data loading, and interaction boundaries.",
      id: "cache-components",
      readTime: "8 min read",
      title: "Craft an Instant Next.js Content Experience",
    },
    latestArticles: [
      {
        category: "React",
        description:
          "Use less memoization and let components stay efficient at the right boundaries.",
        id: "react-compiler",
        readTime: "6 min read",
        title: "How React Compiler Changes Component Design",
      },
      {
        category: "AI",
        description:
          "Build a reliable content-assistance workflow from prompts to validation and feedback.",
        id: "ai-content-workflow",
        readTime: "5 min read",
        title: "Making AI Part of the Content Workflow",
      },
      {
        category: "Next.js",
        description:
          "Clarify the practical boundary between Server and Client Components.",
        id: "rsc-boundaries",
        readTime: "7 min read",
        title: "Practical Boundaries for Server Components",
      },
    ],
  },
  "zh-TW": {
    featuredArticle: {
      category: "Next.js",
      description:
        "從頁面快取、資料讀取到互動邊界，建立更快也更容易維護的內容網站。",
      id: "cache-components",
      readTime: "8 分鐘閱讀",
      title: "打造即時感的 Next.js 內容體驗",
    },
    latestArticles: [
      {
        category: "React",
        description: "用更少的 memo，讓元件在正確的邊界自然保持高效。",
        id: "react-compiler",
        readTime: "6 分鐘閱讀",
        title: "React Compiler 改變了哪些元件設計習慣？",
      },
      {
        category: "AI",
        description: "從提示、驗證到錯誤回饋，建立可靠的內容輔助流程。",
        id: "ai-content-workflow",
        readTime: "5 分鐘閱讀",
        title: "讓 AI 成為內容工作流的一部分",
      },
      {
        category: "Next.js",
        description: "釐清 Server Component 與 Client Component 的責任分界。",
        id: "rsc-boundaries",
        readTime: "7 分鐘閱讀",
        title: "Server Component 的實務邊界",
      },
    ],
  },
};

export function getHomeContent(locale: AppLocale) {
  return homeContent[locale];
}
