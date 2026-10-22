// 不需翻譯的專案資料；標題、說明與亮點放在 projects-page 翻譯檔的 items.<key>
export interface Project {
  key: "billing_vault" | "job_tracker";
  // demoUrl 與 repoUrl 皆選填，但每個專案至少要有一個（由 projects.spec.ts 檢查）
  // 訪客無法登入使用的專案不放 demoUrl，避免連到進不去的登入頁
  demoUrl?: string;
  repoUrl?: string;
  // 放在 public/images/projects/，尚未提供時卡片改顯示文字佔位
  image?: string;
  techStack: string[];
  highlightCount: number;
}

export const PROJECTS: readonly Project[] = [
  {
    key: "billing_vault",
    demoUrl: "https://billing-vault.vercel.app/",
    repoUrl: "https://github.com/jackyyangtw/BillingVault",
    image: "/images/projects/billing-vault.webp",
    techStack: ["Next.js", "TypeScript", "Supabase", "Prisma", "TapPay"],
    highlightCount: 3,
  },
  {
    key: "job_tracker",
    repoUrl: "https://github.com/jackyyangtw/job-tracker",
    image: "/images/projects/job-tracker-mobile.webp",
    techStack: ["Next.js", "TypeScript", "PWA", "Google OAuth"],
    highlightCount: 3,
  },
];
