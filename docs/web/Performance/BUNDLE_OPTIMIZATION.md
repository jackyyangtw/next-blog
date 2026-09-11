# Web Bundle Optimization Plan

## 目的

本文件記錄 `apps/web` 目前的 production bundle 基準、已確認的主要負擔，以及建議的優化順序。

目標是：

- 降低公開頁面的初始 JavaScript 傳輸量與解析成本
- 縮小 Client Component graph
- 避免把只在特定 route 或互動後才需要的套件放進全域 bundle
- 保留目前的 Next.js 16 Cache Components、React Compiler、MUI 主題與既有功能
- 每一階段都能獨立量測、驗證及回退

本文件只描述優化方向，不代表相關程式碼已經完成修改。

---

## 分析環境

分析日期：2026-09-11

主要版本：

- Next.js `16.3.3`
- React `19.2.7`
- MUI `7.3.7`
- TanStack Query `5.90.x`
- React Syntax Highlighter `16.1.0`
- React Joyride `3.2.0`

目前已啟用：

```ts
const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
};
```

分析方式：

1. 執行 Next.js 16 內建 Turbopack Bundle Analyzer。
2. 啟動 production server。
3. 以 fresh browser profile 載入各 route。
4. 分別記錄 HTML 直接引用的 JS，以及 hydration 與延遲模組完成後的 JS。
5. 將 production assets 以 gzip level 9 重新壓縮，作為一致的比較基準。

執行命令：

```bash
pnpm --filter @jacky-dev/web exec next experimental-analyze --output
pnpm --filter @jacky-dev/web build
pnpm --filter @jacky-dev/web start
```

> 數字是本機 production build 的 gzip 估算值，不等於 CDN 實際 transfer size。部署環境可能使用 Brotli、不同 cache header 或不同 chunk grouping，因此優化前後應在同一環境比較。

---

## Bundle 基準

| Route                       | HTML 初始 JS | Hydration 後 JS | Hydration 後 chunks |
| --------------------------- | -----------: | --------------: | ------------------: |
| `/zh-TW`                    |  332 KB gzip |     373 KB gzip |                  31 |
| `/zh-TW/post`               |  366 KB gzip |     374 KB gzip |                  34 |
| `/zh-TW/auth`               |  314 KB gzip |     374 KB gzip |                  33 |
| `/zh-TW/post/next-js-ci-cd` |  579 KB gzip |     637 KB gzip |                  35 |

兩種數字的意義：

- **HTML 初始 JS**：server 回傳的 HTML 直接宣告載入的 JavaScript。
- **Hydration 後 JS**：fresh browser 完成 hydration、動態 import 與初始 client-side 行為後取得的 JavaScript。

Bundle Analyzer 顯示的 route graph 包含該 route 可到達的同步與非同步模組，不應直接視為首屏下載量。它適合用來找出依賴來源與理論優化上限。

---

## 優先級總覽

| 優先級 | 項目                                        | 主要影響                            | 預期收益                                      | 修改風險 |
| ------ | ------------------------------------------- | ----------------------------------- | --------------------------------------------- | -------- |
| ✅ P0  | 移除完整 Prism language bundle              | 文章頁首屏                          | 約 180–230 KB gzip                            | 中       |
| ✅ P0  | 將 Zod 留在 server validation boundary      | 文章列表、收藏、文章頁 client graph | 實測 `/post`、`/user`、文章頁各 −64 KB gzip   | 中       |
| P1     | 將 React Query Provider 下放到需要的 routes | 所有公開頁面基線                    | 約 12–15 KB gzip，加上較少 hydration          | 低       |
| P1     | 拆分 `PostCards` 的展示與搜尋狀態           | 首頁及文章列表                      | 約 8 KB gzip dependencies，加上較少 hydration | 中       |
| P1     | 延後或改為主動載入 Joyride                  | fresh visitor 的所有公開頁面        | 至少 22 KB gzip immediate load                | 低至中   |
| P2     | 縮減全域 MUI theme customizations           | 所有公開頁面基線                    | 依移除範圍而定                                | 中       |
| P2     | 收窄首頁 Client Component boundaries        | 首頁 hydration 與執行成本           | 小至中                                        | 低至中   |
| P3     | 調整 Turbopack chunking                     | request 數量與 navigation cache     | 需實測                                        | 中       |

---

## P0：移除完整 Prism language bundle

### 現況

文章程式碼區塊目前使用：

```tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
```

目標檔案：

```text
apps/web/src/app/[lng]/post/[slug]/_components/RichText/CodeBlock.tsx
```

這個入口會把大量 `refractor/lang/*` grammar 納入文章頁。production build 中已確認一個包含完整 grammar 集合的 chunk：

- Raw：654 KB
- Gzip：230 KB
- 約佔目前文章頁 HTML 初始 JS 的 40%

### ✅ 建議方案 A：Server-side Shiki

建議優先採用此方案。

流程：

```text
Sanity code block
      ↓
Server Component 執行 syntax highlighting
      ↓
輸出已完成標記的 HTML
      ↓
Client 只保留 CopyButton 等互動 island
```

優點：

- 瀏覽器不需要下載 tokenizer 與 language grammar
- 不需要在 client 重新處理靜態文章內容
- 可以將複製按鈕隔離成很小的 Client Component
- 文章內容更適合 Server Component 與串流輸出

注意事項：

- 只允許由可信 highlighter 產生的 HTML；不要直接插入未處理的使用者 HTML。
- highlighter 應在 server/cache boundary 內重用，避免每次 render 重建高成本物件。
- 保持 light/dark theme 的輸出策略一致，避免 hydration mismatch 或首次顯示閃爍。

### 驗收條件

- 文章頁不再包含目前約 654 KB raw 的完整 grammar chunk。
- 未知 language 有安全且可讀的 plain-text fallback。
- Copy button、行號、light/dark theme 及橫向捲動維持正常。
- 文章頁 HTML 初始 JS 至少降低 150 KB gzip；目標為降低 180 KB 以上。

---

## ✅ P0：將 Zod 留在 server validation boundary

> 已完成。實測結果見本節「實測結果」。

### 現況

部分 API response 同時在 server route 與 client fetch 層執行 Zod parse。

例如 `/api/posts` 已在 Route Handler 驗證：

```ts
return NextResponse.json(PostsResponseSchema.parse(resData));
```

但 client fetch 仍再次執行：

```ts
return PostsResponseSchema.parse(await res.json());
```

Analyzer 顯示 `/post`、`/user` 與文章頁的 client graph 可到達約 96 KB gzip 的 Zod 模組。

相關區域：

```text
apps/web/src/app/api/posts/route.ts
apps/web/src/lib/api/posts/fetch.ts
apps/web/src/lib/api/bookmarks/fetch.ts
apps/web/src/schema/type/
```

### 建議作法

1. API Route Handler 或 Server Action 保留完整 runtime validation。
2. Client fetch 僅 import `type`，不要 import runtime schema。
3. 確認 bookmark、user 與 posts API 都在 server response boundary 驗證。
4. 若特定外部 API 必須在 client 驗證，為該 response 建立較小的專用 validator，不要把整組 domain schema 帶入 client。
5. 所有純型別 import 明確使用 `import type`。

### 取捨

Client 不再重複 parse 自家 API response，代表信任 server 已執行的 validation。若資料可能被 Service Worker、browser extension 或非同源 proxy 改寫，仍需另外評估 client validation 的必要性。

### 驗收條件

- 公開 route 的 client graph 不再包含完整 Zod runtime，或只保留明確需要的最小部分。
- API route 的 invalid response 測試仍能失敗並回報清楚錯誤。
- Client fetch 的回傳型別維持精確，且不以 `any` 取代。

### 實測結果

量測日期：2026-09-11（Prism → Shiki 之後的 HEAD，因此與本文件上方「Bundle 基準」表格不可直接比較）。

方法：`next build` 後，讀取 `server/app/<route>.html` 直接引用的 `/_next/static/chunks/*.js`，逐一以 gzip level 9 壓縮後加總。before/after 只差在 `posts/fetch.ts` 與 `bookmarks/fetch.ts` 兩個檔案。

| Route                |   Before |    After |             差異 |
| -------------------- | -------: | -------: | ---------------: |
| `/zh-TW`             | 323.3 KB | 323.3 KB |                — |
| `/zh-TW/post`        | 420.3 KB | 356.8 KB |     **−63.5 KB** |
| `/zh-TW/user`        | 390.1 KB | 326.2 KB |     **−63.9 KB** |
| `/zh-TW/post/[slug]` |        — | 342.7 KB | 同樣移除該 chunk |
| `/zh-TW/auth`        | 305.7 KB | 305.7 KB |                — |

Before 的 264 個 browser chunk 中有一個專屬 Zod chunk（`1gzf_*.js`，raw 295 KB / gzip 66 KB），被 `/post`、`/user`、`/post/[slug]` 的 HTML **直接引用**，屬首屏初始 JS 而非僅「可到達」。After 以 `ZodError`、`unrecognized_keys`、`invalid_union`、`too_big`、`invalid_enum_value` 等 runtime 字串交叉搜尋全部 browser chunk，命中數為 0。

`server/chunks/ssr/` 仍有 2 個含 Zod 的 chunk，來源是 `ai` / `@ai-sdk/*`（Studio 的 `"use server"` action），屬 server 側，符合預期。

### 實際改動

1. `lib/api/posts/fetch.ts`、`lib/api/bookmarks/fetch.ts`：移除 client 端重複 parse，改為只 `import type`；回傳型別由函式簽章收斂，未使用 `as` 或 `any`。
2. `lib/api/categories/fetch.ts`：型別 import 改為 `import type`。
3. `api/bookmarks/route.ts`：POST/DELETE 補上 `BookmarkMutationResponseSchema.parse(result)`。
4. `api/categories/route.ts`：補上 `z.array(CategorySchema).parse(...)`（先前 server 與 client 皆無驗證）。
5. eslint 啟用 `@typescript-eslint/consistent-type-imports`，全專案 autofix 63 處，避免 runtime schema 再度流入 client graph。

### 待辦

`/api/user` 目前沒有 response schema，也沒有 client 消費者（`lib/api/user/fetch.ts` 與 `useUser` 未被任何元件引用）。因為不構成 client zod 負擔，本輪未處理；未來若要啟用該 API，應一併補上 `UserSchema` 與 route handler 驗證，或移除這段死碼。

---

## P1：將 React Query Provider 下放到需要的 routes

### 現況

目前 provider 結構：

```tsx
<NextAuthProvider>
  <ReactQueryProvider>{children}</ReactQueryProvider>
</NextAuthProvider>
```

目標檔案：

```text
apps/web/src/Providers/index.tsx
apps/web/src/Providers/react-query.tsx
apps/web/src/app/[lng]/layout.tsx
```

因為 `Providers` 位於 `[lng]` layout，首頁與登入頁即使沒有 query，也會取得 Query Client 相關程式碼。

Analyzer 中每個公開 route 都可到達：

- `@tanstack/query-core`：約 10.5–13.8 KB gzip
- `@tanstack/react-query` 與本地 provider：約 2–3 KB gzip

### 建議作法

- `NextAuthProvider` 暫時保留在共用 layout，因為 AppBar 目前需要 session。
- 將 `ReactQueryProvider` 移到真正使用 query 的最近共同 route layout。
- `/post`、`/user` 與文章收藏功能分別確認 provider 所在範圍。
- `/studio` 已有自己的 React Query Provider，不應再依賴公開站 layout。

### 驗收條件

- 首頁與登入頁的 client graph 不再包含 TanStack Query。
- QueryClient 只建立一次，不因 Suspense 或 re-render 重建。
- 文章列表、收藏 mutation、error snackbar 與 devtools 行為維持正常。

---

## P1：拆分 `PostCards` 的展示與搜尋狀態

### 現況

`PostCards` 同時被首頁與文章列表使用，但元件內直接呼叫：

```tsx
const { keyword } = usePostsQueryParams();
```

因此 `PostCards` 必須是 Client Component，首頁也被迫載入：

- `next/navigation` search hooks
- `query-string`
- `dayjs`
- Sanity image URL helper
- 卡片本身的 hydration code

相關檔案：

```text
apps/web/src/components/features/post/PostCards.tsx
apps/web/src/app/[lng]/(home)/_components/PostSection.tsx
apps/web/src/app/[lng]/post/_components/ClientPage.tsx
apps/web/src/app/[lng]/post/_hooks/index.ts
apps/web/src/app/[lng]/(home)/_components/Author.tsx
```

### 建議結構

```text
PostCards                純展示，接收 posts 與 keyword
├── PostCard             純展示
├── Author               server 可先格式化日期
└── HighlightText        接收明確的 highlight 字串

PostListClient           只存在於 /post
└── 從 URL 讀取 keyword、pagination 與 filters
```

首頁直接傳入空的 `keyword`，不需要訂閱 URL search params。

另外可考慮：

- 用 `Intl.DateTimeFormat` 取代僅用於單一日期格式的 `dayjs`。
- 用原生 `URLSearchParams` 取代 `query-string`，前提是目前的陣列與空值語意能完整保留。
- 將 `PostSummary` 等純型別 import 改為 `import type`。

### 進階方案

文章列表已經以 URL query 表示 page、keyword 與 categories，因此可以讓 page Server Component 直接接收 `searchParams`、在 server 查詢資料，再讓篩選控制項執行 navigation。

這能進一步移除文章列表的 client data fetching 與重複 API parsing，但屬於較大的資料流程調整，應在基本拆分後另開階段處理。

### 驗收條件

- 首頁不再因 `PostCards` 載入文章列表專用 hooks。
- 首頁與文章列表外觀、圖片、連結與 highlight 行為不變。
- 搜尋、分類、分頁與 back/forward navigation 維持正常。

---

## P1：延後或改為主動載入 Joyride

### 現況

Joyride 已使用 dynamic import：

```tsx
const JoyRide = dynamic(() => import("./JoyRide"), {
  ssr: false,
});
```

但 fresh visitor 的 store hydration 完成後，`hasCompleted` 預設為 `false`，因此所有公開 route 幾乎立刻載入導覽。

production browser 實測：

- Joyride 主 chunk：66 KB raw / 22 KB gzip
- 還可能共用或新增 tooltip、Floating UI 與 MUI 元件

相關檔案：

```text
apps/web/src/app/[lng]/_components/AppWrapper.tsx
apps/web/src/app/[lng]/_components/JoyRide/index.tsx
apps/web/src/store/useFeatureTourStore.ts
```

### 建議選項

依產品需求選擇其中一種：

1. **使用者主動啟動**：提供「功能導覽」按鈕，點擊時才 import。
2. **延後啟動**：在頁面互動完成或 browser idle 時預載。
3. **Route 限制**：只在與收藏功能直接相關的 route 載入。
4. **分步導覽**：首頁只顯示輕量提示，到文章頁再載入完整 Joyride。

主動啟動能得到最穩定的 bundle 改善，也不會讓導覽與初始 hydration 競爭主執行緒。

### 驗收條件

- 未啟動導覽時不下載 Joyride chunk。
- 已完成導覽的使用者不再載入相關程式碼。
- 鍵盤操作、skip、close、完成狀態與 route navigation 維持正常。

---

## P2：縮減全域 MUI theme customizations

### 現況

`AppTheme` 會在每個公開 route 載入：

```tsx
inputsCustomizations;
dataDisplayCustomizations;
feedbackCustomizations;
navigationCustomizations;
surfacesCustomizations;
```

這些 customization 會引用 Checkbox、ToggleButton、Accordion、Tabs、Stepper、Select 與多個 icons。即使特定 route 不渲染這些元件，它們仍可能進入全域 client graph。

Analyzer 中的可達大小：

| Route  | `@mui/material` | `@mui/system` |           合計 |
| ------ | --------------: | ------------: | -------------: |
| 首頁   |   約 71 KB gzip | 約 22 KB gzip |  約 93 KB gzip |
| 文章頁 |  約 105 KB gzip | 約 22 KB gzip | 約 127 KB gzip |

這是 route graph 數字，包含同步與非同步可達模組，並非全部都一定在首屏形成獨立傳輸。

相關檔案：

```text
apps/web/src/theme/AppTheme.tsx
apps/web/src/theme/themePrimitives.ts
apps/web/src/theme/customizations/
```

### 建議作法

1. 盤點每個 `Mui*` customization 是否仍有實際使用者。
2. 移除未使用的 override 與 default icon JSX。
3. 能以 theme token 或 CSS class 表達的樣式，不要為了 selector import 完整元件模組。
4. 若後台與公開站的需求不同，使用 route group 拆分 theme，而不是讓公開站載入 Studio 專用 customization。
5. 全面移除 MUI 屬於高成本重構，不應作為第一輪 bundle 優化。

Next.js 16.3 已預設優化 `@mui/material`、`@mui/icons-material` 與 `react-icons/*` package imports，因此不需要僅為這些套件額外設定 `experimental.optimizePackageImports`。

### 驗收條件

- 移除的 override 確定沒有視覺回歸。
- Light、dark、system mode 均完成 screenshot comparison。
- AppBar、form controls、cards、dialogs、drawers 與 feedback components 都納入視覺測試。

---

## P2：收窄首頁 Client Component boundaries

### 可直接檢查的元件

以下元件目前有 `"use client"`，但本身沒有 state、effect、event handler 或 browser API：

```text
apps/web/src/app/[lng]/(home)/_components/IntroParts/HeroSystemGraph.tsx
apps/web/src/app/[lng]/(home)/_components/IntroParts/HeroMotionFrame.tsx
```

可以先確認移除 directive 後是否仍能由 MUI 正常輸出樣式。由於內部 MUI 元件本身可能仍是 Client Component，單純移除 directive 的 bundle 收益可能有限，但能避免不必要地擴大 client ownership。

### 需要產品取捨的元件

`TransitionFrame` 使用 IntersectionObserver、React state 與 MUI Fade/Grow/Slide，因此確實需要 client runtime。若動畫不是核心功能，可考慮：

- CSS animation
- `prefers-reduced-motion`
- 單一共用 IntersectionObserver
- 對 below-the-fold 區塊使用較小的 client animation wrapper

`TrackingLight` 需要 pointer tracking，但目前持續執行 requestAnimationFrame loop。這主要是 runtime CPU 問題，不是 bundle 問題，應另以 Performance panel 檢查。

### 驗收條件

- 首頁動畫與 reduced-motion 行為維持正確。
- 沒有 render 期間讀寫 `ref.current`。
- 沒有為了同步 derived state 而新增 `useEffect` + `setState`。
- Lighthouse main-thread work 與 hydration 時間不退步。

---

## P3：Turbopack chunking 實驗

目前各公開 route 在 hydration 後約有 31–35 個 JavaScript chunks。Next.js 16.3 提供實驗性的 `experimental.turbopackChunking`，可以調整：

- `minChunkSize`
- `maxChunkCountPerGroup`
- `maxMergeChunkSize`
- `generateComponentChunks`
- `priorityRoutes`
- `firstPageLoadPriority`

不應在移除大型依賴前先調 chunking，否則只是在重新排列現有負擔。

建議實驗順序：

1. 完成 P0 與 P1。
2. 記錄新的 bundle baseline。
3. 以 `maxChunkCountPerGroup` 約 20 作為實驗起點。
4. 對首頁與文章頁分別測量 cold load、soft navigation 與 repeat visit。
5. 只有在 request 數量、LCP 或 INP 有穩定改善時才保留設定。

風險：更少的 chunks 通常代表更大的單一檔案，可能改善 cold load，卻降低跨 route navigation 的 cache reuse。

---

## 不建議優先處理的項目

### Studio bundle

`/studio` 的可達 client graph 約 3 MB gzip，包含 Sanity Studio、CodeMirror、Portable Text editor 與 HLS 等大型依賴。

目前 Studio 已隔離在獨立 route，且 `NextStudio` 使用 dynamic import，因此不會污染公開站 route。除非 Studio 本身的載入體驗成為產品問題，否則優先度低於公開頁面。

### MUI direct imports

專案同時存在：

```tsx
import Button from "@mui/material/Button";
```

及：

```tsx
import { Button } from "@mui/material";
```

Next.js 16.3 已預設最佳化 MUI barrel imports。統一 import style 可以改善一致性，但目前不是最主要的 production bundle 優化來源。

### 全面更換 UI library

移除 MUI/Emotion 的確可能大幅降低全站 JavaScript，但會牽涉主題、元件、accessibility、互動與視覺回歸。應先完成低風險的 client boundary 與大型套件優化，再決定是否值得進行。

---

## 建議執行階段

### Phase 1：高收益、可獨立驗證

1. 將 syntax highlighting 移到 server，或改成 PrismLight。
2. 移除 client-side 重複 Zod parsing。
3. 重新產生 analyzer report。
4. 比較文章頁與文章列表的 initial/hydrated JS。

### Phase 2：Provider 與 client boundary

1. 將 React Query Provider 下放。
2. 拆分 `PostCards` 展示元件與 route state。
3. 將日期格式化留在 server。
4. 確認首頁不再載入文章列表專用 hooks。

### Phase 3：延遲功能與 theme trimming

1. 將 Joyride 改為主動或 idle 載入。
2. 清理未使用的 MUI theme customizations。
3. 收窄首頁 client-only animation 元件。

### Phase 4：Chunking benchmark

只有在前三階段完成後，才調整 Turbopack chunk heuristics。

---

## 每階段驗證清單

### 靜態品質

```bash
pnpm --filter @jacky-dev/web lint
pnpm --filter @jacky-dev/web typecheck
pnpm --filter @jacky-dev/web test:unit
```

### Production build

```bash
pnpm --filter @jacky-dev/web build
pnpm --filter @jacky-dev/web exec next experimental-analyze --output
```

### Route smoke test

- `/zh-TW`
- `/en`
- `/zh-TW/post`
- `/zh-TW/auth`
- 一篇包含 code block 的文章
- 一篇包含圖片、表格、inline code 的文章
- 已登入及未登入的 `/[lng]/user`
- 收藏新增及移除
- 首次訪客與已完成導覽的訪客

### Bundle comparison

每次記錄：

- Initial JS gzip
- Hydration 後 JS gzip
- JavaScript chunk 數量
- 最大的前 10 個 chunks
- Route graph 中最大的前 10 個 packages
- Lighthouse LCP、INP、TBT

不要只看總 bundle；同時比較首屏載入、互動後載入及 soft navigation。

---

## React Compiler 與元件品質要求

這些 bundle 優化不應以犧牲 React Compiler compatibility 為代價。

修改時必須維持：

- Render 過程純粹，不修改全域資料、props 或 state。
- Hook 只在元件或 custom hook 頂層呼叫。
- Render 期間不讀寫 `ref.current`。
- 優先使用 derived state，不用 `useEffect` 同步可直接計算的 state。
- 傳入子元件的非 primitive props 在資料未變時保持穩定。
- 所有 React 元件具名。
- 超過 200 行的元件依 `docs/web/Components/CREATE_COMPONENT.md` 拆分。

預期結果：

- 拆出的純展示元件與穩定 props 元件應有機會在 React DevTools 顯示 `Memo ✨`。
- Server Components 不需要 client memoization。
- 第三方 dynamic components 是否顯示 `Memo ✨` 不作為驗收標準。
- 若出現 Compiler bail-out，必須記錄原因，不應以手動 `memo` 掩蓋 purity 問題。

---

## 成功標準

第一輪建議目標：

- 文章頁 HTML 初始 JS：由約 579 KB gzip 降到 400 KB 以下。
- 文章頁 hydration 後 JS：由約 637 KB gzip 降到 450 KB 以下。
- 首頁 hydration 後 JS：由約 373 KB gzip 降到 340 KB 以下。
- 未啟動導覽時不下載 Joyride。
- 首頁與登入頁不包含 TanStack Query runtime。
- 公開 client graph 不包含完整 Prism grammar 集合。
- 不產生 hydration error、React Compiler bail-out 或主要視覺回歸。

這些數字是方向性 budget；最終門檻應以相同機器、相同 production 設定與相同測試頁面取得的 before/after 結果為準。
