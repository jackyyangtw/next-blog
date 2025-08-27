# 型別命名規則

## 命名慣例

- `XxxSchema`：zod/yup 等 schema 定義本體
- `XxxDoc`：由 schema 推導出的「一筆文件資料」型別，通常對應資料庫（如 Sanity）文件結構
- `XxxInput`：用於表單送出、API 輸入等資料型別
- `XxxProps`：React 元件的 props 型別

### 實例

```ts
// author.ts
export const AuthorSchema = z.object({ ... })
export type AuthorDoc = z.infer<typeof AuthorSchema>

// post.ts
export const PostSchema = z.object({ ... })
export type PostDoc = z.infer<typeof PostSchema>
```

### 命名原則說明
- `XxxDoc` 明確表示「這是來自資料庫的一筆文件資料」，避免與 domain model、元件名稱混淆。
- `XxxSchema`/`XxxDoc` 命名慣例有助於團隊理解型別來源與用途，提升維護性與擴充性。
- 其他用途請依語意命名（如 `XxxInput`、`XxxViewModel`、`XxxProps` 等）。 