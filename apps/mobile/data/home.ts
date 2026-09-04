export const topics = ["全部", "React", "Next.js", "AI"] as const;

export type Topic = (typeof topics)[number];

export interface ArticlePreview {
  category: Exclude<Topic, "全部">;
  description: string;
  id: string;
  readTime: string;
  title: string;
}

export const featuredArticle: ArticlePreview = {
  category: "Next.js",
  description:
    "從頁面快取、資料讀取到互動邊界，建立更快也更容易維護的內容網站。",
  id: "cache-components",
  readTime: "8 分鐘閱讀",
  title: "打造即時感的 Next.js 內容體驗",
};

export const latestArticles: readonly ArticlePreview[] = [
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
];
