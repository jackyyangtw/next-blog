## 修改前置檢查流程

在修改任何程式碼之前，必須依序完成以下步驟：

### 1. 查閱專案文件與索引

遵循專案根目錄 AGENTS.md 的指示。

特別注意 React 19 / Next.js 16 的新技術規範與 Breaking Changes。

### 2. React Compiler 靜態檢查（核心規範）

在動手前，AI 必須自我檢視是否符合 eslint-plugin-react-compiler 的 Purity 要求：

[純粹性檢查]：確保元件渲染過程中沒有任何 Side Effects（不修改全域變數、不直接變異 Props/State）。

[引用穩定性]：確認所有傳遞給子元件的物件或函式，在資料未變動時保持相同的 Reference（避免 Compiler 無法自動 memoization）。

[Ref 使用規範]：嚴禁在 Render 期間讀取或寫入 ref.current。

[Hook 擺放]：確保 Hook 只出現在最頂層，絕無條件式呼叫（避免 Compiler 優化失敗）。

### 3. 檢查專案現有模式與品質

[元件命名]：禁止使用匿名元件，確保 DevTools 顯示具名元件而非 Anonymous。

[狀態管理]：優先檢查是否能用 Derived State（衍生狀態）解決，嚴禁為了同步狀態而在 useEffect 裡 setState（這會導致 Compiler 負擔過重）。

### 4. 元件結構檢查（200 行拆分規則）

修改完成後，檢查目標元件檔案是否超過 **200 行**。若超過，必須將其拆分為資料夾結構：

- 將內部子元件（`function` 宣告的 React 元件）拆為獨立 `.tsx` 檔
- 將工具函式（如 `formatCurrency`）拆為 `utils.ts`
- 主元件改為 `index.tsx`，負責組合與業務邏輯
- 外部 import 路徑維持不變（資料夾 `index.tsx` 自動解析）

> 完整規範與範例請參閱 [CREATE_COMPONENT.md](./docs/web/Components/CREATE_COMPONENT.md) 的「200 行拆分規則」章節。

### 5. 確認後再動手

說明你查到了什麼、打算怎麼改。

[新增] 預測修改後 React DevTools 是否會顯示 "Memo ✨" 標籤，若會導致 Bail-out（優化失效），必須說明原因。

取得使用者確認後再開始修改。

## Web 測試規範

- 單元測試使用 Vitest，不使用 Playwright 撰寫單元測試。遵循就近放原則：測試檔與被測程式碼放在同一目錄，以同名的 `.spec.ts` 檔案命名（例如 `post.ts` 對應 `post.spec.ts`），不要集中搬到獨立的單元測試目錄。測試檔位於 `apps/web/src/**/*.spec.ts`，從 `vitest` 匯入 `test`、`expect` 等測試 API；目前由 `apps/web/vitest.config.mts` 設定為 Node 環境。
- 端對端測試使用 Playwright，放在 `apps/web/tests/e2e/`；即時導覽測試也使用 Playwright，放在 `apps/web/tests/instant/`，並使用各自的設定檔。
- `test`、`describe` 等測試項目與群組名稱使用繁體中文，清楚描述被驗證的行為。語系代碼、程式識別字及 Sanity 等專有名稱可保留原文。
- 修改單元測試後執行 `pnpm --filter @jacky-dev/web test:unit`；修改端對端或即時導覽測試後，分別執行 `pnpm --filter @jacky-dev/web test:e2e` 或 `pnpm --filter @jacky-dev/web test:instant`。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
