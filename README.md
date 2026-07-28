# Jacky Dev

這是一個以 Next.js App Router 打造的多語系技術部落格與內容平台。專案使用 Sanity 作為 Headless CMS，提供文章列表、分類篩選、關鍵字搜尋、文章詳情、相關文章、會員登入與收藏功能，並整合 SEO metadata、結構化資料、sitemap 與文章快取 revalidate 流程。

後台透過內嵌的 Sanity Studio 管理文章、分類、作者與使用者資料；前台支援繁體中文與英文路由，並以 Material UI 建立一致的深色/淺色主題體驗。

## 主要功能

- 文章首頁、文章列表與文章詳情頁
- 分類篩選、關鍵字搜尋與分頁
- Google 登入與會員資料頁
- 登入會員可收藏/取消收藏文章
- Sanity Studio 管理後台，限制 admin 角色進入
- Sanity 圖片優化與富文本內容呈現
- 多語系路由與介面文案，支援 `zh-TW`、`en`
- 文章 SEO metadata、Open Graph、Twitter Card 與 JSON-LD 結構化資料
- 靜態與動態 sitemap，並排除會員/登入頁
- 文章 revalidate API 與 Sanity 刪除 webhook 清理收藏資料
- AI SEO Assistant：根據文章內容產生 SEO 標題與描述，支援預覽、編輯、套用與重新產生
- AI Reviewer：在發布前檢查技術文章的正確性、可讀性、程式碼範例、缺漏脈絡與 SEO
- Vercel 部署導向的設定

## 技術棧

- **Framework**: Next.js 16、React 19、TypeScript
- **Routing**: App Router、Route Handlers、Dynamic Routes、Parallel/Intercepting Routes
- **CMS**: Sanity、next-sanity、GROQ、Sanity Studio
- **Authentication**: NextAuth.js、Google OAuth
- **UI**: Material UI v7、Emotion、styled-components、react-icons
- **Data Fetching**: TanStack React Query、Next.js cache/revalidate
- **State Management**: Zustand
- **i18n**: i18next、react-i18next、語系 cookie 與 Next proxy 導向
- **SEO**: Next metadata API、next-sitemap、JSON-LD
- **AI**: Vercel AI SDK、`@ai-sdk/openai`、OpenAI structured output、Zod schema validation
- **Validation/Utils**: Zod、Day.js、query-string、use-debounce
- **Tooling**: pnpm、ESLint、Prettier、Husky、lint-staged

## 專案結構

```txt
src/
  app/
    [lng]/              # 多語系前台頁面與 layout
    api/                # Next.js Route Handlers
    studio/             # 內嵌 Sanity Studio
    server-sitemap.xml/ # 動態文章 sitemap
  components/           # 共用 UI 元件
  hooks/                # 共用 hooks
  i18n/                 # i18next 設定與語系文案
  lib/
    api/                # 前端 API fetch 與 React Query hooks
    auth/               # NextAuth 與 Sanity user 整合
  Providers/            # NextAuth、React Query、Cookie providers
  sanity/               # Sanity client、image helper、schema types
  schema/               # Sanity 文件型別
  store/                # Zustand stores
  theme/                # MUI theme 與客製化設定
```

## 開發環境

此專案使用 pnpm：

```bash
pnpm install
pnpm dev
```

預設開發伺服器會啟動在 `http://localhost:3200`。Sanity Studio 路徑為 `/studio`，需登入且使用者 role 為 `admin`。

## 常用指令

```bash
pnpm dev       # 啟動 Next.js 開發伺服器，使用 Turbopack
pnpm build     # 建置正式版本並產生 sitemap
pnpm start     # 啟動正式伺服器
pnpm lint      # 執行 ESLint
pnpm tsc       # TypeScript 型別檢查
pnpm typegen   # 產生 Next.js route/type helper
pnpm sitemap   # 手動產生 sitemap
```

## 內容與資料流程

文章、分類、作者、使用者與收藏資料存放在 Sanity。前台透過 `src/app/api/**/route.ts` 提供文章列表、分類、會員、收藏等 API，客戶端再以 TanStack React Query 管理請求狀態。

登入使用 NextAuth Google Provider。使用者首次登入時會建立或取得對應的 Sanity user 文件，收藏功能會以 Sanity reference 關聯 user 與 post。

文章詳情頁會從 Sanity 取得文章內容，輸出 canonical、hreflang、Open Graph、Twitter Card 與 BlogPosting JSON-LD。`/server-sitemap.xml` 會依照 Sanity 文章與支援語系動態產生 sitemap。

## ✨ AI 功能

AI 功能整合在 Sanity Studio 的 `post` 編輯器中，只有已登入且角色為 `admin` 的使用者可以使用。兩項功能都會將目前文章的標題、描述、分類與 Portable Text 內容轉成純文字後送出，並以 Zod schema 驗證 AI 回傳的結構化結果。

### AI SEO Assistant

在文章編輯器中使用 **AI SEO Assistant** 可以：

- 產生符合目前文章內容的 SEO title 與 description
- 預覽並手動調整建議內容
- 將確認後的結果套用回文章欄位，或重新產生另一份建議
- 支援繁體中文與英文

文章內容至少需要 40 個字元，最多 20,000 個字元。AI 只提供可編輯的建議，不會自動儲存或發布文章。

### AI Reviewer

在文章編輯器中使用 **Technical Article Reviewer** 可以產生發布前的技術文章審查報告，重點包含：

- 技術正確性與事實性
- 容易誤導的說明與缺少的上下文
- 程式碼範例與可讀性
- SEO 與其他可選的改善建議
- 整體分數與高信心、可執行的問題清單

文章內容至少需要 80 個字元，最多 30,000 個字元。Reviewer 只提供審查建議，不會直接改寫文章或產生 patch。

### AI 設定

複製 `env.example` 並設定以下環境變數：

```env
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=your-model-id
AI_SEO_MODE=remote
AI_REVIEW_MODE=remote
```

`AI_SEO_MODE` 與 `AI_REVIEW_MODE` 預設為 `mock`；設定為 `remote` 才會呼叫 OpenAI。未設定 `OPENAI_API_KEY`、API 額度不足、流量限制、逾時或 AI 回傳格式不符合 schema 時，系統會轉換成使用者可理解的錯誤訊息。AI 呼叫在 server side 執行，API key 不會暴露給瀏覽器。

AI 功能的主要程式碼位於：

```txt
src/features/ai/                 # 共用 OpenAI model 設定與錯誤處理
src/features/ai-seo/             # SEO 建議、schema、Server Action 與 Studio 元件
src/features/article-review/     # 文章審查、schema、Server Action 與 Studio 元件
```

## 參考資源

- [MUI Blog template](https://github.com/mui/material-ui/tree/v7.3.1/docs/data/material/getting-started/templates/blog/components)
- [MUI Next.js example](https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-ts/src/app/layout.tsx)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Sanity Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
