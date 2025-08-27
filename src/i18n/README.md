# 🌏 i18n 多語系整合說明

本專案採用 [i18next](https://www.i18next.com/) 與 [react-i18next](https://react.i18next.com/) 實現多語系支援，並整合 Next.js App Router。

## 📦 架構說明

- 語系檔案放置於：`/i18n/locales/{語系碼}/{namespace}.json`
- 例如：`/i18n/locales/zhTW/home.json`
- 支援語系設定於：`/i18n/config.ts`
- 型別定義於：`/types/locale.ts`, `./types`
- 客戶端 hooks：`/i18n/client.ts`
- 伺服端 hooks：`/i18n/index.ts`

## ➕ 如何新增語系

1. 在 `/i18n/locales/` 下新增語系資料夾（如 `ja`）。
2. 複製現有語系的 json 檔案（如 `home.json`、`auth.json`、`footer.json`）到新語系資料夾，並翻譯內容。
3. 編輯 `/types/locale.ts`，於 `Locale` 型別中加入新語系。
4. 編輯 `/i18n/config.ts`，於 `languages` 陣列中加入新語系碼。
5. 編輯 `/i18n/config.ts`，於 `MUILocaleMap` 物件中加入新語系對應的 MUI 語系設定（如有支援）。

## ➕ 如何新增 NameSpace

在 `/i18n/types.d.ts` Namespace 中新增 namespace，這樣在開發的時候才會出現提示

### 範例：語系檔案結構

```plaintext
/i18n/locales/
  ├── zhTW/
  │   ├── home.json
  │   ├── auth.json
  │   └── footer.json
  └── en/
      ├── home.json
      ├── auth.json
      └── footer.json
```

#### home.json 範例

```json
// zhTW/home.json
{
  "greeting": "哈囉",
  "logout": "登出"
}

// en/home.json
{
  "greeting": "Hello",
  "logout": "Logout"
}
```

## 🛠️ 如何在元件中使用 i18n

### 客戶端元件

```tsx
import { useClientTranslation } from "@/i18n/client";
import { useParams } from "next/navigation";
import { Locale } from "@/types/locale";

export default function MyComponent() {
  const { t } = useClientTranslation("home");
  return <div>{t("greeting")}</div>;
}
```

### 伺服端元件

```tsx
import { getServerTranslation } from "@/i18n";
import { Locale } from "@/types/locale";

export default async function Page({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getServerTranslation(lng as Locale, "home");
  return <div>{t("greeting")}</div>;
}
```

## 🔄 語系切換

- 語系偵測順序：網址路徑 > HTML 標籤 > Cookie > 瀏覽器
- Cookie 名稱：`i18next`
- 新增語系後，請同步更新 `Locale` 型別與 `languages` 陣列。

## 📚 參考連結

- [i18next 讓你的 Next.js 專案輕鬆切換語系（繁體中文）](https://medium.com/@Hsu.Yang-Min/i18next-%E8%AE%93%E4%BD%A0%E7%9A%84-next-js-%E5%B0%88%E6%A1%88%E8%BC%95%E9%AC%86%E5%88%87%E6%8F%9B%E8%AA%9E%E7%B3%BB-7e057791d601)
- [Next.js App Router 國際化官方文件](https://nextjs.org/docs/app/guides/internationalization)
