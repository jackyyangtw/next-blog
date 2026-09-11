# AI SEO Workflow Plan

## Architecture Decision

第一版使用 **Next.js Server Action**，不建立 Route Handler。

原因：

- 此功能只由部落格後台文章編輯器使用。
- 沒有手機 App、外部 Client 或第三方服務需要呼叫。
- 不需要額外維護 HTTP endpoint、request parsing 與 response format。
- Server Action 可直接執行 server-side 權限驗證與 AI 呼叫。
- API key 與 AI provider 邏輯仍只存在 server-side。

整體流程：

```text
Article Editor
      ↓
generateSeoAction()
      ↓
Authentication / Authorization
      ↓
Request Validation
      ↓
generateSeo()
      ↓
Mock or Remote Provider
      ↓
Structured Output
      ↓
Zod Validation
      ↓
Editable Preview
      ↓
Human Approval
      ↓
Update Article Form
      ↓
Existing Save Draft / Publish Flow
```

---

## Updated Folder Structure

```text
src/
├── features/
│   └── ai-seo/
│       ├── actions/
│       │   └── generateSeoAction.ts
│       │
│       ├── components/
│       │   ├── AiSeoAssistant.tsx
│       │   ├── AiSeoPreview.tsx
│       │   └── AiSeoField.tsx
│       │
│       ├── hooks/
│       │   └── useGenerateSeo.ts
│       │
│       ├── server/
│       │   ├── generateSeo.ts
│       │   ├── mockSeo.ts
│       │   └── model.ts
│       │
│       ├── schemas/
│       │   ├── generateSeoRequestSchema.ts
│       │   └── seoSuggestionSchema.ts
│       │
│       └── types/
│           └── index.ts
│
└── lib/
    └── env.ts
```

如果專案已有統一的 `actions/`、`server/` 或 feature-based 結構，應優先遵循現有規範。

不要建立：

```text
src/app/api/ai/seo/route.ts
```

---

## Server Action

建立：

```text
src/features/ai-seo/actions/generateSeoAction.ts
```

範例介面：

```ts
"use server";

import { generateSeoRequestSchema } from "../schemas/generateSeoRequestSchema";
import { generateSeo } from "../server/generateSeo";
import type { SeoSuggestion } from "../schemas/seoSuggestionSchema";

export type GenerateSeoActionResult =
  | {
      success: true;
      data: SeoSuggestion;
    }
  | {
      success: false;
      error: {
        code:
          | "INVALID_INPUT"
          | "UNAUTHORIZED"
          | "CONTENT_TOO_LARGE"
          | "AI_SEO_GENERATION_FAILED";
        message: string;
      };
    };

export async function generateSeoAction(
  input: unknown,
): Promise<GenerateSeoActionResult> {
  // 1. 驗證登入狀態
  // 2. 驗證管理員權限
  // 3. 驗證輸入資料
  // 4. 呼叫 generateSeo()
  // 5. 回傳可序列化結果
}
```

### Responsibilities

Server Action 負責：

- 驗證使用者登入狀態。
- 驗證使用者是否具有文章管理權限。
- 驗證輸入資料。
- 限制文章內容長度。
- 呼叫 `generateSeo()`。
- 將內部錯誤轉換成人類可理解的結果。
- 回傳可序列化資料。

Server Action 不負責：

- 直接寫入 Sanity。
- 自動套用 AI 建議。
- 自動發布文章。
- 在 action 裡塞入所有 prompt 與 provider 細節。
- 將 provider 原始錯誤回傳給 client。

---

## Separation of Concerns

```text
generateSeoAction()
├── Authentication
├── Authorization
├── Input validation
├── Error mapping
└── Calls generateSeo()

generateSeo()
├── Select mock or remote mode
├── Prepare minimal prompt input
├── Call AI provider
├── Validate structured output
└── Return SeoSuggestion

model.ts
└── Configure AI provider and model
```

Server Action 只是 application boundary。

AI 邏輯必須保留在獨立的 `generateSeo()` 中，避免未來需要 Route Handler、background job 或其他入口時重寫核心邏輯。

---

## Client Integration

Client Component 可直接呼叫 Server Action：

```tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { generateSeoAction } from "../actions/generateSeoAction";

export function useGenerateSeo() {
  return useMutation({
    mutationFn: generateSeoAction,
    retry: false,
  });
}
```

使用方式：

```tsx
const generateSeoMutation = useGenerateSeo();

async function handleGenerateSeo() {
  const result = await generateSeoMutation.mutateAsync({
    title,
    content,
    locale,
    existingTags,
  });

  if (!result.success) {
    // 顯示錯誤訊息
    return;
  }

  // 將結果放進 preview state
  // 不直接更新文章表單
}
```

注意：

- AI 結果先進入 Preview。
- 使用者點擊 `Apply Suggestions` 後，才更新 React Hook Form。
- 更新表單不等於儲存 Sanity。
- 最終儲存仍使用既有文章流程。

---

## Updated Frontend Workflow

```text
User clicks Generate SEO
      ↓
TanStack Query mutation
      ↓
generateSeoAction()
      ↓
Permission and input validation
      ↓
generateSeo()
      ↓
Return suggestion
      ↓
Preview state
      ↓
User edits suggestion
      ↓
Apply Suggestions
      ↓
Update React Hook Form
      ↓
User saves draft or publishes
```

---

## Updated Error Handling

Server Action 至少處理：

- 使用者未登入。
- 使用者沒有管理員權限。
- Empty article content。
- Invalid action input。
- Unsupported locale。
- Content exceeding size limit。
- Missing API key。
- Provider timeout。
- Provider rate limit。
- Invalid structured output。
- Unknown AI provider failure。

錯誤結果必須是可序列化資料：

```ts
{
  success: false,
  error: {
    code: "AI_SEO_GENERATION_FAILED",
    message: "目前無法產生 SEO 建議，請稍後再試。"
  }
}
```

禁止把以下內容傳回 client：

- Stack trace
- API key
- 完整 prompt
- Provider request headers
- Provider 原始錯誤物件
- 完整文章內容

---

## Updated Security Requirements

- Server Action 必須包含權限驗證。
- 不得只依靠前端隱藏按鈕控制權限。
- AI provider 與 API key 只能存在 server-side module。
- `generateSeoAction.ts` 必須使用 `"use server"`。
- AI server modules 可加入 `import "server-only"`。
- 所有 action input 必須重新經過 Zod 驗證。
- 所有模型輸出必須經過 Zod 驗證。
- AI 不得直接寫入 Sanity。
- Sanity write token 不得暴露給 Client Component。
- 不在 production log 記錄完整文章內容。

---

## Updated Testing Plan

### Unit Tests

測試：

- `generateSeoRequestSchema`
- `seoSuggestionSchema`
- Mock response
- Slug validation
- Title length validation
- Description length validation
- Tag limits
- Unsupported locale
- Oversized content
- AI output validation
- Error mapping

### Server Action Tests

測試：

- 未登入使用者。
- 非管理員使用者。
- Invalid input。
- Empty content。
- Oversized content。
- Mock mode success。
- Remote provider failure。
- Invalid structured output。
- Missing API key。
- Action 不會直接呼叫 Sanity write。

### Component Tests

測試：

- Generate button disabled state。
- Loading state。
- Success preview。
- Error state。
- Apply Suggestions。
- Cancel。
- Regenerate。
- Apply 前不會修改文章表單。
- Apply 後正確更新文章表單。

### Playwright E2E

```text
Open article editor
      ↓
Enter article content
      ↓
Click Generate SEO
      ↓
Server Action returns mock suggestion
      ↓
Preview suggestions
      ↓
Edit generated title
      ↓
Apply suggestions
      ↓
Verify form fields updated
      ↓
Save draft
```

E2E 必須使用：

```env
AI_SEO_MODE=mock
```

不得在 CI 或 E2E 中呼叫真實模型。

---

## Updated Acceptance Criteria

- [ ] 使用 Server Action 執行 AI SEO generation。
- [ ] 第一版沒有建立 Route Handler。
- [ ] Server Action 驗證 authentication。
- [ ] Server Action 驗證 authorization。
- [ ] Server Action 驗證所有 input。
- [ ] 核心 AI 邏輯與 Server Action 分離。
- [ ] 支援 mock mode。
- [ ] 支援 remote mode。
- [ ] 使用 structured output。
- [ ] 使用 Zod 驗證模型輸出。
- [ ] AI 不直接寫入 Sanity。
- [ ] 有 Preview 與 Apply 流程。
- [ ] 使用者可以修改 AI 建議。
- [ ] API key 不會出現在 client bundle。
- [ ] 不會自動 retry 或無限 regenerate。
- [ ] Unit tests 通過。
- [ ] Server Action tests 通過。
- [ ] Playwright 使用 mock mode 通過。
- [ ] TypeScript、ESLint、test 與 build 全部通過。

---

## Remove From Previous Plan

請從原 Plan 移除以下內容：

```text
POST /api/ai/seo
```

移除：

```text
src/app/api/ai/seo/route.ts
```

移除以下章節：

- API Route
- Success HTTP Response
- Error HTTP Response
- API Tests
- Route Handler responsibilities

並將它們替換為：

- Server Action
- Action result union type
- Server Action tests
- Authentication and authorization inside the action

---

## Future Route Handler Option

Route Handler 不屬於第一版需求。

只有未來出現以下需求時才考慮加入：

- Mobile App
- Chrome Extension
- 外部 CMS
- 第三方服務
- Public API
- MCP Tool
- 不屬於 Next.js React tree 的 Client

未來若需要 Route Handler，應直接重用：

```ts
generateSeo();
```

而不是把 Server Action 邏輯複製進 Route Handler。

---

## Revised Implementation Order

### Phase 1: Types and Validation

1. 建立 request schema。
2. 建立 response schema。
3. 建立 mock response。
4. 加入 unit tests。

### Phase 2: AI Server Layer

1. 安裝 AI SDK 與 provider。
2. 建立 model module。
3. 建立 `generateSeo()`。
4. 支援 mock / remote mode。
5. 加入 structured output validation。

### Phase 3: Server Action

1. 建立 `generateSeoAction()`。
2. 加入 authentication。
3. 加入 authorization。
4. 加入 request validation。
5. 加入 error mapping。
6. 加入 Server Action tests。

### Phase 4: Frontend UI

1. 建立 Generate button。
2. 建立 TanStack Query mutation。
3. 建立 loading / error state。
4. 建立 editable preview。
5. 建立 Apply / Regenerate / Cancel。

### Phase 5: Existing Form Integration

1. Apply suggestion 到 React Hook Form。
2. 不直接寫入 Sanity。
3. 保留既有 Save Draft / Publish 流程。

### Phase 6: Testing and Documentation

1. 補齊 unit tests。
2. 補齊 Server Action tests。
3. 補齊 component tests。
4. 補 Playwright E2E。
5. 更新 README 與 workflow diagram。

---

## Final Constraint

第一版使用：

```text
Client Component
      ↓
Server Action
      ↓
AI Service
```

不要為了抽象化而額外建立 HTTP endpoint。

同時，不要把 AI SDK、prompt、provider configuration 或 API key 放進 Client Component。
